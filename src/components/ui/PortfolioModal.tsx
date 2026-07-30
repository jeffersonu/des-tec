import React, { useState, useEffect, useRef } from 'react';
import {
  X, Play, RefreshCw, Send, CheckCircle2, Plus, ArrowRight, Settings, Trash2, Shield, Flame, Activity,
  Ship, Anchor, MapPin, Sliders, Calendar, DollarSign, Smartphone, MessageSquare, Check, User, Bot, Wifi, HelpCircle,
  Lock, Globe, ArrowLeft, RotateCw, LayoutDashboard, FileText, BarChart3, ListChecks, History, Database, Network, TrendingUp, Info, ChevronRight, Eye,
  FolderGit2, Download, Zap, Sparkles, Cpu, Layers, Table, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioProject } from '../../types';
import PendingIntegrationView from '../../demos/PendingIntegrationView';

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
  // 4. STATE FOR CRM & WHATSAPP AUTOMATION / N8N
  // ==========================================
  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: '1', sender: 'bot', text: '¡Hola! Bienvenido a Des-Tec Automations. 🤖 Soy el asistente virtual integrado con n8n y WhatsApp. ¿Qué proceso te gustaría automatizar hoy?', time: '10:15 AM' }
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [crmLeads, setCrmLeads] = useState<any[]>([
    { id: 'L-101', date: '2026-07-29 10:14', name: 'Carlos Mendoza', email: 'carlos.m@empresa.com', phone: '+34 612 345 678', origin: 'Landing Webhook', score: 96, status: 'calificado', interest: 'Automatización n8n & WhatsApp' },
    { id: 'L-102', date: '2026-07-29 09:45', name: 'Alfonso Torres', email: 'a.torres@corporativo.com', phone: '+34 611 223 344', origin: 'WhatsApp Directo', score: 88, status: 'contactado', interest: 'SmartDoc OCR IA' },
    { id: 'L-103', date: '2026-07-29 08:30', name: 'Sofía Rincón', email: 's.rincon@logistica.com', phone: '+34 688 998 877', origin: 'API Webhook Lead', score: 92, status: 'negociacion', interest: 'CargoFlow SaaS' },
    { id: 'L-104', date: '2026-07-28 17:15', name: 'Elena Gómez', email: 'elena@estudio.io', phone: '+34 655 443 322', origin: 'Formulario Web', score: 79, status: 'contactado', interest: 'RemodelacionesYa' },
    { id: 'L-105', date: '2026-07-28 14:00', name: 'Roberto Valdés', email: 'r.valdes@techcorp.com', phone: '+34 699 887 766', origin: 'WhatsApp Chatbot', score: 94, status: 'calificado', interest: 'Sistema POS Restaurante' }
  ]);
  const [crmLogs, setCrmLogs] = useState<string[]>([
    '⚙️ Webhook n8n activo en /api/v1/webhook/lead-capture',
    '🟢 Conectado con Meta WhatsApp Cloud API (Producción)',
    '📊 Sincronización continua activa con Excel / CRM'
  ]);

  // Automation Engine Specific States
  const [isN8nExecuting, setIsN8nExecuting] = useState(false);
  const [activeN8nNode, setActiveN8nNode] = useState(-1);
  const [leadFormInput, setLeadFormInput] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'n8n & WhatsApp Bot',
    budget: '$1,500 - $3,000 USD'
  });
  const [deletedLeadsCount, setDeletedLeadsCount] = useState(0);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrDocIndex, setOcrDocIndex] = useState(0);

  // ==========================================
  // 5. STATE FOR APEX SALES CRM (KANBAN & LEAD CONVERSION)
  // ==========================================
  const [apexDeals, setApexDeals] = useState<any[]>([
    { id: 'DEAL-101', title: 'Implementación ERP Logística', company: 'Global Transport Inc.', contact: 'Alfonso Torres', email: 'a.torres@corporativo.com', val: 24500, stage: 'entrante', score: 94, owner: 'Carlos M.', probability: 40, createdAt: '2026-07-28' },
    { id: 'DEAL-102', title: 'Licencias CRM Enterprise (50u)', company: 'Grupo Inmobiliario Nexus', contact: 'Sofía Rincón', email: 's.rincon@logistica.com', val: 18200, stage: 'propuesta', score: 98, owner: 'Ana P.', probability: 75, createdAt: '2026-07-25' },
    { id: 'DEAL-103', title: 'Automatización Facturas n8n', company: 'LegalTech Consultores', contact: 'Roberto Valdés', email: 'r.valdes@techcorp.com', val: 9500, stage: 'contactado', score: 86, owner: 'Carlos M.', probability: 55, createdAt: '2026-07-27' },
    { id: 'DEAL-104', title: 'Desarrollo App Móvil PWA', company: 'Estudio Arquitectura & Co.', contact: 'Elena Gómez', email: 'elena@estudio.io', val: 32000, stage: 'negociacion', score: 92, owner: 'Lucía G.', probability: 85, createdAt: '2026-07-20' },
    { id: 'DEAL-105', title: 'Sistema POS (12 Sucursales)', company: 'Gourmet Franchise S.A.', contact: 'Carlos Mendoza', email: 'carlos.m@empresa.com', val: 45000, stage: 'ganado', score: 99, owner: 'Ana P.', probability: 100, createdAt: '2026-07-15' },
    { id: 'DEAL-106', title: 'Integración WhatsApp API + IA', company: 'Servicios Financieros Alfa', contact: 'Diego Morales', email: 'd.morales@alfa.com', val: 12800, stage: 'contactado', score: 82, owner: 'Lucía G.', probability: 50, createdAt: '2026-07-29' },
  ]);

  const [apexFilterOwner, setApexFilterOwner] = useState('all');
  const [apexSearchQuery, setApexSearchQuery] = useState('');
  const [apexSelectedDealForInvoice, setApexSelectedDealForInvoice] = useState<any | null>(null);
  const [apexNewDealModalOpen, setApexNewDealModalOpen] = useState(false);
  const [newDealInput, setNewDealInput] = useState({
    title: '',
    company: '',
    contact: '',
    email: '',
    val: '15000',
    stage: 'entrante',
    owner: 'Carlos M.'
  });

  const handleMoveDealStage = (dealId: string, targetStage: string) => {
    setApexDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const isWon = targetStage === 'ganado';
          const prob = isWon ? 100 : targetStage === 'negociacion' ? 85 : targetStage === 'propuesta' ? 70 : targetStage === 'contactado' ? 50 : 30;
          showToast(
            isWon
              ? `🎉 ¡CONVERSIÓN EXITOSA! Lead "${d.contact}" de "${d.company}" convertido en CLIENTE GANADO ($${d.val.toLocaleString()} USD)`
              : `Oportunidad "${d.title}" movida a etapa "${targetStage.toUpperCase()}"`,
            isWon ? 'success' : 'info'
          );
          addCrmLog(`💼 CRM Conversion: Opportunity '${d.title}' updated stage ➔ [${targetStage.toUpperCase()}] ($${d.val} USD)`);
          return { ...d, stage: targetStage, probability: prob };
        }
        return d;
      })
    );
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealInput.title || !newDealInput.company || !newDealInput.contact) {
      showToast('Por favor completa los campos requeridos del trato.', 'info');
      return;
    }
    const newDeal = {
      id: `DEAL-${Math.floor(100 + Math.random() * 900)}`,
      title: newDealInput.title,
      company: newDealInput.company,
      contact: newDealInput.contact,
      email: newDealInput.email || `${newDealInput.contact.toLowerCase().replace(/\s+/g, '.')}@empresa.com`,
      val: parseFloat(newDealInput.val) || 12000,
      stage: newDealInput.stage,
      score: Math.floor(82 + Math.random() * 18),
      owner: newDealInput.owner,
      probability: 40,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setApexDeals((prev) => [newDeal, ...prev]);
    setApexNewDealModalOpen(false);
    showToast(`Nuevo Trato "${newDeal.title}" registrado en el CRM Pipeline`, 'success');
    addCrmLog(`➕ CRM Pipeline: Nuevo Trato registrado '${newDeal.title}' ($${newDeal.val} USD)`);
    setNewDealInput({ title: '', company: '', contact: '', email: '', val: '15000', stage: 'entrante', owner: 'Carlos M.' });
  };

  const addCrmLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setCrmLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 8)]);
  };

  const runN8nWorkflowSim = () => {
    if (isN8nExecuting) return;
    setIsN8nExecuting(true);
    setActiveN8nNode(0);
    addCrmLog('⚡ n8n Webhook disparado: POST /api/v1/webhook/lead-capture');

    const nodeInterval = setInterval(() => {
      setActiveN8nNode((prev) => {
        if (prev >= 5) {
          clearInterval(nodeInterval);
          setIsN8nExecuting(false);
          addCrmLog('✅ Flow n8n finalizado: Prospecto guardado en Excel & CRM (200 OK - 420ms)');
          showToast('Ejecución n8n exitosa: 6 Nodos procesados en 420ms', 'success');
          return -1;
        }
        const nextNode = prev + 1;
        const nodeNames = [
          'Webhook Trigger',
          'Gemini AI Classifier',
          'WhatsApp Bot API',
          'Excel Sync Engine',
          'Hubspot CRM Stage',
          'Slack Notification'
        ];
        addCrmLog(`▶ Nodo n8n #${nextNode + 1} (${nodeNames[nextNode]}): Ejecutado OK`);
        return nextNode;
      });
    }, 450);
  };

  const handleFormLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadFormInput.name || !leadFormInput.phone) {
      showToast('Por favor completa al menos Nombre y Teléfono WhatsApp.', 'info');
      return;
    }

    const timeStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newLead = {
      id: `L-${Math.floor(100 + Math.random() * 900)}`,
      date: timeStr,
      name: leadFormInput.name,
      email: leadFormInput.email || 'lead.webhook@cliente.com',
      phone: leadFormInput.phone,
      origin: 'Formulario Landing Page',
      score: Math.floor(85 + Math.random() * 15),
      status: 'calificado',
      interest: leadFormInput.service
    };

    setCrmLeads((prev) => [newLead, ...prev]);
    addCrmLog(`🚀 Webhook recibido de Landing Page: Lead "${newLead.name}" capturado (${newLead.phone})`);
    showToast(`¡Lead "${newLead.name}" capturado via Webhook n8n! Registrado en Excel & CRM.`, 'success');

    // Also trigger WhatsApp bot confirmation
    handleSendWA(`Hola, he enviado mi solicitud para ${leadFormInput.service}`);

    // Reset form
    setLeadFormInput({
      name: '',
      email: '',
      phone: '',
      service: 'n8n & WhatsApp Bot',
      budget: '$1,500 - $3,000 USD'
    });
  };

  const handleDeleteLead = (leadId: string, leadName: string) => {
    setCrmLeads((prev) => prev.filter((l) => l.id !== leadId));
    setDeletedLeadsCount((prev) => prev + 1);
    addCrmLog(`🗑️ n8n Event: Prospecto "${leadName}" (ID: ${leadId}) archivado ➔ Registrado en 'Leads_Bajas_Audit.xlsx' & notificado a CRM`);
    showToast(`Lead "${leadName}" eliminado de vista activa ➔ Archivado en Excel & Notificado vía n8n`, 'info');
  };

  const handleExportCSV = () => {
    if (crmLeads.length === 0) {
      showToast('No hay prospectos en la tabla para exportar.', 'info');
      return;
    }
    const headers = 'ID,Fecha,Nombre,Email,Telefono,Origen,Puntaje_IA,Estado_CRM,Interes\n';
    const rows = crmLeads
      .map((l) => `${l.id},"${l.date}","${l.name}","${l.email}","${l.phone}","${l.origin}",${l.score},"${l.status}","${l.interest}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Leads_Sincronizados_n8n_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Descarga iniciada: Leads_Sincronizados_n8n.csv', 'success');
  };

  const runOcrScan = () => {
    if (ocrScanning) return;
    setOcrScanning(true);
    addCrmLog('🔍 Gemini AI Vision: Analizando layout de documento PDF escaneado...');
    setTimeout(() => {
      setOcrScanning(false);
      addCrmLog('✅ SmartDoc OCR: 8 Campos clave extraídos con 99.4% de precisión (Vendor, IVA, Total)');
      showToast('Campos de Factura extraídos con Gemini AI y enviados a Excel/ERP', 'success');
    }, 1500);
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
      let leadName = 'Prospecto WhatsApp';

      if (text.toLowerCase().includes('remodel')) {
        reply = 'Perfecto. He detectado tu interés en RemodelacionesYa. He enviado tu cotización a un asesor técnico para agendar una cita virtual. ¿Tu correo es corporativo?';
        interest = 'RemodelacionesYa';
        leadName = 'Cliente Reformas';
      } else if (text.toLowerCase().includes('cargo')) {
        reply = '¡Entendido! Con CargoFlow automatizamos fletes y CBM al instante. Acabo de crear tu ficha en el CRM y activado la simulación. ¿Qué puertos sueles utilizar?';
        interest = 'CargoFlow SaaS';
        leadName = 'Importaciones S.A.';
      } else {
        reply = '¡Excelente! He procesado tu solicitud con el webhook de n8n. Tus datos ya están calificados e insertados en la Hoja de Excel corporativa y en el CRM de ventas.';
        interest = 'Integración n8n & WhatsApp';
        leadName = 'Lead Expreso';
      }

      setChatMessages((prev) => [...prev, { id: `b-${Date.now()}`, sender: 'bot', text: reply, time }]);
      addCrmLog(`⚡ n8n workflow completado: Respuesta de WhatsApp enviada y lead insertado en CRM/Excel.`);
    }, 1100);
  };

  return (
    <div
      id="portfolio-modal-overlay"
      className="fixed inset-0 w-full h-full bg-slate-950/85 backdrop-blur-lg z-[10000] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        id="portfolio-modal-container"
        className="relative bg-[var(--color-surface)] rounded-2xl w-full max-w-6xl h-[90vh] max-h-[880px] my-auto flex flex-col overflow-hidden shadow-2xl shadow-black/60 border border-white/20"
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

            {/* Local Source / Repository address bar */}
            <div className="flex-1 bg-white border border-[#D1D1D6] rounded px-3 py-1 flex items-center space-x-2 text-gray-600 text-[11px] overflow-hidden">
              <div className="flex items-center space-x-1 shrink-0">
                <FolderGit2 className="w-3.5 h-3.5 text-violet-600" />
                <span className="text-violet-700 font-bold font-mono">Local Workspace</span>
                <span className="text-gray-300">|</span>
              </div>
              
              <span className="text-gray-800 font-mono truncate">
                {project.isIntegrated !== false
                  ? `local://${project.sourcePath || `src/demos/${project.id}`}/${activeTab}`
                  : `github.com/des-tec/${project.id}.git`}
              </span>

              {project.isIntegrated !== false ? (
                <span className="ml-auto shrink-0 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                  Código Fuente Integrado
                </span>
              ) : (
                <span className="ml-auto shrink-0 bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                  Pendiente de Código
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-gray-500 shrink-0">
              <Settings className="w-3.5 h-3.5 cursor-pointer hover:text-gray-800" />
              <div className="w-5 h-5 rounded-full bg-[#E5E5EA] border border-gray-300 text-gray-700 text-[9px] font-bold flex items-center justify-center">
                DEV
              </div>
            </div>
          </div>
        </div>

        {/* BROWSER VIEWPORT CONTAINER */}
        <div id="browser-viewport" className="flex-1 flex overflow-hidden bg-[#FAFAFC] text-[var(--color-text)]">
          {project.isIntegrated === false || project.liveAppType === 'pending' ? (
            <PendingIntegrationView project={project} onClose={onClose} />
          ) : project.liveAppType === 'remodelacionesya' || project.id === 'proj-remodelacionesya' ? (
            <div className="w-full h-full bg-white relative flex flex-col overflow-hidden">
              <iframe
                src="/demos/remodelaciones/index.html"
                className="w-full h-full border-0"
                title={project.title}
              />
            </div>
          ) : project.liveAppType === 'cargoflow' || project.id === 'proj-financial' ? (
            <div className="w-full h-full bg-white relative flex flex-col overflow-hidden">
              <iframe
                src="/demos/cargoflow/index.html"
                className="w-full h-full border-0"
                title={project.title}
              />
            </div>
          ) : (project.liveAppType as string) === 'restaurant' || project.id === 'proj-nexustech' ? (
            <div className="w-full h-full bg-white relative flex flex-col overflow-hidden">
              <iframe
                src="/demos/restaurant/index.html"
                className="w-full h-full border-0"
                title={project.title}
              />
            </div>
          ) : (
            /* SAAS APP MAIN INNER LAYOUT FOR INTEGRATED SOURCE CODE */
            <div className="flex-1 flex overflow-hidden">
            
            {/* 1. APP SIDEBAR NAVIGATION (Within the App, replacing wireframe details) */}
            <aside className="w-56 bg-[var(--color-surface)] border-r border-[#E5E5EA] flex flex-col justify-between p-4 shrink-0 text-left select-none">
              <div className="space-y-6">
                {/* Simulated Corporate Logo inside the SaaS */}
                <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-primary)] font-black text-sm">
                    {project.liveAppType === 'calculator' && 'Ω'}
                    {(project.liveAppType as string) === 'cargoflow' && 'CF'}
                    {(project.liveAppType as string) === 'remodelacionesya' && 'RY'}
                    {(project.liveAppType === 'crm-whatsapp' || (project.liveAppType as string) === 'visualizer' || project.id === 'proj-auto-invoice' || project.id === 'proj-n8n-workflow') && '⚡'}
                  </div>
                  <div>
                    <h5 className="text-[11px] font-sans font-black tracking-wider text-gray-900 uppercase truncate max-w-[120px]">
                      {project.liveAppType === 'calculator' && 'Oracle Finance'}
                      {(project.liveAppType as string) === 'cargoflow' && 'CargoFlow'}
                      {(project.liveAppType as string) === 'remodelacionesya' && 'RemodelYa'}
                      {(project.liveAppType === 'crm-whatsapp' || (project.liveAppType as string) === 'visualizer' || project.id === 'proj-auto-invoice' || project.id === 'proj-n8n-workflow') && (project.title || 'n8n Auto Engine')}
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

                  {(project.liveAppType as string) === 'cargoflow' && (
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

                  {(project.liveAppType as string) === 'remodelacionesya' && (
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

                  {(project.liveAppType === 'crm-whatsapp' || (project.liveAppType as string) === 'visualizer' || project.id === 'proj-auto-invoice' || project.id === 'proj-n8n-workflow' || (project.category && project.category.includes('Automatización') && project.id !== 'proj-apex-crm')) && (
                    <>
                      {[
                        { id: 'dashboard', label: 'Flujo n8n (Canvas)', icon: Network },
                        { id: 'leads', label: 'Captura WhatsApp', icon: MessageSquare },
                        { id: 'excel', label: 'Tabla Leads & Excel', icon: Database },
                        { id: 'ocr', label: 'SmartDoc OCR IA', icon: FileText },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id)}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === t.id
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <t.icon className={`w-4 h-4 ${activeTab === t.id ? 'text-emerald-600' : 'text-gray-400'}`} />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </>
                  )}

                  {(project.liveAppType === 'kanban' || project.id === 'proj-apex-crm' || project.id === 'proj-medismart-crm' || (project.category && project.category.includes('CRM') && project.id !== 'proj-crm-whatsapp')) && (
                    <>
                      {[
                        { id: 'dashboard', label: 'Kanban (Pipeline)', icon: LayoutDashboard },
                        { id: 'conversion', label: 'Funnel Conversión', icon: TrendingUp },
                        { id: 'deals', label: 'Tabla de Prospectos', icon: Database },
                        { id: 'invoices', label: 'Cotización PDF', icon: FileText },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id)}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === t.id
                              ? 'bg-blue-50 text-blue-900 border border-blue-300 shadow-xs font-black'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <t.icon className={`w-4 h-4 ${activeTab === t.id ? 'text-blue-600' : 'text-gray-400'}`} />
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
                  {(project.liveAppType as string) === 'cargoflow' && (
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
                  {(project.liveAppType as string) === 'remodelacionesya' && (
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
                  {/* PROJECT INTERFACE 4: AUTOMATION, N8N, WHATSAPP & EXCEL ENGINE */}
                  {/* ========================================================== */}
                  {(project.liveAppType === 'crm-whatsapp' || (project.liveAppType as string) === 'visualizer' || project.id === 'proj-auto-invoice' || project.id === 'proj-n8n-workflow' || (project.category && project.category.includes('Automatización'))) && (
                    <>
                      {/* TAB 1: CANVAS DE WORKFLOW N8N */}
                      {(activeTab === 'dashboard' || activeTab === 'n8n' || activeTab === 'pipeline') && (
                        <div className="space-y-6">
                          {/* Header Control Toolbar */}
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-gray-200">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                                  Flujo de Trabajo n8n & Webhooks
                                </h2>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Orquestación visual de captura de prospectos desde landing page, calificación con Gemini IA, WhatsApp y sincronización con Excel / CRM.
                              </p>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={runN8nWorkflowSim}
                                disabled={isN8nExecuting}
                                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center space-x-2 transition-all ${
                                  isN8nExecuting
                                    ? 'bg-amber-500 cursor-wait'
                                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                                }`}
                              >
                                <Zap className={`w-4 h-4 ${isN8nExecuting ? 'animate-bounce' : ''}`} />
                                <span>{isN8nExecuting ? 'Ejecutando Workflow n8n...' : '▶ Disparar Prueba Webhook'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Node Diagram Canvas */}
                          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-2xl relative overflow-hidden space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                              <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span>n8n Server Instance: Active (docker-compose)</span>
                              </span>
                              <span className="bg-slate-800 text-cyan-300 px-2 py-0.5 rounded font-mono">POST /webhook/lead-capture</span>
                            </div>

                            {/* Node Connection Flow Graph */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                              {[
                                { idx: 0, title: '1. Webhook Entry', sub: 'POST /landing-lead', type: 'Trigger', color: 'emerald', badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                                { idx: 1, title: '2. Gemini AI Parse', sub: 'Classify & Lead Score', type: 'AI Vision', color: 'cyan', badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
                                { idx: 2, title: '3. WhatsApp Bot', sub: 'Meta Cloud API v18', type: 'Message', color: 'emerald', badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                                { idx: 3, title: '4. Excel Sincro', sub: 'Leads_2026.xlsx', type: 'Spreadsheet', color: 'green', badgeBg: 'bg-green-500/20 text-green-300 border-green-500/40' },
                                { idx: 4, title: '5. Hubspot CRM', sub: 'Etapa "Calificado"', type: 'Pipeline', color: 'amber', badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                                { idx: 5, title: '6. Alerta Slack', sub: '#ventas-notificaciones', type: 'Notification', color: 'blue', badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
                              ].map((node) => {
                                const isActive = activeN8nNode === node.idx;
                                const isDone = activeN8nNode > node.idx || (activeN8nNode === -1 && !isN8nExecuting);
                                return (
                                  <div
                                    key={node.idx}
                                    className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                                      isActive
                                        ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/50 scale-[1.02] shadow-lg shadow-emerald-900/40'
                                        : isDone
                                        ? 'bg-slate-900/90 border-slate-700/80'
                                        : 'bg-slate-900/40 border-slate-800 opacity-60'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold ${node.badgeBg}`}>
                                        {node.type}
                                      </span>
                                      <span className="text-[9px] font-mono text-slate-400">
                                        {isActive ? '⚡ Running...' : isDone ? '✅ 200 OK' : 'Idle'}
                                      </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-white">{node.title}</h4>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{node.sub}</p>

                                    {isActive && (
                                      <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400"
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 0.45 }}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Execution Log Output Console */}
                            <div className="bg-black/90 rounded-xl p-3 font-mono text-[11px] text-emerald-400 border border-slate-800 space-y-1 max-h-36 overflow-y-auto">
                              <div className="text-[10px] text-slate-500 uppercase font-bold flex justify-between border-b border-slate-800 pb-1 mb-1">
                                <span>Log de Ejecución n8n</span>
                                <span>Output Payload JSON</span>
                              </div>
                              {crmLogs.map((log, idx) => (
                                <div key={idx} className="leading-snug">{log}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: CAPTURA DE LEADS WHATSAPP & WEBHOOK FORM */}
                      {activeTab === 'leads' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                              Simulador de Captura de Prospectos
                            </h2>
                            <p className="text-xs text-gray-500">
                              Prueba capturar un nuevo lead desde el formulario o interactúa en vivo con el bot de WhatsApp.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Formulario Webhook Lead Entry */}
                            <div className="md:col-span-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
                              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wide border-b border-gray-100 pb-2">
                                <Zap className="w-4 h-4 text-emerald-600" />
                                <span>Formulario Webhook (Landing Page)</span>
                              </div>

                              <form onSubmit={handleFormLeadSubmit} className="space-y-3 text-xs text-left">
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Nombre Completo *</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej. María Fernanda Morales"
                                    value={leadFormInput.name}
                                    onChange={(e) => setLeadFormInput({ ...leadFormInput, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Corporativo</label>
                                    <input
                                      type="email"
                                      placeholder="maria@empresa.com"
                                      value={leadFormInput.email}
                                      onChange={(e) => setLeadFormInput({ ...leadFormInput, email: e.target.value })}
                                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1">WhatsApp *</label>
                                    <input
                                      type="tel"
                                      required
                                      placeholder="+34 600 123 456"
                                      value={leadFormInput.phone}
                                      onChange={(e) => setLeadFormInput({ ...leadFormInput, phone: e.target.value })}
                                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Servicio de Interés</label>
                                  <select
                                    value={leadFormInput.service}
                                    onChange={(e) => setLeadFormInput({ ...leadFormInput, service: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 text-xs font-bold"
                                  >
                                    <option value="n8n & WhatsApp Bot">n8n & WhatsApp Bot Automático</option>
                                    <option value="SmartDoc OCR IA">SmartDoc OCR IA de Facturas</option>
                                    <option value="CargoFlow ERP">CargoFlow ERP Logística</option>
                                    <option value="RemodelacionesYa">RemodelacionesYa CRM</option>
                                  </select>
                                </div>

                                <button
                                  type="submit"
                                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>🚀 Capturar Lead en Webhook n8n</span>
                                </button>
                              </form>
                            </div>

                            {/* Smartphone Chat Simulator */}
                            <div className="md:col-span-6 flex justify-center">
                              <div className="w-full max-w-xs bg-slate-900 border-4 border-slate-700 rounded-[32px] p-2 flex flex-col h-[420px] shadow-xl relative overflow-hidden">
                                {/* Header top notch */}
                                <div className="w-20 h-4 bg-slate-700 rounded-b-lg absolute top-0 left-1/2 -translate-x-1/2 z-20" />
                                
                                {/* WhatsApp header banner */}
                                <div className="bg-[#075e54] text-white pt-4 pb-2 px-3 flex items-center space-x-2 shrink-0 select-none text-left mt-1 rounded-t-2xl">
                                  <div className="w-7 h-7 bg-emerald-800 rounded-full flex items-center justify-center font-bold text-xs">DT</div>
                                  <div>
                                    <div className="text-[11px] font-bold">Bot Des-Tec n8n</div>
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
                                        className={`max-w-[85%] rounded-lg px-2.5 py-1.5 shadow-xs ${
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

                                {/* Quick Buttons */}
                                <div className="p-2 bg-white border-t border-gray-100 shrink-0 text-left rounded-b-2xl space-y-1">
                                  <span className="text-[8px] text-gray-400 font-bold block">ACCIONES RÁPIDAS:</span>
                                  <div className="grid grid-cols-2 gap-1">
                                    <button
                                      onClick={() => handleSendWA('Quiero probar el webhook de Excel')}
                                      disabled={isBotTyping}
                                      className="text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[9px] p-1.5 rounded border border-emerald-200 font-bold truncate"
                                    >
                                      📊 Probar Excel Sync
                                    </button>
                                    <button
                                      onClick={() => handleSendWA('Procesar factura PDF con IA')}
                                      disabled={isBotTyping}
                                      className="text-left bg-sky-50 hover:bg-sky-100 text-sky-800 text-[9px] p-1.5 rounded border border-sky-200 font-bold truncate"
                                    >
                                      📄 OCR de Factura
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: TABLA DE LEADS EN EXCEL & DELETED LEADS WORKFLOW */}
                      {activeTab === 'excel' && (
                        <div className="space-y-5">
                          {/* Excel Styled Header */}
                          <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Database className="w-5 h-5 text-emerald-300" />
                                <h2 className="text-lg font-bold">📗 Leads_Capturados_Landing_n8n.xlsx</h2>
                              </div>
                              <p className="text-xs text-emerald-200 mt-0.5">
                                Hoja de Excel sincronizada en tiempo real. Modifica o elimina registros para simular la auditoría de bajas.
                              </p>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={handleExportCSV}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-black shadow-xs flex items-center space-x-1.5 transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Exportar Excel (.CSV)</span>
                              </button>
                            </div>
                          </div>

                          {/* Interactive Excel Table */}
                          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="bg-emerald-50 text-emerald-950 font-bold uppercase tracking-wider border-b border-emerald-100 text-[10px]">
                                    <th className="py-2.5 px-3">ID</th>
                                    <th className="py-2.5 px-3">Fecha / Hora</th>
                                    <th className="py-2.5 px-3">Nombre Lead</th>
                                    <th className="py-2.5 px-3">WhatsApp / Phone</th>
                                    <th className="py-2.5 px-3">Origen</th>
                                    <th className="py-2.5 px-3">Puntaje IA</th>
                                    <th className="py-2.5 px-3">Estado CRM</th>
                                    <th className="py-2.5 px-3 text-right">Acción Workflow</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-sans">
                                  {crmLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-emerald-50/30 transition-colors text-gray-800">
                                      <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-gray-500">{lead.id}</td>
                                      <td className="py-2.5 px-3 text-[11px] text-gray-500 font-mono">{lead.date}</td>
                                      <td className="py-2.5 px-3 font-bold text-gray-900">{lead.name}</td>
                                      <td className="py-2.5 px-3 text-emerald-700 font-mono font-bold">{lead.phone}</td>
                                      <td className="py-2.5 px-3 text-[11px] text-gray-600">{lead.origin}</td>
                                      <td className="py-2.5 px-3">
                                        <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-full text-[10px] font-black font-mono">
                                          {lead.score}/100 ⭐
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3">
                                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                          {lead.status}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 text-right">
                                        <button
                                          onClick={() => handleDeleteLead(lead.id, lead.name)}
                                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-md border border-red-200 transition-all text-[10px] font-bold inline-flex items-center space-x-1"
                                          title="Eliminar e iniciar workflow de auditoría n8n"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          <span>Eliminar</span>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {deletedLeadsCount > 0 && (
                              <div className="bg-amber-50 p-3 border-t border-amber-200 text-amber-900 text-xs flex items-center justify-between font-mono">
                                <span className="font-bold">
                                  ⚡ Eventos n8n: {deletedLeadsCount} Lead(s) eliminados y archivados en 'Baja_Leads_Audit.xlsx'
                                </span>
                                <span className="text-[10px] bg-amber-200/60 px-2 py-0.5 rounded font-bold">Slack Alert Sent</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TAB 4: SMARTDOC OCR IA DE FACTURAS */}
                      {activeTab === 'ocr' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                              SmartDoc AI & Extractor OCR
                            </h2>
                            <p className="text-xs text-gray-500">
                              Extracción inteligente de metadatos desde facturas PDF utilizando modelos de IA y sincronización automática.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Document Scan Preview */}
                            <div className="md:col-span-6 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden space-y-4">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-xs">
                                <span className="font-mono text-cyan-400 font-bold">Documento: Factura_TechCorp_2026.pdf</span>
                                <span className="bg-slate-800 text-gray-300 px-2 py-0.5 rounded text-[10px] font-mono">2 Páginas</span>
                              </div>

                              {/* Simulated Document Sheet */}
                              <div className="bg-white text-gray-900 rounded-xl p-4 shadow-inner relative overflow-hidden font-sans space-y-3">
                                {ocrScanning && (
                                  <motion.div
                                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-500 shadow-md shadow-cyan-400 z-10"
                                    initial={{ top: '0%' }}
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                  />
                                )}

                                <div className="flex justify-between border-b pb-2">
                                  <div>
                                    <h4 className="font-black text-xs text-slate-900">TechSupplies International S.A.</h4>
                                    <p className="text-[9px] text-gray-500">RUT / NIF: ES-B99887766</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-mono font-bold text-xs text-emerald-700">FACTURA #F-2026-894</span>
                                    <p className="text-[9px] text-gray-400">Fecha: 28/07/2026</p>
                                  </div>
                                </div>

                                <div className="space-y-1 text-[10px] font-mono">
                                  <div className="flex justify-between text-gray-600 bg-gray-50 p-1 rounded">
                                    <span>2x Licencia n8n Self-Hosted</span>
                                    <span className="font-bold">$1,200.00</span>
                                  </div>
                                  <div className="flex justify-between text-gray-600 bg-gray-50 p-1 rounded">
                                    <span>1x Integración WhatsApp API</span>
                                    <span className="font-bold">$250.00</span>
                                  </div>
                                </div>

                                <div className="border-t pt-2 flex justify-between font-bold text-xs">
                                  <span>Total a Pagar (IVA Incluido):</span>
                                  <span className="text-emerald-700 font-mono text-sm">$1,725.50 USD</span>
                                </div>
                              </div>

                              <button
                                onClick={runOcrScan}
                                disabled={ocrScanning}
                                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
                              >
                                <Sparkles className={`w-4 h-4 ${ocrScanning ? 'animate-spin' : ''}`} />
                                <span>{ocrScanning ? 'Analizando con Gemini AI Vision...' : '🔍 Analizar e Extraer con Gemini AI'}</span>
                              </button>
                            </div>

                            {/* Extracted Output Fields */}
                            <div className="md:col-span-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
                              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2">
                                Metadatos Extraídos (JSON Estructurado)
                              </h4>

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                                  <span className="text-[9px] text-gray-400 uppercase font-bold block">Proveedor</span>
                                  <span className="font-bold text-gray-900">TechSupplies S.A.</span>
                                </div>
                                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                                  <span className="text-[9px] text-gray-400 uppercase font-bold block">RUT / Tax ID</span>
                                  <span className="font-bold text-gray-900 font-mono">ES-B99887766</span>
                                </div>
                                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                                  <span className="text-[9px] text-gray-400 uppercase font-bold block">Subtotal Neto</span>
                                  <span className="font-bold text-gray-900 font-mono">$1,450.00 USD</span>
                                </div>
                                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                                  <span className="text-[9px] text-emerald-700 uppercase font-bold block">Monto Total</span>
                                  <span className="font-black text-emerald-800 font-mono text-sm">$1,725.50 USD</span>
                                </div>
                              </div>

                              <div className="p-3 bg-slate-900 text-cyan-300 rounded-xl font-mono text-[10px] space-y-1">
                                <div className="text-slate-400 font-bold border-b border-slate-800 pb-1">n8n Auto Payload Output:</div>
                                <div>{"{"}</div>
                                <div className="pl-3">"invoice_number": "F-2026-894",</div>
                                <div className="pl-3">"total": 1725.50,</div>
                                <div className="pl-3">"status": "APPROVED_AUTO_SYNC"</div>
                                <div>{"}"}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* ========================================================== */}
                  {/* PROJECT INTERFACE 5: APEX SALES CRM & CONVERSION ENGINE */}
                  {/* ========================================================== */}
                  {(project.liveAppType === 'kanban' || project.id === 'proj-apex-crm' || project.id === 'proj-medismart-crm' || (project.category && project.category.includes('CRM') && project.id !== 'proj-crm-whatsapp')) && (
                    <>
                      {/* TAB 1: KANBAN PIPELINE DE VENTAS & CONVERSIÓN */}
                      {activeTab === 'dashboard' && (
                        <div className="space-y-5">
                          {/* Top Header & Conversion Action */}
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-gray-200">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                                  Pipeline de Ventas & Conversión de Leads
                                </h2>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Arrastra o mueve oportunidades entre etapas para simular la conversión de prospectos a clientes ganados.
                              </p>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={() => setApexNewDealModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
                              >
                                <Plus className="w-4 h-4" />
                                <span>+ Crear Trato / Lead</span>
                              </button>
                            </div>
                          </div>

                          {/* Quick Stats Summary Bar */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-2xs">
                              <span className="text-[10px] text-gray-400 font-bold uppercase block">Pipeline Total</span>
                              <div className="text-lg font-black font-mono text-gray-900 mt-0.5">
                                ${apexDeals.reduce((sum, d) => sum + d.val, 0).toLocaleString()} USD
                              </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl shadow-2xs">
                              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Ventas Ganadas (Closed Won)</span>
                              <div className="text-lg font-black font-mono text-emerald-700 mt-0.5">
                                ${apexDeals.filter(d => d.stage === 'ganado').reduce((sum, d) => sum + d.val, 0).toLocaleString()} USD
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl shadow-2xs">
                              <span className="text-[10px] text-blue-800 font-bold uppercase block">Tasa de Conversión</span>
                              <div className="text-lg font-black font-mono text-blue-700 mt-0.5">
                                {((apexDeals.filter(d => d.stage === 'ganado').length / (apexDeals.length || 1)) * 100).toFixed(1)}%
                              </div>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl shadow-2xs">
                              <span className="text-[10px] text-purple-800 font-bold uppercase block">Tratos en Negociación</span>
                              <div className="text-lg font-black font-mono text-purple-700 mt-0.5">
                                {apexDeals.filter(d => d.stage === 'negociacion' || d.stage === 'propuesta').length} Tratos
                              </div>
                            </div>
                          </div>

                          {/* Kanban 5 Columns Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
                            {[
                              { key: 'entrante', label: '1. Lead Entrante', color: 'border-slate-300 bg-slate-100/60 text-slate-700', badge: 'bg-slate-200 text-slate-800' },
                              { key: 'contactado', label: '2. Contactado', color: 'border-cyan-200 bg-cyan-50/50 text-cyan-800', badge: 'bg-cyan-200 text-cyan-900' },
                              { key: 'propuesta', label: '3. Propuesta', color: 'border-amber-200 bg-amber-50/50 text-amber-800', badge: 'bg-amber-200 text-amber-900' },
                              { key: 'negociacion', label: '4. Negociación', color: 'border-purple-200 bg-purple-50/50 text-purple-800', badge: 'bg-purple-200 text-purple-900' },
                              { key: 'ganado', label: '5. Cliente Ganado 🏆', color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900', badge: 'bg-emerald-300 text-emerald-950 font-black' },
                            ].map((col) => {
                              const colDeals = apexDeals.filter((d) => d.stage === col.key);
                              const colTotal = colDeals.reduce((sum, d) => sum + d.val, 0);

                              return (
                                <div key={col.key} className={`border ${col.color} p-2.5 rounded-xl flex flex-col min-h-[420px] space-y-2.5 text-left`}>
                                  {/* Column Header */}
                                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-2">
                                    <span className="text-[11px] font-bold tracking-tight truncate">{col.label}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${col.badge}`}>
                                      {colDeals.length}
                                    </span>
                                  </div>

                                  <div className="text-[10px] text-gray-500 font-mono font-bold text-right">
                                    Total: ${colTotal.toLocaleString()}
                                  </div>

                                  {/* Deal Cards */}
                                  <div className="space-y-2 flex-1 overflow-y-auto">
                                    {colDeals.map((deal) => (
                                      <div
                                        key={deal.id}
                                        className="bg-white border border-gray-200 p-3 rounded-xl shadow-xs hover:shadow-md transition-all text-left space-y-2 relative group"
                                      >
                                        <div className="flex justify-between items-start">
                                          <span className="text-[9px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                            {deal.id}
                                          </span>
                                          <span className="text-[9px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                            IA Score {deal.score}
                                          </span>
                                        </div>

                                        <div>
                                          <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">{deal.title}</h4>
                                          <p className="text-[10px] text-gray-500 font-bold mt-0.5">{deal.company}</p>
                                        </div>

                                        <div className="flex justify-between items-baseline border-t border-gray-100 pt-1.5">
                                          <span className="text-xs font-black font-mono text-gray-900">
                                            ${deal.val.toLocaleString()}
                                          </span>
                                          <span className="text-[9px] text-gray-400 font-mono">{deal.owner}</span>
                                        </div>

                                        {/* Stage Move Controls */}
                                        <div className="pt-1 flex items-center justify-between gap-1 border-t border-gray-100">
                                          {col.key !== 'ganado' ? (
                                            <button
                                              onClick={() => {
                                                const stages = ['entrante', 'contactado', 'propuesta', 'negociacion', 'ganado'];
                                                const nextIdx = stages.indexOf(col.key) + 1;
                                                if (nextIdx < stages.length) {
                                                  handleMoveDealStage(deal.id, stages[nextIdx]);
                                                }
                                              }}
                                              className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-1 px-2 rounded-lg transition-all flex items-center justify-center space-x-1"
                                            >
                                              <span>Avanzar ➔</span>
                                            </button>
                                          ) : (
                                            <div className="w-full text-center bg-emerald-100 text-emerald-800 text-[10px] font-black py-1 px-2 rounded-lg border border-emerald-300">
                                              ✅ Cliente Convertido
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}

                                    {colDeals.length === 0 && (
                                      <div className="text-[10px] text-gray-400 font-mono py-8 text-center border border-dashed border-gray-200 rounded-lg">
                                        Sin tratos en esta etapa
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* TAB 2: FUNNEL DE CONVERSIÓN & MÉTRICAS */}
                      {activeTab === 'conversion' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                              Embudo de Conversión CRM (Lead to Customer)
                            </h2>
                            <p className="text-xs text-gray-500">
                              Métricas detalladas de tasa de conversión de prospectos comercializables a ventas concretadas.
                            </p>
                          </div>

                          {/* Conversion Funnel Bar Chart */}
                          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide border-b pb-2">
                              Eficiencia del Pipeline de Ventas (Conversión por Etapas)
                            </h3>

                            <div className="space-y-4 text-xs font-sans">
                              {[
                                { stage: '1. Prospectos Totales Entrantes', count: 180, pct: 100, color: 'bg-slate-700', val: '$320,000 USD' },
                                { stage: '2. Contactados & Calificados', count: 124, pct: 68.8, color: 'bg-cyan-600', val: '$240,000 USD' },
                                { stage: '3. Demos & Cotizaciones Enviadas', count: 72, pct: 40.0, color: 'bg-amber-500', val: '$158,000 USD' },
                                { stage: '4. Negociación de Contrato', count: 42, pct: 23.3, color: 'bg-purple-600', val: '$98,000 USD' },
                                { stage: '5. Ventas Cerradas Ganadas (Closed Won)', count: 28, pct: 15.5, color: 'bg-emerald-600', val: '$68,500 USD' },
                              ].map((f, idx) => (
                                <div key={idx} className="space-y-1 text-left">
                                  <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                                    <span>{f.stage}</span>
                                    <div className="space-x-2 font-mono text-[11px]">
                                      <span className="text-gray-500">{f.count} tratos ({f.pct}%)</span>
                                      <span className="text-gray-900 font-bold">{f.val}</span>
                                    </div>
                                  </div>
                                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
                                    <motion.div
                                      className={`h-full ${f.color} rounded-full`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${f.pct}%` }}
                                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Sales Rep Leaderboard */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2 text-left">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Top Asesor Comercial</span>
                              <div className="text-sm font-bold text-gray-900">Ana P. (SaaS Leader)</div>
                              <div className="text-xs text-emerald-700 font-mono font-bold">$63,200 USD Cerrados (6 Ventas)</div>
                            </div>

                            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2 text-left">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Tiempo Promedio Cierre</span>
                              <div className="text-sm font-bold text-gray-900">11.4 Días Calificatorio</div>
                              <div className="text-xs text-blue-700 font-mono font-bold">-2.5 días vs mes anterior</div>
                            </div>

                            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2 text-left">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Valor Promedio de Trato</span>
                              <div className="text-sm font-bold text-gray-900">$23,750 USD / Cliente</div>
                              <div className="text-xs text-purple-700 font-mono font-bold">+18% en Ticket Promedio</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: TABLA DE PROSPECTOS & GESTIÓN DIRECTA DE CONVERSIÓN */}
                      {activeTab === 'deals' && (
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-gray-200">
                            <div>
                              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                                Registro Completo de Oportunidades
                              </h2>
                              <p className="text-xs text-gray-500">
                                Gestiona la conversión individual de prospectos y genera cotizaciones PDF.
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="Buscar trato o contacto..."
                                value={apexSearchQuery}
                                onChange={(e) => setApexSearchQuery(e.target.value)}
                                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-sans focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="bg-blue-900 text-white font-bold uppercase tracking-wider text-[10px]">
                                    <th className="py-2.5 px-3">Código</th>
                                    <th className="py-2.5 px-3">Título del Trato</th>
                                    <th className="py-2.5 px-3">Empresa / Contacto</th>
                                    <th className="py-2.5 px-3">Valor ($ USD)</th>
                                    <th className="py-2.5 px-3">Etapa CRM</th>
                                    <th className="py-2.5 px-3">IA Score</th>
                                    <th className="py-2.5 px-3 text-right">Acción Conversión</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-sans">
                                  {apexDeals
                                    .filter(
                                      (d) =>
                                        d.title.toLowerCase().includes(apexSearchQuery.toLowerCase()) ||
                                        d.company.toLowerCase().includes(apexSearchQuery.toLowerCase()) ||
                                        d.contact.toLowerCase().includes(apexSearchQuery.toLowerCase())
                                    )
                                    .map((deal) => (
                                      <tr key={deal.id} className="hover:bg-blue-50/30 transition-colors text-gray-800">
                                        <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-blue-600">{deal.id}</td>
                                        <td className="py-2.5 px-3 font-bold text-gray-900">{deal.title}</td>
                                        <td className="py-2.5 px-3 text-[11px]">
                                          <div className="font-bold text-gray-800">{deal.company}</div>
                                          <div className="text-gray-400 text-[10px]">{deal.contact} ({deal.email})</div>
                                        </td>
                                        <td className="py-2.5 px-3 font-mono font-bold text-gray-900">${deal.val.toLocaleString()}</td>
                                        <td className="py-2.5 px-3">
                                          <span
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                              deal.stage === 'ganado'
                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                : deal.stage === 'negociacion'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}
                                          >
                                            {deal.stage}
                                          </span>
                                        </td>
                                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                                          {deal.score}/100 ⭐
                                        </td>
                                        <td className="py-2.5 px-3 text-right space-x-1">
                                          {deal.stage !== 'ganado' && (
                                            <button
                                              onClick={() => handleMoveDealStage(deal.id, 'ganado')}
                                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-md transition-all inline-flex items-center space-x-1 shadow-xs"
                                            >
                                              <CheckCircle2 className="w-3 h-3" />
                                              <span>Convertir Ganado</span>
                                            </button>
                                          )}
                                          <button
                                            onClick={() => {
                                              setApexSelectedDealForInvoice(deal);
                                              setActiveTab('invoices');
                                            }}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-bold px-2 py-1 rounded-md transition-all inline-flex items-center space-x-1"
                                          >
                                            <FileText className="w-3 h-3 text-blue-600" />
                                            <span>Cotización</span>
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 4: COTIZACIÓN / FACTURA PDF AUTOMÁTICA */}
                      {activeTab === 'invoices' && (
                        <div className="space-y-6">
                          <div className="pb-2 border-b border-gray-200 flex justify-between items-center">
                            <div>
                              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                                Generador de Cotizaciones & Facturas PDF
                              </h2>
                              <p className="text-xs text-gray-500">
                                Documento comercial generado para cerrar la conversión del prospecto.
                              </p>
                            </div>
                          </div>

                          {/* Invoice Preview Sheet */}
                          <div className="bg-white border border-gray-300 rounded-2xl p-6 sm:p-8 shadow-lg max-w-2xl mx-auto space-y-6 text-left font-sans text-gray-800">
                            {/* Header */}
                            <div className="flex justify-between items-start border-b pb-4">
                              <div>
                                <h3 className="text-xl font-black text-blue-900 tracking-tight">Apex Sales Studio S.A.</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Soluciones de Software Empresarial & CRM</p>
                                <p className="text-[10px] text-gray-400 font-mono">NIF: ES-A88776655 | Madrid, España</p>
                              </div>
                              <div className="text-right">
                                <span className="bg-blue-900 text-white font-mono text-xs font-bold px-3 py-1 rounded-lg">
                                  COTIZACIÓN B2B
                                </span>
                                <p className="text-xs text-gray-500 mt-2 font-mono">
                                  Ref: COT-{apexSelectedDealForInvoice ? apexSelectedDealForInvoice.id : 'DEAL-105'}
                                </p>
                                <p className="text-[10px] text-gray-400">Fecha: {new Date().toISOString().slice(0, 10)}</p>
                              </div>
                            </div>

                            {/* Client Metadata */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Cliente Corporativo</span>
                                <div className="font-bold text-gray-900 text-sm">
                                  {apexSelectedDealForInvoice ? apexSelectedDealForInvoice.company : 'Gourmet Franchise S.A.'}
                                </div>
                                <div className="text-gray-500">
                                  Contacto: {apexSelectedDealForInvoice ? apexSelectedDealForInvoice.contact : 'Carlos Mendoza'}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Estado del Acuerdo</span>
                                <div className="font-bold text-emerald-700 text-sm">
                                  {apexSelectedDealForInvoice ? apexSelectedDealForInvoice.stage.toUpperCase() : 'CLIENTE GANADO (100%)'}
                                </div>
                                <div className="text-gray-500 font-mono">Asesor: Carlos M.</div>
                              </div>
                            </div>

                            {/* Itemized Table */}
                            <div className="border rounded-xl overflow-hidden">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="bg-gray-100 font-bold uppercase text-[10px] border-b">
                                    <th className="p-2.5">Descripción del Servicio</th>
                                    <th className="p-2.5 text-center">Cant.</th>
                                    <th className="p-2.5 text-right">Precio Unitario</th>
                                    <th className="p-2.5 text-right">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-mono">
                                  <tr>
                                    <td className="p-2.5 font-bold font-sans">
                                      {apexSelectedDealForInvoice ? apexSelectedDealForInvoice.title : 'Sistema POS & CRM Restaurantes'}
                                    </td>
                                    <td className="p-2.5 text-center">1</td>
                                    <td className="p-2.5 text-right">
                                      ${(apexSelectedDealForInvoice ? apexSelectedDealForInvoice.val * 0.85 : 38250).toLocaleString()} USD
                                    </td>
                                    <td className="p-2.5 text-right font-bold">
                                      ${(apexSelectedDealForInvoice ? apexSelectedDealForInvoice.val * 0.85 : 38250).toLocaleString()} USD
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-2.5 font-bold font-sans">Soporte Anual & Capacitación Comercial</td>
                                    <td className="p-2.5 text-center">1</td>
                                    <td className="p-2.5 text-right">
                                      ${(apexSelectedDealForInvoice ? apexSelectedDealForInvoice.val * 0.15 : 6750).toLocaleString()} USD
                                    </td>
                                    <td className="p-2.5 text-right font-bold">
                                      ${(apexSelectedDealForInvoice ? apexSelectedDealForInvoice.val * 0.15 : 6750).toLocaleString()} USD
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Total Calculation */}
                            <div className="flex justify-end pt-2">
                              <div className="w-64 space-y-1 text-xs font-mono">
                                <div className="flex justify-between text-gray-500">
                                  <span>Subtotal Neto:</span>
                                  <span>${(apexSelectedDealForInvoice ? apexSelectedDealForInvoice.val : 45000).toLocaleString()} USD</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                  <span>IVA (21%):</span>
                                  <span>${((apexSelectedDealForInvoice ? apexSelectedDealForInvoice.val : 45000) * 0.21).toLocaleString()} USD</span>
                                </div>
                                <div className="flex justify-between text-base font-black text-blue-950 border-t pt-2 border-gray-300">
                                  <span>Total a Pagar:</span>
                                  <span>${((apexSelectedDealForInvoice ? apexSelectedDealForInvoice.val : 45000) * 1.21).toLocaleString()} USD</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t flex justify-between items-center">
                              <span className="text-[10px] text-gray-400">Firmado digitalmente por Apex CRM Engine</span>
                              <button
                                onClick={() => showToast('Descarga simulada de Cotización PDF iniciada', 'success')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center space-x-1.5 shadow-md"
                              >
                                <Download className="w-4 h-4" />
                                <span>Descargar Cotización PDF</span>
                              </button>
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
          )}

        </div>

      </motion.div>

      {/* Modal for Creating New Deal in Apex CRM */}
      <AnimatePresence>
        {apexNewDealModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl max-w-md w-full space-y-4 text-left font-sans"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Crear Nuevo Trato / Lead CRM</span>
                </h3>
                <button
                  onClick={() => setApexNewDealModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Título del Trato *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Proyecto ERP Cloud & Licencias"
                    value={newDealInput.title}
                    onChange={(e) => setNewDealInput({ ...newDealInput, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Empresa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. TechCorp S.A."
                      value={newDealInput.company}
                      onChange={(e) => setNewDealInput({ ...newDealInput, company: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Contacto Principal *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Roberto Valdés"
                      value={newDealInput.contact}
                      onChange={(e) => setNewDealInput({ ...newDealInput, contact: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Valor Estimado ($ USD)</label>
                    <input
                      type="number"
                      placeholder="15000"
                      value={newDealInput.val}
                      onChange={(e) => setNewDealInput({ ...newDealInput, val: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Etapa Inicial</label>
                    <select
                      value={newDealInput.stage}
                      onChange={(e) => setNewDealInput({ ...newDealInput, stage: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="entrante">1. Lead Entrante</option>
                      <option value="contactado">2. Contactado</option>
                      <option value="propuesta">3. Propuesta</option>
                      <option value="negociacion">4. Negociación</option>
                      <option value="ganado">5. Cliente Ganado 🏆</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end space-x-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setApexNewDealModalOpen(false)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                  >
                    Guardar Trato en CRM
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
