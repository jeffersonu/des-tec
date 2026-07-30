import React, { createContext, useContext, useState, useEffect } from 'react';
import { TimeThemeId, TimeThemeConfig, themes, getThemeForHour } from '../utils/theme';

interface TimeThemeContextType {
  activeThemeId: TimeThemeId;
  theme: TimeThemeConfig;
  isRealTime: boolean;
  systemHour: number;
  setThemeById: (id: TimeThemeId) => void;
  setRealTime: (enabled: boolean) => void;
}

const TimeThemeContext = createContext<TimeThemeContextType | undefined>(undefined);

export const TimeThemeInterfaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRealTime, setIsRealTime] = useState<boolean>(() => {
    const saved = localStorage.getItem('des_tec_time_realtime');
    return saved === null ? true : saved === 'true';
  });

  const [manualThemeId, setManualThemeId] = useState<TimeThemeId>(() => {
    const saved = localStorage.getItem('des_tec_time_manual_theme');
    return (saved as TimeThemeId) || 'night';
  });

  const [systemHour, setSystemHour] = useState<number>(() => new Date().getHours());

  // Periodically check and update current real-time system hour
  useEffect(() => {
    const updateHour = () => {
      const now = new Date();
      setSystemHour(now.getHours());
    };

    const interval = setInterval(updateHour, 60000); // check every minute
    return () => clearInterval(interval);
  }, []);

  // Compute the active theme ID depending on whether real-time is enabled
  const activeThemeId = isRealTime ? getThemeForHour(systemHour) : manualThemeId;
  const theme = themes[activeThemeId];

  const setThemeById = (id: TimeThemeId) => {
    setIsRealTime(false);
    setManualThemeId(id);
    localStorage.setItem('des_tec_time_realtime', 'false');
    localStorage.setItem('des_tec_time_manual_theme', id);
  };

  const setRealTime = (enabled: boolean) => {
    setIsRealTime(enabled);
    localStorage.setItem('des_tec_time_realtime', enabled ? 'true' : 'false');
  };

  return (
    <TimeThemeContext.Provider
      value={{
        activeThemeId,
        theme,
        isRealTime,
        systemHour,
        setThemeById,
        setRealTime,
      }}
    >
      {children}
    </TimeThemeContext.Provider>
  );
};

export const useTimeTheme = () => {
  const context = useContext(TimeThemeContext);
  if (!context) {
    throw new Error('useTimeTheme must be used within a TimeThemeInterfaceProvider');
  }
  return context;
};
