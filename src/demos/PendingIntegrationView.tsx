import React, { useState } from 'react';
import { 
  Code2, 
  FolderGit2, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu, 
  FileCode, 
  AlertCircle,
  HelpCircle,
  Download
} from 'lucide-react';
import { PortfolioProject } from '../types';

interface PendingIntegrationViewProps {
  project: PortfolioProject;
  onClose?: () => void;
}

export default function PendingIntegrationView({ project, onClose }: PendingIntegrationViewProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'instructions' | 'specs' | 'env'>('instructions');

  const integrationCommand = `Por favor integra el código fuente para el proyecto "${project.title}" (${project.id}):
- Ubicación deseada: /src/demos/${project.id}/
- Tech Stack: ${project.tags.join(', ')}
- Repositorio o carpeta local de origen a copiar`;

  const handleCopy = () => {
    navigator.clipboard.writeText(integrationCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col overflow-y-auto p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto w-full space-y-6 my-auto">
        
        {/* HEADER BADGE & TITLE */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950 border border-violet-500/30 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Esperando Código Fuente (GitHub / Carpeta Local)</span>
            </div>

            <span className="text-xs font-mono text-slate-400">
              ID: <code className="text-cyan-300 font-bold">{project.id}</code>
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm text-slate-300">
              {project.subtitle} — <span className="text-cyan-400 font-medium">{project.category}</span>
            </p>
          </div>

          {/* Source Code Note */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2 text-violet-300 font-bold font-mono">
              <FolderGit2 className="w-4 h-4 text-violet-400" />
              <span>Arquitectura Aislada sin Servidores Externos</span>
            </div>
            <p className="leading-relaxed">
              Este proyecto no depende de URLs públicas ni sitios en producción externos. Cuando proporciones la carpeta del proyecto o el repositorio de GitHub, su código fuente se montará de forma aislada dentro de este visor.
            </p>
          </div>
        </div>

        {/* INTEGRATION GUIDE TABS */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'instructions'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Paso a Paso de Integración</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Ficha Técnica y Modulos</span>
            </button>

            <button
              onClick={() => setActiveTab('env')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'env'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Registro de Modulos (demoRegistry.ts)</span>
            </button>
          </div>

          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>¿Cómo añadir el código fuente de este proyecto?</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 font-bold font-mono flex items-center justify-center">
                    1
                  </div>
                  <h4 className="font-bold text-white">Proporciona el Código</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Sube la carpeta de tu proyecto o comparte el enlace de tu repositorio de GitHub en el chat.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center">
                    2
                  </div>
                  <h4 className="font-bold text-white">Compilación Aislada</h4>
                  <p className="text-slate-400 leading-relaxed">
                    El asistente integrará el código dentro de <code className="text-cyan-300">/src/demos/{project.id}</code> de forma totalmente independiente.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold font-mono flex items-center justify-center">
                    3
                  </div>
                  <h4 className="font-bold text-white">Ejecución en el Visor</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Se registrará automáticamente en la aplicación y podrás probar la demo interactiva en este visor navegador.
                  </p>
                </div>
              </div>

              {/* COPY INSTRUCTION PROMPT */}
              <div className="p-4 rounded-xl bg-slate-950 border border-violet-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-violet-300">
                    Mensaje de solicitud para el Asistente:
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Instrucción</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3 rounded-lg bg-slate-900 border border-white/10 text-[11px] font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {integrationCommand}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white">Especificaciones para la Integración:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-white/10 space-y-1">
                  <span className="text-slate-500 font-mono block">Stack Tecnológico</span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-white/10 space-y-1">
                  <span className="text-slate-500 font-mono block">Industria Objetivo</span>
                  <span className="font-bold text-white">{project.clientIndustry || 'Servicios Empresariales'}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-white/10 space-y-1 sm:col-span-2">
                  <span className="text-slate-500 font-mono block">Descripción del Proyecto</span>
                  <p className="text-slate-300">{project.description}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white">Estructura Modular Registrada:</h3>
              <p className="text-slate-400">
                Cada demo se registra en <code className="text-cyan-300 font-mono">/src/demos/demoRegistry.ts</code> sin modificar el resto de la aplicación ni depender de APIs externas.
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-white/10 font-mono text-[11px] text-slate-300 space-y-1">
                <div><span className="text-violet-400">// demoRegistry.ts</span></div>
                <div><span className="text-cyan-400">import</span> RemodelacionesYaDemo <span className="text-cyan-400">from</span> <span className="text-emerald-300">'./RemodelacionesYaDemo'</span>;</div>
                <div><span className="text-cyan-400">export const</span> demoRegistry = &#123;</div>
                <div className="pl-4"><span className="text-amber-300">'proj-remodelacionesya'</span>: RemodelacionesYaDemo,</div>
                <div className="pl-4 text-slate-500"><span className="text-amber-300">'{project.id}'</span>: undefined <span className="text-slate-500">// Esperando código</span></div>
                <div>&#125;;</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
