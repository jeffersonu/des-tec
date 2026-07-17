import React, { useState, useEffect, useRef } from 'react';
import {
  X, Play, RefreshCw, Send, CheckCircle2, Plus, ArrowRight, Settings, Trash2, Shield, Flame, Activity,
  Ship, Anchor, MapPin, Sliders, Calendar, DollarSign, Smartphone, MessageSquare, Check, User, Bot, Wifi, HelpCircle,
  Lock, Globe, ArrowLeft, RotateCw, LayoutDashboard, FileText, BarChart3, ListChecks, History, Database, Network, TrendingUp, Info, ChevronRight, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioProject } from '../../types';

interface PortfolioModalProps {
  project: PortfolioProject;
  onClose: () => void;
}

export default function PortfolioModal({ project, onClose }: PortfolioModalProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Reset tab when project changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [project]);

  // ==========================================
  // 1. STATE FOR ORACLE FINANCIAL CALCULATOR
  // ==========================================
  const [financeInput, setFinanceInput] = useState({
    initial: 15000,
    monthly: 400,
    rate: 8.5,
    years: 12,
  });
  const [savedSims, setSavedSims] = useState<any[]>([
    { id: 1, label: 'Fondo de Retiro', balance: 135600, years: 12, monthly: 400 },
    { id: 2, label: 'Expansión de Oficina', balance: 54000, years: 5, monthly: 600 }
  ]);

  const calculateFinanceData = () => {
    const data = [];
    let balance = financeInput.initial;
    const monthlyRate = financeInput.rate / 100 / 12;

    for (let year = 1; year <= financeInput.years; year++) {
      for (let month = 1; month <= 12; month++) {
        balance += financeInput.monthly;
        balance += balance * monthlyRate;
      }
      data.push({
        year,
        contributions: Math.round(financeInput.initial + financeInput.monthly * 12 * year),
        balance: Math.round(balance),
        interest: Math.round(balance - (financeInput.initial + financeInput.monthly * 12 * year)),
      });
    }
    return data;
  };

  const financeResults = calculateFinanceData();
  const finalResult = financeResults[financeResults.length - 1] || { balance: 0, contributions: 0, interest: 0 };

  const handleSaveSim = () => {
    const title = `Simulación #${savedSims.length + 1} (${financeInput.years}a - €${financeInput.monthly}/m)`;
    setSavedSims([
      ...savedSims,
      { id: Date.now(), label: title, balance: finalResult.balance, years: financeInput.years, monthly: financeInput.monthly }
    ]);
    showToast('Simulación guardada con éxito en tu laboratorio local.', 'success');
  };

  // ==========================================
  // 2. STATE FOR CARGOFLOW
  // ==========================================
  const [cargoInput, setCargoInput] = useState({
    containerType: '40hc' as '20gp' | '40gp' | '40hc' | 'reefer',
    weight: 18,
    originDest: 'val-mia' as 'val-mia' | 'bcn-ver' | 'bil-rot',
    insurance: true,
  });
  const [transitProgress, setTransitProgress] = useState(0);
  const [isTransitActive, setIsTransitActive] = useState(false);
  const [transitStep, setTransitStep] = useState(1);
  const transitInterval = useRef<any>(null);

  const containerRates = {
    '20gp': { label: '20ft Standard', base: 1950, maxWeight: 22, volume: 33 },
    '40gp': { label: '40ft Standard', base: 2900, maxWeight: 26, volume: 67 },
    '40hc': { label: '40ft High Cube', base: 3450, maxWeight: 26, volume: 76 },
    'reefer': { label: '40ft Refrigerado', base: 4950, maxWeight: 24, volume: 60 },
  };

  const routes = {
    'val-mia': { label: 'Valencia (ES) ➔ Miami (USA)', days: 12, mult: 1.4, code: 'VAL-MIA' },
    'bcn-ver': { label: 'Barcelona (ES) ➔ Veracruz (MX)', days: 15, mult: 1.6, code: 'BCN-VER' },
    'bil-rot': { label: 'Bilbao (ES) ➔ Rotterdam (NL)', days: 4, mult: 0.8, code: 'BIL-ROT' },
  };

  const selectedRate = containerRates[cargoInput.containerType];
  const selectedRoute = routes[cargoInput.originDest];
  const totalFlete = Math.round(
    (selectedRate.base + cargoInput.weight * 60) * selectedRoute.mult + (cargoInput.insurance ? 250 : 0)
  );

  const startCargoSimulation = () => {
    if (isTransitActive) return;
    setIsTransitActive(true);
    setTransitProgress(0);
    setTransitStep(1);

    transitInterval.current = setInterval(() => {
      setTransitProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(transitInterval.current);
          setIsTransitActive(false);
          setTransitStep(4);
          return 100;
        }
        if (next < 30) setTransitStep(1);
        else if (next < 65) setTransitStep(2);
        else setTransitStep(3);
        return next;
      });
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (transitInterval.current) clearInterval(transitInterval.current);
    };
  }, []);

  // ==========================================
  // 3. STATE FOR REMODELACIONESYA
  // ==========================================
  const [remodInput, setRemodInput] = useState({
    roomType: 'cocina' as 'cocina' | 'banio' | 'salon' | 'integral',
    areaSize: 55,
    quality: 'media' as 'estandar' | 'media' | 'alta',
  });
  const [sliderPosition, setSliderPosition] = useState(50);

  const roomPricing = {
    'cocina': { label: 'Cocina de Diseño', basePerM2: 390, designCost: 1400 },
    'banio': { label: 'Baño de Lujo', basePerM2: 330, designCost: 950 },
    'salon': { label: 'Salón Comedor', basePerM2: 195, designCost: 750 },
    'integral': { label: 'Reforma Integral', basePerM2: 540, designCost: 3200 },
  };

  const qualityMultipliers = {
    'estandar': { label: 'Estándar Confort', mult: 1.0, details: 'Acabados laminados, pintura premium, iluminación LED.' },
    'media': { label: 'Gama Media Premium', mult: 1.45, details: 'Encimeras de cuarzo, gres porcelánico, grifería empotrada.' },
    'alta': { label: 'Lujo Sostenible', mult: 2.15, details: 'Mármoles exóticos, maderas nobles, domótica avanzada.' },
  };

  const selectedRoomPrice = roomPricing[remodInput.roomType];
  const selectedQualityPrice = qualityMultipliers[remodInput.quality];
  const estimatedCost = Math.round(
    (selectedRoomPrice.basePerM2 * remodInput.areaSize * selectedQualityPrice.mult) + selectedRoomPrice.designCost
  );

  const breakdown = {
    materiales: Math.round(estimatedCost * 0.45),
    manoObra: Math.round(estimatedCost * 0.35),
    permisos: Math.round(estimatedCost * 0.10),
    arquitectura: Math.round(estimatedCost * 0.10),
  };

  // ==========================================
  // 4. STATE FOR CRM & WHATSAPP AUTOMATION
  // ==========================================
  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: '1', sender: 'bot', text: '¡Hola! Bienvenido a Des-Tec Automations. 🤖 Soy el asistente virtual integrado de tu CRM. ¿Qué te gustaría cotizar o automatizar hoy?', time: '10:15 AM' }
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [crmLeads, setCrmLeads] = useState<any[]>([
    { id: 'l1', name: 'Alfonso Torres', email: 'a.torres@corporativo.com', interest: 'RemodelacionesYa', status: 'contactado', phone: '+34 611 223 344' },
    { id: 'l2', name: 'Sofía Rincón', email: 's.rincon@logistica.com', interest: 'CargoFlow SaaS', status: 'negociacion', phone: '+34 688 998 877' }
  ]);
  const [crmLogs, setCrmLogs] = useState<string[]>([
    '⚙️ Webhook n8n activo en /api/webhook/whatsapp-leads',
    '🟢 Conectado con WhatsApp Cloud API (Producción)'
  ]);

  const addCrmLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setCrmLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 5)]);
  };

  const handleSendWA = (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: 'user', text, time }]);
    setIsBotTyping(true);
    addCrmLog(`📡 WhatsApp Webhook recibido: "${text}"`);

    setTimeout(() => {
      setIsBotTyping(false);
      let reply = '';
      let interest = 'Automatización General';
      let leadName = 'Prospecto Express';

      if (text.toLowerCase().includes('remodel')) {
        reply = 'Perfecto. He detectado tu interés en RemodelacionesYa. He enviado tu cotización a un asesor técnico para agendar una cita virtual. ¿Tu correo es corporativo?';
        interest = 'RemodelacionesYa';
        leadName = 'Cliente Reformas';
      } else if (text.toLowerCase().includes('cargo')) {
        reply = '¡Entendido! Con CargoFlow automatizamos fletes y CBM al instante. Acabo de crear tu ficha en el CRM y activado la simulación. ¿Qué puertos sueles utilizar?';
        interest = 'CargoFlow SaaS';
        leadName = 'Importaciones S.A.';
      } else {
        reply = '¡Datos registrados! He sincronizado tu número con el CRM de la empresa usando n8n. Un consultor se pondrá en contacto contigo en breve.';
        interest = 'Integración n8n';
        leadName = 'Lead WhatsApp';
      }

      setChatMessages((prev) => [...prev, { id: `b-${Date.now()}`, sender: 'bot', text: reply, time }]);
      
      const newLead = {
        id: `l-${Date.now()}`,
        name: leadName,
        email: 'contacto@whatsapp.com',
        interest,
        status: 'calificado',
        phone: '+34 600 WA LEAD'
      };
      setCrmLeads((prev) => [newLead, ...prev]);
      addCrmLog(`⚡ n8n workflow completado: Lead "${newLead.name}" calificado insertado en CRM.`);
    }, 1100);
  };

  return (
    <div
      id="portfolio-modal-overlay"
      className="fixed inset-0 w-full h-full bg-[var(--color-secondary)]/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        id="portfolio-modal-container"
        className="relative bg-[var(--color-surface)] rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200"
      >
        {/* GOOGLE CHROME BROWSER WINDOW REPLICA TOP BAR */}
        <div className="bg-[#ECECEF] px-4 py-2 flex flex-col border-b border-[#D1D1D6] shrink-0 select-none">
          {/* OS Window dots & Chrome Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* macOS window control buttons */}
              <div className="flex items-center space-x-1.5 mr-4">
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity" title="Cerrar" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              </div>

              {/* Active Chrome Tab */}
              <div className="flex items-center bg-[var(--color-surface)] px-4 py-1.5 rounded-t-lg border-t border-x border-[#D1D1D6] space-x-2 -mb-1.5 z-10 w-44 shadow-[0_-2px_5px_rgba(0,0,0,0.03)]">
                <Globe className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="text-[11px] font-sans font-bold text-gray-700 truncate">{project.title}</span>
              </div>
              <button className="p-1 rounded hover:bg-gray-300/40 text-gray-500">
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1 rounded-md border border-red-200 text-[10px] font-bold transition-all"
            >
              <X className="w-3 h-3" />
              <span>Salir del Entorno</span>
            </button>
          </div>

          {/* Chrome Navigation address bar */}
          <div className="flex items-center space-x-3 mt-2 bg-[#F2F2F7] rounded-lg px-3 py-1 border border-[#E5E5EA]">
            <div className="flex items-center space-x-3 text-gray-400 shrink-0">
              <ArrowLeft className="w-3.5 h-3.5 cursor-not-allowed opacity-50" />
              <ArrowRight className="w-3.5 h-3.5 cursor-not-allowed opacity-50" />
              <RotateCw className="w-3.5 h-3.5 cursor-pointer hover:text-gray-700" onClick={() => setActiveTab('dashboard')} />
            </div>

            {/* Simulated SSL secure URL input field */}
            <div className="flex-1 bg-white border border-[#D1D1D6] rounded px-3 py-1 flex items-center space-x-1.5 text-gray-500 text-[11px]">
              <Lock className="w-3 h-3 text-[#10B981] shrink-0" />
              <span className="text-[#10B981] font-bold font-sans">Secure</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-800 font-mono">
                https://{project.id}.des-tec.studio/{activeTab}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-500 shrink-0">
              <Settings className="w-3.5 h-3.5 cursor-pointer hover:text-gray-800" />
              <div className="w-5 h-5 rounded-full bg-[#E5E5EA] border border-gray-300 text-gray-700 text-[9px] font-bold flex items-center justify-center">
                US
              </div>
            </div>
          </div>
        </div>

        {/* BROWSER VIEWPORT CONTAINER */}
        <div id="browser-viewport" className="flex-1 flex overflow-hidden bg-[#FAFAFC] text-[var(--color-text)]">
          
          {/* SAAS APP MAIN INNER LAYOUT */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* 1. APP SIDEBAR NAVIGATION (Within the App, replacing wireframe details) */}
            <aside className="w-56 bg-[var(--color-surface)] border-r border-[#E5E5EA] flex flex-col justify-between p-4 shrink-0 text-left select-none">
              <div className="space-y-6">
                {/* Simulated Corporate Logo inside the SaaS */}
                <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-primary)] font-black text-sm">
                    {project.liveAppType === 'calculator' && 'Ω'}
                    {project.liveAppType === 'cargoflow' && 'CF'}
                    {project.liveAppType === 'remodelacionesya' && 'RY'}
                    {project.liveAppType === 'crm-whatsapp' && 'AS'}
                  </div>
                  <div>
                    <h5 className="text-[11px] font-sans font-black tracking-wider text-gray-900 uppercase">
                      {project.liveAppType === 'calculator' && 'Oracle Finance'}
                      {project.liveAppType === 'cargoflow' && 'CargoFlow'}
                      {project.liveAppType === 'remodelacionesya' && 'RemodelYa'}
                      {project.liveAppType === 'crm-whatsapp' && 'AeroSync CRM'}
                    </h5>
                    <span className="text-[8px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.2 rounded font-bold uppercase tracking-wide">
                      Producción
                    </span>
                  </div>
                </div>

                {/* Sidebar Tab Menu Buttons */}
                <div className="space-y-1">
                  {project.liveAppType === 'calculator' && (
                    <>
                      {[
                        { id: 'dashboard', label: 'Cuadro de Mando', icon: LayoutDashboard },
                        { id: 'projections', label: 'Proyecciones', icon: TrendingUp },
                        { id: 'allocation', label: 'Distribución', icon: BarChart3 },
                        { id: 'settings', label: 'Preferencias', icon: Settings },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id)}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === t.id
                              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <t.icon className={`w-4 h-4 ${activeTab === t.id ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </>
                  )}

                  {project.liveAppType === 'cargoflow' && (
                    <>
                      {[
                        { id: 'dashboard', label: 'Tránsito de Flota', icon: Ship },
                        { id: 'quote', label: 'Cálculo de Tarifas', icon: Sliders },
                        { id: 'fleet', label: 'Métricas CBM', icon: BarChart3 },
                        { id: 'declarations', label: 'Aduanas', icon: FileText },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id)}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === t.id
                              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <t.icon className={`w-4 h-4 ${activeTab === t.id ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </>
                  )}

                  {project.liveAppType === 'remodelacionesya' && (
                    <>
                      {[
                        { id: 'dashboard', label: 'Planificador', icon: Sliders },
                        { id: 'moodboard', label: 'Antes y Después', icon: Eye },
                        { id: 'budget', label: 'Presupuesto PDF', icon: FileText },
                        { id: 'gantt', label: 'Cronograma Obra', icon: Calendar },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id)}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === t.id
                              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <t.icon className={`w-4 h-4 ${activeTab === t.id ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </>
                  )}

                  {project.liveAppType === 'crm-whatsapp' && (
                    <>
                      {[
                        { id: 'dashboard', label: 'Chats de WhatsApp', icon: MessageSquare },
                        { id: 'pipeline', label: 'Kanban CRM', icon: LayoutDashboard },
                        { id: 'n8n', label: 'Consola n8n Webhook', icon: Database },
                        { id: 'analytics', label: 'Estadísticas n8n', icon: Activity },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id)}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === t.id
                              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <t.icon className={`w-4 h-4 ${activeTab === t.id ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar bottom feedback info */}
              <div className="pt-4 border-t border-gray-100 space-y-1.5 text-left">
                <span className="text-[9px] font-sans font-bold text-gray-400 block uppercase">
                  Tecnologías Activas
                </span>
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[8px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            {/* 2. MAIN INNER WORKSPACE */}
            <main className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 text-left space-y-6"
                >
                  {/* ========================================================== */}
                  {/* PROJECT INTERFACE 1: ORACLE FINANCIALS (calculator) */}
                  {/* ========================================================== */}
                  {project.liveAppType === 'calculator' && (
                    <>
                      {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                            <div>
                              <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-gray-900">Cuadro de Mando Corporativo</h2>
                              <p className="text-xs text-gray-500">Métricas consolidadas de rendimiento del fondo patrimonial en tiempo real.</p>
                            </div>
                            <span className="text-xs bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/25 px-2.5 py-1 rounded font-bold">
                              Rendimiento: {financeInput.rate}% anual
                            </span>
                          </div>

                          {/* Quick Corporate KPIs */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">CAPITAL FINAL ESTIMADO</span>
                              <div className="text-2xl font-black font-mono text-[var(--color-secondary)] mt-1">€{finalResult.balance.toLocaleString()}</div>
                              <span className="text-[10px] text-green-600 font-bold flex items-center space-x-1 mt-0.5">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>Tasa Compuesta Activa</span>
                              </span>
                            </div>
                            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">TOTAL APORTADO</span>
                              <div className="text-2xl font-black font-mono text-gray-700 mt-1">
                                €{Math.round(financeInput.initial + financeInput.monthly * 12 * financeInput.years).toLocaleString()}
                              </div>
                              <span className="text-[10px] text-gray-500 font-semibold mt-0.5 block">Capital Inicial + Mensuales</span>
                            </div>
                            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">INTERESES REINVERTIDOS</span>
                              <div className="text-2xl font-black font-mono text-green-600 mt-1">€{finalResult.interest.toLocaleString()}</div>
                              <span className="text-[10px] text-green-600 font-bold block mt-0.5">Efecto Interés Compuesto</span>
                            </div>
                          </div>

                          {/* SVG Growth Chart */}
                          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
                            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-4">Evolución del Fondo a Largo Plazo</h4>
                            <div className="w-full h-48">
                              <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="chart-glow-orange" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0" />
                                  </linearGradient>
                                </defs>
                                <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                                <path
                                  d={`M 0 120 ${financeResults.map((res, idx) => {
                                    const x = (idx / (financeResults.length - 1)) * 500;
                                    const y = 120 - (res.balance / (finalResult.balance || 1)) * 100;
                                    return `L ${x} ${y}`;
                                  }).join(' ')} L 500 120 Z`}
                                  fill="url(#chart-glow-orange)"
                                />
                                <path
                                  d={financeResults.map((res, idx) => {
                                    const x = (idx / (financeResults.length - 1)) * 500;
                                    const y = 120 - (res.balance / (finalResult.balance || 1)) * 100;
                                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                                  }).join(' ')}
                                  fill="none"
                                  stroke="var(--color-primary)"
                                  strokeWidth="2.5"
                                />
                              </svg>
                              <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold font-mono">
                                <span>Año 1</span>
                                <span>Año {Math.round(financeInput.years / 2)}</span>
                                <span>Año {financeInput.years} (Fin)</span>
                              </div>
                            </div>
                          </div>

                          {/* Recent Audited Transactions Table */}
                          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Últimas Operaciones del Fondo</h4>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs font-sans">
                                <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                                  <tr>
                                    <th className="p-3">Fecha</th>
                                    <th className="p-3">Concepto / Operación</th>
                                    <th className="p-3">Destino</th>
                                    <th className="p-3 text-right">Monto</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700">
                                  <tr>
                                    <td className="p-3 font-mono">10-Jul-2026</td>
                                    <td className="p-3 font-bold text-gray-900">Rebalanceo Automatizado de Portafolio n8n</td>
                                    <td className="p-3">S&P 500 ETF (VOO)</td>
                                    <td className="p-3 text-right text-green-600 font-bold">+€4,500.00</td>
                                  </tr>
                                  <tr>
                                    <td className="p-3 font-mono">08-Jul-2026</td>
                                    <td className="p-3 font-bold text-gray-900">Aporte de Tesorería Recurrente</td>
                                    <td className="p-3">Fondo Monetario Liquidez</td>
                                    <td className="p-3 text-right text-green-600 font-bold">+€1,200.00</td>
                                  </tr>
                                  <tr>
                                    <td className="p-3 font-mono">02-Jul-2026</td>
                                    <td className="p-3 font-bold text-gray-900">Reversión de Dividendo Dividendos Reinv.</td>
                                    <td className="p-3">Treasury Bond Fund</td>
                                    <td className="p-3 text-right text-green-600 font-bold">+€850.00</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'projections' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-gray-900">Simulador de Interés Compuesto</h2>
                            <p className="text-xs text-gray-500">Ajusta las variables de ahorro e inversión corporativa para calcular el crecimiento compuesto.</p>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Sliders Control Panel */}
                            <div className="lg:col-span-6 bg-white border border-gray-200 p-6 rounded-xl space-y-5">
                              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest pb-2 border-b border-gray-100">Configurar Capitales</h3>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                  <span>Inversión Inicial</span>
                                  <span className="text-[var(--color-primary)]">€{financeInput.initial.toLocaleString()}</span>
                                </div>
                                <input
                                  type="range" min="1000" max="150000" step="1000"
                                  value={financeInput.initial}
                                  onChange={(e) => setFinanceInput({ ...financeInput, initial: Number(e.target.value) })}
                                  className="w-full accent-[var(--color-primary)] h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                  <span>Aporte Mensual</span>
                                  <span className="text-[var(--color-primary)]">€{financeInput.monthly.toLocaleString()}</span>
                                </div>
                                <input
                                  type="range" min="50" max="3000" step="50"
                                  value={financeInput.monthly}
                                  onChange={(e) => setFinanceInput({ ...financeInput, monthly: Number(e.target.value) })}
                                  className="w-full accent-[var(--color-primary)] h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                  <span>Interés Anual Compuesto</span>
                                  <span className="text-[var(--color-primary)]">{financeInput.rate}%</span>
                                </div>
                                <input
                                  type="range" min="2" max="15" step="0.5"
                                  value={financeInput.rate}
                                  onChange={(e) => setFinanceInput({ ...financeInput, rate: Number(e.target.value) })}
                                  className="w-full accent-[var(--color-primary)] h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                  <span>Plazo del Plan</span>
                                  <span className="text-[var(--color-primary)]">{financeInput.years} Años</span>
                                </div>
                                <input
                                  type="range" min="3" max="30" step="1"
                                  value={financeInput.years}
                                  onChange={(e) => setFinanceInput({ ...financeInput, years: Number(e.target.value) })}
                                  className="w-full accent-[var(--color-primary)] h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                                />
                              </div>

                              <button
                                onClick={handleSaveSim}
                                className="w-full py-2.5 bg-[var(--color-secondary)] hover:bg-[var(--color-text)] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Guardar esta Simulación</span>
                              </button>
                            </div>

                            {/* Outcome Panel */}
                            <div className="lg:col-span-6 space-y-4">
                              <div className="p-6 bg-gradient-to-tr from-[var(--color-secondary)] to-[var(--color-text)] text-white rounded-xl flex flex-col justify-between">
                                <div>
                                  <span className="text-[9px] bg-[var(--color-primary)] text-white font-bold px-2 py-0.5 rounded uppercase">PROYECCIÓN ALCANZADA</span>
                                  <h4 className="text-4xl font-black font-mono text-[var(--color-primary)] mt-3">€{finalResult.balance.toLocaleString()}</h4>
                                  <p className="text-xs text-gray-300 mt-1">Este capital final se estima al cabo de {financeInput.years} años de aportaciones.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-700 text-xs text-gray-300">
                                  <div>
                                    <span className="block text-[10px] text-gray-400">Total Intereses</span>
                                    <span className="text-base font-bold text-green-400">€{finalResult.interest.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[10px] text-gray-400">Tus Depósitos</span>
                                    <span className="text-base font-bold text-white">
                                      €{Math.round(financeInput.initial + financeInput.monthly * 12 * financeInput.years).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Saved simulations list */}
                              <div className="bg-white border border-gray-200 p-5 rounded-xl space-y-3">
                                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Planes Guardados</h4>
                                <div className="space-y-2">
                                  {savedSims.map((sim) => (
                                    <div key={sim.id} className="flex justify-between items-center p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                                      <div>
                                        <span className="font-bold text-gray-900 block">{sim.label}</span>
                                        <span className="text-[10px] text-gray-400">{sim.years} Años · €{sim.monthly}/mes</span>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <span className="font-mono font-bold text-gray-800">€{sim.balance.toLocaleString()}</span>
                                        <button
                                          onClick={() => setSavedSims(savedSims.filter((s) => s.id !== sim.id))}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'allocation' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Distribución Patrimonial Inteligente</h2>
                            <p className="text-xs text-gray-500">Asignación estratégica de activos recomendada por algoritmos de bajo riesgo corporativo.</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Allocations circles */}
                            <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-4">
                              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Clases de Activos Autorizadas</h4>
                              <div className="space-y-3">
                                {[
                                  { label: 'Acciones Renta Variable Global', percent: 60, val: '€2,088,150', color: 'bg-[var(--color-primary)]' },
                                  { label: 'Bonos Gubernamentales de Alta Calidad', percent: 20, val: '€696,050', color: 'bg-[var(--color-secondary)]' },
                                  { label: 'Bienes Raíces Corporativos (SOCIMIs)', percent: 15, val: '€522,037', color: 'bg-indigo-600' },
                                  { label: 'Metales Nobles & Liquidez Directa', percent: 5, val: '€174,013', color: 'bg-amber-400' },
                                ].map((ast, idx) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="font-bold text-gray-700">{ast.label}</span>
                                      <span className="font-mono font-bold text-gray-900">{ast.percent}% ({ast.val})</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                      <div className={`h-full ${ast.color}`} style={{ width: `${ast.percent}%` }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Holdings Table */}
                            <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-4">
                              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Ficha de Inversión (Holdings)</h4>
                              <div className="space-y-2">
                                {[
                                  { name: 'Vanguard Total Stock Market (VTI)', cat: 'Acciones', wt: '45%' },
                                  { name: 'iShares Core MSCI World (URTH)', cat: 'Acciones', wt: '15%' },
                                  { name: 'Vanguard Total Bond Market (BND)', cat: 'Bonos', wt: '20%' },
                                  { name: 'Vanguard Real Estate ETF (VNQ)', cat: 'Socimi', wt: '15%' },
                                  { name: 'Fondo de Liquidez Euro (EUR)', cat: 'Liquidez', wt: '5%' },
                                ].map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-xs">
                                    <div>
                                      <span className="font-bold text-gray-800 block">{item.name}</span>
                                      <span className="text-[10px] text-gray-400">{item.cat}</span>
                                    </div>
                                    <span className="font-mono font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded">
                                      {item.wt}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'settings' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Configuración Financiera Avanzada</h2>
                            <p className="text-xs text-gray-500">Ajusta variables operativas del motor de cálculo de Des-Tec Oracle Finance.</p>
                          </div>

                          <div className="bg-white border border-gray-200 p-6 rounded-xl space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                              <div>
                                <span className="text-xs font-bold text-gray-800 block">Moneda de Cálculo Principal</span>
                                <span className="text-[11px] text-gray-500">Selecciona la moneda para la simulación de capitales.</span>
                              </div>
                              <select className="bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs font-bold focus:outline-none">
                                <option>Euro (€) - EUR</option>
                                <option>Dólar Americano ($) - USD</option>
                                <option>Libra Esterlina (£) - GBP</option>
                              </select>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                              <div>
                                <span className="text-xs font-bold text-gray-800 block">Ajustar por Inflación Anual</span>
                                <span className="text-[11px] text-gray-500">Resta automáticamente un 2.5% anual del resultado final.</span>
                              </div>
                              <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-primary)]" />
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-xs font-bold text-gray-800 block">Integración API Token</span>
                                <span className="text-[11px] text-gray-500">Utilizado por los webhooks n8n para consultar proyecciones remotas.</span>
                              </div>
                              <code className="text-[10px] bg-gray-100 text-[var(--color-primary)] px-2 py-1 rounded font-mono font-bold">
                                ORCL_TOK_98218_A5
                              </code>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* ========================================================== */}
                  {/* PROJECT INTERFACE 2: CARGOFLOW LOGISTICS */}
                  {/* ========================================================== */}
                  {project.liveAppType === 'cargoflow' && (
                    <>
                      {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                            <div>
                              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Seguimiento de Tránsito de Contenedores</h2>
                              <p className="text-xs text-gray-500">Monitoreo satelital activo de fletes internacionales y control de pasos aduaneros.</p>
                            </div>
                            <button
                              onClick={startCargoSimulation}
                              disabled={isTransitActive}
                              className="px-4 py-2 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-text)] hover:opacity-90 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>{isTransitActive ? 'Simulando...' : 'Iniciar Simulación de Tránsito'}</span>
                            </button>
                          </div>

                          {/* Map container representing real-time tracker */}
                          <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-4">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-gray-800">RUTA SELECCIONADA: {selectedRoute.label}</span>
                              <span className="font-mono text-gray-400">Arribo estimado: {selectedRoute.days} días</span>
                            </div>

                            {/* Pure CSS Track Line bar with moving ship */}
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 relative overflow-hidden">
                              <div className="h-2 w-full bg-gray-200 rounded-full relative">
                                <div
                                  className="absolute top-0 left-0 h-full bg-[var(--color-primary)] rounded-full transition-all duration-150"
                                  style={{ width: `${transitProgress}%` }}
                                />
                                <div
                                  className="absolute -top-3 p-1 bg-[var(--color-surface)] border-2 border-[var(--color-primary)] rounded-full transition-all duration-150 shadow-md"
                                  style={{ left: `${transitProgress}%`, transform: 'translateX(-50%)' }}
                                >
                                  <Ship className="w-4 h-4 text-[var(--color-primary)] animate-pulse" />
                                </div>
                              </div>

                              <div className="grid grid-cols-4 gap-2 text-center text-[10px] mt-6 font-bold font-sans">
                                <div className={transitStep >= 1 ? 'text-[var(--color-primary)]' : 'text-gray-400'}>
                                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] mx-auto mb-1" />
                                  <span>1. Puerto Origen</span>
                                </div>
                                <div className={transitStep >= 2 ? 'text-[var(--color-primary)]' : 'text-gray-400'}>
                                  <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1 ${transitStep >= 2 ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`} />
                                  <span>2. Despacho Aduanas</span>
                                </div>
                                <div className={transitStep >= 3 ? 'text-[var(--color-primary)]' : 'text-gray-400'}>
                                  <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1 ${transitStep >= 3 ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`} />
                                  <span>3. Navegación</span>
                                </div>
                                <div className={transitStep >= 4 ? 'text-green-600' : 'text-gray-400'}>
                                  <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1 ${transitStep >= 4 ? 'bg-green-600' : 'bg-gray-200'}`} />
                                  <span>4. Entregado Destino</span>
                                </div>
                              </div>
                            </div>

                            {/* Simulation alert text box */}
                            {isTransitActive ? (
                              <div className="p-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold rounded-lg flex items-center space-x-2">
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Contenedor marítimo en navegación de alta mar... Progreso: {transitProgress}%</span>
                              </div>
                            ) : transitStep === 4 ? (
                              <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-lg flex items-center space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span>¡Buque arribado con éxito! Manifiesto firmado y Webhook n8n disparado en ERP.</span>
                              </div>
                            ) : (
                              <p className="text-[11px] text-gray-500 italic text-center">Presiona "Iniciar Simulación" para ver la simulación física de movimiento.</p>
                            )}
                          </div>
                        </div>
                      )}

                      {activeTab === 'quote' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Cotizador de Fletes Marítimos (CBM)</h2>
                            <p className="text-xs text-gray-500">Calcula al instante tarifas y seguros portuarios en base a cubicaje y ruta seleccionada.</p>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Sliders and Selectors Column */}
                            <div className="lg:col-span-6 bg-white border border-gray-200 p-6 rounded-xl space-y-5">
                              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest pb-1 border-b border-gray-100">Configuración</h3>
                              
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 block">1. Tipo de Contenedor</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.keys(containerRates).map((type) => {
                                    const rate = containerRates[type as keyof typeof containerRates];
                                    const isSel = cargoInput.containerType === type;
                                    return (
                                      <button
                                        key={type}
                                        onClick={() => setCargoInput({ ...cargoInput, containerType: type as any })}
                                        className={`p-2 rounded-lg border text-left transition-all ${
                                          isSel
                                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-bold'
                                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                      >
                                        <div className="text-[11px]">{rate.label}</div>
                                        <div className="text-[9px] text-gray-400 mt-0.5">Volumen: {rate.volume} m³</div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 block">2. Puerto de Origen / Destino</label>
                                <select
                                  value={cargoInput.originDest}
                                  onChange={(e) => setCargoInput({ ...cargoInput, originDest: e.target.value as any })}
                                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--color-primary)]"
                                >
                                  {Object.keys(routes).map((key) => (
                                    <option key={key} value={key}>
                                      {routes[key as keyof typeof routes].label} ({routes[key as keyof typeof routes].days} días)
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                  <span>3. Carga en Toneladas</span>
                                  <span className="text-[var(--color-primary)]">{cargoInput.weight} Tons</span>
                                </div>
                                <input
                                  type="range" min="1" max={selectedRate.maxWeight} step="1"
                                  value={cargoInput.weight}
                                  onChange={(e) => setCargoInput({ ...cargoInput, weight: Number(e.target.value) })}
                                  className="w-full accent-[var(--color-primary)] h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                                />
                                <p className="text-[9px] text-gray-400">Lmite máximo permitido: {selectedRate.maxWeight} Tons</p>
                              </div>

                              <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <div>
                                  <span className="text-xs font-bold text-gray-800 block">Contratar Seguro Adicional</span>
                                  <span className="text-[9px] text-gray-400">Cobertura total de mercancía</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setCargoInput({ ...cargoInput, insurance: !cargoInput.insurance })}
                                  className={`px-3 py-1 text-[10px] font-bold rounded ${
                                    cargoInput.insurance ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                                  }`}
                                >
                                  {cargoInput.insurance ? 'SÍ (250€)' : 'NO'}
                                </button>
                              </div>
                            </div>

                            {/* Quotation invoice display */}
                            <div className="lg:col-span-6 bg-gradient-to-tr from-[var(--color-secondary)] to-[var(--color-text)] text-white p-6 rounded-xl flex flex-col justify-between shadow-lg">
                              <div>
                                <span className="text-[9px] bg-[var(--color-primary)] text-white font-bold px-2 py-0.5 rounded uppercase">FACTURA CORPORATIVA ESTIMADA</span>
                                <h4 className="text-4xl font-black font-mono text-[var(--color-primary)] mt-4">€{totalFlete.toLocaleString()}</h4>
                                <p className="text-xs text-gray-300 mt-2">Arancel final calculado de forma automatizada por algoritmos de cubicaje.</p>
                              </div>

                              <div className="mt-8 pt-4 border-t border-gray-700 text-xs text-gray-300 space-y-2">
                                <div className="flex justify-between">
                                  <span>Flete Base Contenedor:</span>
                                  <span className="font-mono text-white">€{selectedRate.base}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Peso Surcharge (Tons x 60€):</span>
                                  <span className="font-mono text-white">€{cargoInput.weight * 60}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Seguro de Siniestros:</span>
                                  <span className="font-mono text-white">€{cargoInput.insurance ? 250 : 0}</span>
                                </div>
                                <div className="flex justify-between text-white font-bold border-t border-gray-700 pt-2 text-sm">
                                  <span>Total Multiplicador Ruta (x{selectedRoute.mult}):</span>
                                  <span className="font-mono text-[var(--color-primary)]">€{totalFlete.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'fleet' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Métricas de Optimización de CBM</h2>
                            <p className="text-xs text-gray-500">Eficiencia mensual de cubicaje y ahorro de CO₂ de la flota internacional.</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">VOLUMEN TOTAL EMBARCADO</span>
                              <div className="text-2xl font-black font-mono text-gray-900 mt-1">16,480 m³</div>
                              <span className="text-[10px] text-gray-500 font-semibold block mt-1">Suma acumulada de TEUs</span>
                            </div>
                            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">AHORRO EN ARANCELES</span>
                              <div className="text-2xl font-black font-mono text-green-600 mt-1">14.8% Promedio</div>
                              <span className="text-[10px] text-green-600 font-bold block mt-1">Gracias a algoritmos CBM</span>
                            </div>
                            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">HUELLA DE CO₂ COMPENSADA</span>
                              <div className="text-2xl font-black font-mono text-[var(--color-primary)] mt-1">45.2 Toneladas</div>
                              <span className="text-[10px] text-[var(--color-primary)] font-bold block mt-1">Por agrupaciones inteligentes</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'declarations' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Manifiestos y Trámites Aduaneros</h2>
                            <p className="text-xs text-gray-500">Documentación oficial de despacho de aduanas autorizada mediante webhooks n8n.</p>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                            <table className="w-full text-left text-xs font-sans">
                              <thead className="bg-gray-50 font-bold text-gray-400 uppercase text-[10px] border-b border-gray-100">
                                <tr>
                                  <th className="p-3">Manifiesto ID</th>
                                  <th className="p-3">Puerto Inspección</th>
                                  <th className="p-3">Estatus Jurídico</th>
                                  <th className="p-3 text-right">Firma Digital n8n</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-gray-700">
                                <tr>
                                  <td className="p-3 font-mono font-bold">MNF-RTM-2928</td>
                                  <td className="p-3">Rotterdam (NL)</td>
                                  <td className="p-3"><span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded font-bold text-[9px]">COMPLETO / EXENTO</span></td>
                                  <td className="p-3 text-right"><span className="text-gray-400 italic">Validada (Auto)</span></td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-mono font-bold">MNF-BCN-8472</td>
                                  <td className="p-3">Barcelona (ES)</td>
                                  <td className="p-3"><span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded font-bold text-[9px]">EN INSPECCIÓN</span></td>
                                  <td className="p-3 text-right">
                                    <button
                                      onClick={() => showToast('Firma digital enviada vía webhook de n8n con éxito.', 'success')}
                                      className="px-2 py-1 bg-[var(--color-primary)] text-white font-bold text-[10px] rounded"
                                    >
                                      Firmar Webhook
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* ========================================================== */}
                  {/* PROJECT INTERFACE 3: REMODELACIONESYA */}
                  {/* ========================================================== */}
                  {project.liveAppType === 'remodelacionesya' && (
                    <>
                      {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Planificador de Reformas Inteligentes</h2>
                            <p className="text-xs text-gray-500">Calcula el presupuesto llave en mano ajustando la superficie, acabados y tipo de espacio.</p>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Planner Form */}
                            <div className="lg:col-span-6 bg-white border border-gray-200 p-6 rounded-xl space-y-5">
                              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest pb-1 border-b border-gray-100">Configuración de Espacio</h3>

                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 block">1. Selecciona la Habitación</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.keys(roomPricing).map((type) => {
                                    const rp = roomPricing[type as keyof typeof roomPricing];
                                    const isSel = remodInput.roomType === type;
                                    return (
                                      <button
                                        key={type}
                                        onClick={() => setRemodInput({ ...remodInput, roomType: type as any })}
                                        className={`p-2.5 rounded-lg border text-left transition-all ${
                                          isSel
                                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-bold'
                                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                      >
                                        <div className="text-[11px]">{rp.label}</div>
                                        <div className="text-[9px] text-gray-400 mt-0.5">Fijo Diseño: €{rp.designCost}</div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 block">2. Nivel de Calidad de Acabados</label>
                                <div className="space-y-1.5">
                                  {Object.keys(qualityMultipliers).map((qual) => {
                                    const qm = qualityMultipliers[qual as keyof typeof qualityMultipliers];
                                    const isSel = remodInput.quality === qual;
                                    return (
                                      <div
                                        key={qual}
                                        onClick={() => setRemodInput({ ...remodInput, quality: qual as any })}
                                        className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                          isSel ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]' : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                      >
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                          <span>{qm.label}</span>
                                          <span>Mult. x{qm.mult}</span>
                                        </div>
                                        <p className="text-[9px] text-gray-400 leading-none mt-0.5">{qm.details}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                  <span>3. Superficie Habitable</span>
                                  <span className="text-[var(--color-primary)]">{remodInput.areaSize} m²</span>
                                </div>
                                <input
                                  type="range" min="10" max="150" step="5"
                                  value={remodInput.areaSize}
                                  onChange={(e) => setRemodInput({ ...remodInput, areaSize: Number(e.target.value) })}
                                  className="w-full accent-[var(--color-primary)] h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Live Budget display */}
                            <div className="lg:col-span-6 bg-[var(--color-secondary)] text-white p-6 rounded-xl flex flex-col justify-between shadow-lg">
                              <div>
                                <span className="text-[9px] bg-[var(--color-primary)] text-white font-bold px-2 py-0.5 rounded uppercase">PRESUPUESTO LLAVE EN MANO</span>
                                <h4 className="text-4xl font-black font-mono text-[var(--color-primary)] mt-3">€{estimatedCost.toLocaleString()}</h4>
                                <p className="text-xs text-gray-300 mt-2">Costo estimado con IVA incluido, listo para ejecución por arquitectos colegiados.</p>
                              </div>

                              <div className="mt-8 pt-4 border-t border-gray-700 text-xs text-gray-300 space-y-2.5">
                                <div className="flex justify-between">
                                  <span>Materiales Premium (45%):</span>
                                  <span className="font-mono text-white">€{breakdown.materiales.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Mano de Obra Especializada (35%):</span>
                                  <span className="font-mono text-white">€{breakdown.manoObra.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Permisos y Licencias de Obras (10%):</span>
                                  <span className="font-mono text-white">€{breakdown.permisos.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-white font-bold border-t border-gray-700 pt-2 text-sm">
                                  <span>Honorarios de Arquitectura y Planos (10%):</span>
                                  <span className="font-mono text-[var(--color-primary)]">€{breakdown.arquitectura.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'moodboard' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Comparativa "Antes y Después"</h2>
                            <p className="text-xs text-gray-500">Mueve el control deslizante horizontal para revelar los acabados lujosos terminados.</p>
                          </div>

                          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
                            <div className="relative w-full h-56 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                              {/* Before Back layer */}
                              <div className="absolute inset-0 bg-slate-900 flex flex-col justify-center items-center text-center p-6 text-gray-400 font-sans">
                                <span className="text-3xl font-black opacity-10 font-serif">ESTADO ANTERIOR</span>
                                <p className="text-xs max-w-xs mt-2 opacity-50">Cocina antigua con azulejos picados, grifería vieja y mala distribución de luz.</p>
                              </div>

                              {/* After Mask layer */}
                              <div
                                className="absolute inset-0 bg-gradient-to-tr from-[var(--color-secondary)] to-[var(--color-primary)]/20 flex flex-col justify-center items-center text-center p-6 text-white border-l-2 border-[var(--color-primary)]"
                                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                              >
                                <span className="text-3xl font-black text-[var(--color-primary)] tracking-widest">OBRA REFORMADA</span>
                                <p className="text-xs max-w-xs mt-2 font-semibold text-gray-200">Luminarias empotradas, encimeras pulidas, grifos de diseño y mobiliario de nogal.</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-bold text-gray-400 uppercase">Antes</span>
                              <input
                                type="range" min="0" max="100" value={sliderPosition}
                                onChange={(e) => setSliderPosition(Number(e.target.value))}
                                className="flex-1 accent-[var(--color-primary)] h-1.5 bg-gray-100 rounded-lg cursor-ew-resize"
                              />
                              <span className="text-xs font-bold text-[var(--color-primary)] uppercase">Después</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'budget' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Presupuesto Formal Descargable</h2>
                            <p className="text-xs text-gray-500">Documento formal de cotización desglosado por partidas técnicas.</p>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                              <div>
                                <h4 className="text-sm font-bold text-gray-900">PRESUPUESTO COLEGIO DE ARQUITECTOS</h4>
                                <span className="text-[10px] text-gray-400 font-mono">Ficha Técnica: RY-REFORMA-{remodInput.roomType.toUpperCase()}</span>
                              </div>
                              <span className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold px-2.5 py-1 rounded">
                                Total: €{estimatedCost.toLocaleString()}
                              </span>
                            </div>

                            <div className="space-y-2 text-xs text-gray-600">
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span>Partida 1: Demoliciones, desescombro y retirada a vertedero oficial</span>
                                <span className="font-bold">€{Math.round(estimatedCost * 0.15).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span>Partida 2: Albañilería, tabiquería y aislamiento termo-acústico</span>
                                <span className="font-bold">€{Math.round(estimatedCost * 0.25).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span>Partida 3: Fontanería, electricidad y climatización oculta</span>
                                <span className="font-bold">€{Math.round(estimatedCost * 0.20).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-gray-50 rounded">
                                <span>Partida 4: Carpintería interior, solados gres porcelánico y pintura</span>
                                <span className="font-bold">€{Math.round(estimatedCost * 0.30).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'gantt' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Cronograma Físico de Obra</h2>
                            <p className="text-xs text-gray-500">Fases consecutivas de ejecución estimadas para tu reforma.</p>
                          </div>

                          <div className="bg-white border border-gray-200 p-5 rounded-xl space-y-4">
                            {[
                              { phase: 'Semana 1-2: Demolición y Limpieza', pct: 100, color: 'bg-green-600', status: 'Completo' },
                              { phase: 'Semana 3-4: Instalaciones Fontanería & Electricidad', pct: 80, color: 'bg-[var(--color-primary)]', status: 'En Curso' },
                              { phase: 'Semana 5-6: Solados y Alicatados de Muros', pct: 20, color: 'bg-indigo-600', status: 'Iniciado' },
                              { phase: 'Semana 7: Colocación de Iluminación y Sanitarios', pct: 0, color: 'bg-gray-200', status: 'Pendiente' },
                            ].map((ph, idx) => (
                              <div key={idx} className="space-y-1.5 text-xs">
                                <div className="flex justify-between font-bold text-gray-700">
                                  <span>{ph.phase}</span>
                                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">{ph.status}</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                  <div className={`h-full ${ph.color}`} style={{ width: `${ph.pct}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* ========================================================== */}
                  {/* PROJECT INTERFACE 4: CRM & WHATSAPP AUTOMATION */}
                  {/* ========================================================== */}
                  {project.liveAppType === 'crm-whatsapp' && (
                    <>
                      {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Conversación de WhatsApp & Bot IA</h2>
                            <p className="text-xs text-gray-500">Envía respuestas simuladas o escribe al Bot de Des-Tec para ver cómo n8n procesa la información.</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Smartphone Chat Simulator */}
                            <div className="md:col-span-6 flex justify-center">
                              <div className="w-full max-w-xs bg-slate-900 border-4 border-slate-700 rounded-[32px] p-2 flex flex-col h-[420px] shadow-xl relative overflow-hidden">
                                {/* Header top notch */}
                                <div className="w-20 h-4 bg-slate-700 rounded-b-lg absolute top-0 left-1/2 -translate-x-1/2 z-20" />
                                
                                {/* WhatsApp header banner */}
                                <div className="bg-[#075e54] text-white pt-4 pb-2 px-3 flex items-center space-x-2 shrink-0 select-none text-left mt-1 rounded-t-2xl">
                                  <div className="w-7 h-7 bg-emerald-800 rounded-full flex items-center justify-center font-bold text-xs">DT</div>
                                  <div>
                                    <div className="text-[11px] font-bold">Asistente Des-Tec IA</div>
                                    <span className="text-[8px] text-gray-200 flex items-center space-x-1">
                                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                                      <span>En línea</span>
                                    </span>
                                  </div>
                                </div>

                                {/* Chat messages bubble thread */}
                                <div className="flex-1 bg-[#efeae2] p-3 overflow-y-auto space-y-2 text-xs flex flex-col">
                                  {chatMessages.map((msg) => {
                                    const isBot = msg.sender === 'bot';
                                    return (
                                      <div
                                        key={msg.id}
                                        className={`max-w-[80%] rounded-lg px-2.5 py-1.5 shadow-xs ${
                                          isBot ? 'bg-white text-gray-800 self-start' : 'bg-[#dcf8c6] text-gray-900 self-end'
                                        }`}
                                      >
                                        <p className="font-sans leading-snug">{msg.text}</p>
                                        <span className="block text-[8px] text-gray-400 text-right mt-0.5">{msg.time}</span>
                                      </div>
                                    );
                                  })}

                                  {isBotTyping && (
                                    <div className="bg-white text-gray-400 self-start rounded-lg px-2.5 py-1 text-[10px] animate-pulse">
                                      Escribiendo...
                                    </div>
                                  )}
                                </div>

                                {/* Interactive Quick Buttons footer */}
                                <div className="p-2 bg-white border-t border-gray-100 shrink-0 text-left rounded-b-2xl">
                                  <span className="text-[8px] text-gray-400 font-bold block mb-1">ACCIONES CON EL BOT:</span>
                                  <div className="space-y-1">
                                    <button
                                      onClick={() => handleSendWA('Me interesa cotizar remodelación')}
                                      disabled={isBotTyping}
                                      className="w-full text-left bg-gray-50 hover:bg-gray-100 text-gray-700 text-[10px] p-1.5 rounded border border-gray-200 transition-all font-bold line-clamp-1"
                                    >
                                      🏠 Cotizar RemodelacionesYa
                                    </button>
                                    <button
                                      onClick={() => handleSendWA('Quiero simular el flete cargoflow')}
                                      disabled={isBotTyping}
                                      className="w-full text-left bg-gray-50 hover:bg-gray-100 text-gray-700 text-[10px] p-1.5 rounded border border-gray-200 transition-all font-bold line-clamp-1"
                                    >
                                      📦 Consultar Flete en CargoFlow
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Live Sync Console Logger */}
                            <div className="md:col-span-6 space-y-4">
                              <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-3">
                                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Webhooks de Entrada Recibidos</h4>
                                <div className="space-y-1.5">
                                  {crmLeads.slice(0, 3).map((lead) => (
                                    <div key={lead.id} className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                                      <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">{lead.name}</span>
                                        <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 px-1.5 rounded font-bold uppercase">
                                          Sincronizado
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-gray-500 mt-1">Interés: <span className="text-[var(--color-primary)] font-bold">{lead.interest}</span> | Tel: {lead.phone}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'pipeline' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Embudo de Ventas Kanban CRM</h2>
                            <p className="text-xs text-gray-500">Mueve leads calificados automáticamente por la integración n8n del bot.</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Contactados Column */}
                            <div className="bg-gray-100/60 border border-gray-200 p-3 rounded-xl min-h-[250px] space-y-3">
                              <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Contactados WhatsApp</span>
                              {crmLeads
                                .filter((l) => l.status === 'contactado')
                                .map((lead) => (
                                  <div key={lead.id} className="bg-white border border-gray-200 p-3 rounded-lg text-xs space-y-1 shadow-2xs">
                                    <div className="font-bold text-gray-900">{lead.name}</div>
                                    <div className="text-[10px] text-[var(--color-primary)] font-bold">Interés: {lead.interest}</div>
                                    <div className="text-[9px] text-gray-400 font-mono">{lead.email}</div>
                                  </div>
                                ))}
                            </div>

                            {/* Calificados Column */}
                            <div className="bg-green-50/20 border border-green-100 p-3 rounded-xl min-h-[250px] space-y-3">
                              <span className="text-[10px] font-bold text-green-700 uppercase block tracking-wider">Calificados (n8n Bot)</span>
                              {crmLeads
                                .filter((l) => l.status === 'calificado' || l.status === 'negociacion')
                                .map((lead) => (
                                  <div key={lead.id} className="bg-white border border-green-200 p-3 rounded-lg text-xs space-y-1 shadow-2xs relative overflow-hidden">
                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <div className="font-bold text-gray-900">{lead.name}</div>
                                    <div className="text-[10px] text-green-600 font-bold">Interés: {lead.interest}</div>
                                    <div className="text-[9px] text-gray-400 font-mono">{lead.email}</div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'n8n' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Consola de Webhooks n8n</h2>
                            <p className="text-xs text-gray-500">Logger de payloads JSON en tiempo real transmitidos por el chatbot.</p>
                          </div>

                          <div className="bg-[var(--color-secondary)] rounded-xl p-5 border border-gray-800 space-y-4">
                            <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                              <span>Logs de depuración del bot</span>
                              <span className="text-green-400 font-bold">Live</span>
                            </div>
                            <div className="bg-black/80 rounded-lg p-4 font-mono text-[11px] text-cyan-300 space-y-2 h-44 overflow-y-auto">
                              {crmLogs.map((log, idx) => (
                                <div key={idx} className="leading-relaxed">{log}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'analytics' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Estadísticas de Automatización</h2>
                            <p className="text-xs text-gray-500">Rendimiento e impacto de horas de trabajo ahorradas.</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-white border border-gray-200 rounded-xl">
                              <span className="text-xs font-bold text-gray-400 uppercase">Mensajes Automatizados</span>
                              <div className="text-3xl font-black font-mono text-[var(--color-primary)] mt-2">14,250</div>
                            </div>
                            <div className="p-4 bg-white border border-gray-200 rounded-xl">
                              <span className="text-xs font-bold text-gray-400 uppercase">Horas Manuales Ahorradas</span>
                              <div className="text-3xl font-black font-mono text-green-600 mt-2">124 hrs</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* BROWSER FOOTER LOGO */}
              <footer className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-bold select-none shrink-0 font-sans">
                <span>© {new Date().getFullYear()} Des-Tec Studio Enterprise Lab</span>
                <span className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>SaaS Entorno Conectado</span>
                </span>
              </footer>

            </main>

          </div>

        </div>

      </motion.div>

      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2.5 bg-[var(--color-secondary)] border border-[var(--color-text)]/15 text-white px-5 py-3 rounded-xl shadow-2xl font-sans text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
