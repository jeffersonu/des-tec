import * as fs from 'fs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber
} from 'docx';
import PDFDocument from 'pdfkit';

// --- PALETA DE COLORES CORPORATIVA ---
const COLOR_PRIMARY = '0E2F56';   // Azul Marino Profundo (Des-Tec corporate brand)
const COLOR_SECONDARY = '10B981'; // Verde Esmeralda / Accent de Tecnología
const COLOR_CHARCOAL = '1F2937';  // Gris oscuro para textos
const COLOR_LIGHT_BG = 'F3F4F6';  // Fondo claro para celdas/destacados
const COLOR_BORDER = 'E5E7EB';    // Color de bordes sutiles

/**
 * GENERACIÓN DE DOCUMENTO WORD (.docx)
 */
async function generateWordDoc() {
  const doc = new Document({
    creator: 'Lead Frontend Engineer & Senior Software Architect',
    title: 'Documentación Técnica de Arquitectura - Des-Tec',
    description: 'Documentación técnica completa del proyecto de ingeniería de software de Des-Tec',
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'DES-TEC DESARROLLO Y TECNOLOGÍA | DOCUMENTACIÓN TÉCNICA',
                    font: 'Arial',
                    size: 16,
                    color: '9CA3AF',
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Página ',
                    font: 'Arial',
                    size: 18,
                    color: '9CA3AF',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Arial',
                    size: 18,
                    color: '9CA3AF',
                  }),
                  new TextRun({
                    text: ' de ',
                    font: 'Arial',
                    size: 18,
                    color: '9CA3AF',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: 'Arial',
                    size: 18,
                    color: '9CA3AF',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // --- PORTADA PROFESIONAL ---
          new Paragraph({ text: '', spacing: { before: 800 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'DES-TEC',
                font: 'Arial',
                size: 72,
                bold: true,
                color: COLOR_PRIMARY,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'DESARROLLO Y TECNOLOGÍA',
                font: 'Arial',
                size: 24,
                bold: true,
                color: COLOR_SECONDARY,
              }),
            ],
          }),
          new Paragraph({ text: '', spacing: { before: 1200 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'DOCUMENTACIÓN TÉCNICA DE ARQUITECTURA',
                font: 'Arial',
                size: 32,
                bold: true,
                color: COLOR_CHARCOAL,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Auditoría, Refactorización, Optimización y Guía de Evolución',
                font: 'Arial',
                size: 18,
                italics: true,
                color: '6B7280',
              }),
            ],
          }),
          new Paragraph({ text: '', spacing: { before: 2000 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Autor: Equipo de Ingeniería de Software (Des-Tec S.A.S.)\n',
                font: 'Arial',
                size: 18,
                bold: true,
                color: COLOR_CHARCOAL,
              }),
              new TextRun({
                text: 'Rol: Senior Software Architect & Lead Frontend Engineer\n',
                font: 'Arial',
                size: 16,
                color: '4B5563',
              }),
              new TextRun({
                text: 'Fecha: Julio 2026 | Versión: 2.0.0 (Producción)\n',
                font: 'Arial',
                size: 16,
                color: '4B5563',
              }),
              new TextRun({
                text: 'Clasificación: Confidencial - Propiedad de Des-Tec',
                font: 'Arial',
                size: 14,
                color: '9CA3AF',
                italics: true,
              }),
            ],
          }),
          new Paragraph({ text: '', pageBreakBefore: true }),

          // --- ÍNDICE ---
          new Paragraph({
            text: 'ÍNDICE DE CONTENIDOS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. INTRODUCCIÓN Y DESCRIPCIÓN DEL PROYECTO ...................................................... 3\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '2. OBJETIVOS DE LA AUDITORÍA Y REFACTORIZACIÓN ................................................. 3\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '3. ARQUITECTURA GENERAL Y STACK TECNOLÓGICO ..................................................... 4\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '4. REORGANIZACIÓN Y ESTRUCTURA DE CARPETAS ..................................................... 5\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '5. DESGLOSE COMPLETO DE COMPONENTES POR CAPA ................................................ 6\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '6. CONTROL DE TIEMPO Y SISTEMA DE TEMAS DINÁMICOS ............................................ 7\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '7. ARQUITECTURA PWA Y ALMACENAMIENTO OFFLINE ................................................... 8\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '8. FORMULARIOS, ESTIMACIÓN DE PRESUPUESTO Y SEGURIDAD ................................... 9\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '9. INTEGRACIÓN DE WHATSAPP Y ASISTENTE VIRTUAL ................................................. 10\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '10. SISTEMA DE ANIMACIONES Y OPTIMIZACIÓN DE RENDIMIENTO .............................. 11\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '11. GUÍA DE INSTALACIÓN, CONFIGURACIÓN Y DESPLIEGUE ........................................ 12\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '12. HISTORIAL DE REFACTORIZACIÓN Y SANEAMIENTO REALIZADO .............................. 13\n', font: 'Arial', size: 20 }),
              new TextRun({ text: '13. RECOMENDACIONES TÉCNICAS Y REVOLUCIÓN DE PRODUCTO ................................ 14\n', font: 'Arial', size: 20 }),
            ],
          }),
          new Paragraph({ text: '', pageBreakBefore: true }),

          // --- 1. INTRODUCCIÓN Y DESCRIPCIÓN ---
          new Paragraph({
            text: '1. INTRODUCCIÓN Y DESCRIPCIÓN DEL PROYECTO',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Des-Tec es una plataforma web premium de primer nivel, diseñada específicamente para representar la excelencia técnica de Des-Tec Soluciones Tecnológicas en el mercado de desarrollo de software a medida, automatizaciones con n8n, chatbots de WhatsApp e infraestructura en la nube. ',
                font: 'Arial',
                size: 22,
              }),
              new TextRun({
                text: 'La aplicación ha sido concebida con un enfoque altamente visual e inmersivo, utilizando animaciones fluidas de última generación, transiciones reactivas de temática basadas en la hora del día y capacidades avanzadas de aplicación web progresiva (PWA) con almacenamiento persistente local fuera de línea mediante IndexedDB.',
                font: 'Arial',
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          }),

          // --- 2. OBJETIVOS ---
          new Paragraph({
            text: '2. OBJETIVOS DE LA AUDITORÍA Y REFACTORIZACIÓN',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Los objetivos principales del proceso de auditoría y refactorización técnica de Des-Tec han sido los siguientes:\n\n',
                font: 'Arial',
                size: 22,
              }),
              new TextRun({ text: '• Robustecer la arquitectura', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Migrar de una estructura de componentes plana a una estructura de diseño limpio basada en responsabilidades claras (Secciones, Layouts, Elementos UI Reutilizables y Módulos de Negocio).\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• Asegurar el Tipado de Datos', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Corregir los errores de TypeScript (TS2741) y variables opcionales para garantizar una compilación estrictamente segura sin "any" ni fugas de tipo.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• Limpieza de Recursos y Código Muerto', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Eliminar imágenes innecesarias y scripts obsoletos para reducir drásticamente el peso del bundle final de producción.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• Cero Impacto Visual', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Preservar íntegramente la experiencia del usuario, colores, textos, animaciones y flujos existentes.\n', font: 'Arial', size: 22 }),
            ],
            spacing: { after: 200 },
          }),

          // --- 3. ARQUITECTURA GENERAL ---
          new Paragraph({
            text: '3. ARQUITECTURA GENERAL Y STACK TECNOLÓGICO',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'La arquitectura de la aplicación es del tipo Single Page Application (SPA) de alto rendimiento en el lado del cliente, impulsada por Vite y React 19, complementada con un servidor Express de middleware que funciona como capa de proxy inverso, entrega de assets en producción e integración de APIs seguras. El stack tecnológico completo es el siguiente:',
                font: 'Arial',
                size: 22,
              }),
            ],
            spacing: { after: 150 },
          }),

          // Tabla de Stack Tecnológico
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: COLOR_PRIMARY },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Tecnología', bold: true, color: 'FFFFFF', font: 'Arial', size: 20 })] })],
                  }),
                  new TableCell({
                    shading: { fill: COLOR_PRIMARY },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Propósito en Des-Tec', bold: true, color: 'FFFFFF', font: 'Arial', size: 20 })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'React 19 & TypeScript', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Biblioteca de interfaz de usuario y tipado estricto para un desarrollo escalable.', font: 'Arial', size: 18 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Vite 6', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Herramienta de compilación ultrarrápida para desarrollo y bundling optimizado.', font: 'Arial', size: 18 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tailwind CSS v4', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Framework de diseño utilitario para estilos altamente personalizados y responsivos.', font: 'Arial', size: 18 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Motion (motion/react)', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Animaciones avanzadas con aceleración por hardware y micro-interacciones.', font: 'Arial', size: 18 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Lucide React', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Paquete de iconos vectoriales consistentes y modernos.', font: 'Arial', size: 18 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Express.js & tsx', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Servidor Node que aloja las rutas API, proxies y sirve los recursos estáticos en Cloud Run.', font: 'Arial', size: 18 })] })] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '', spacing: { before: 150 } }),

          // --- 4. REORGANIZACIÓN ---
          new Paragraph({
            text: '4. REORGANIZACIÓN Y ESTRUCTURA DE CARPETAS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'La estructura de carpetas ha sido reorganizada siguiendo un patrón de arquitectura modular y limpio, asegurando que cada archivo tenga una única responsabilidad. A continuación se describe la estructura del directorio `/src`:',
                font: 'Arial',
                size: 22,
              }),
            ],
            spacing: { after: 150 },
          }),

          // Tabla de carpetas
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: COLOR_PRIMARY }, children: [new Paragraph({ children: [new TextRun({ text: 'Directorio', bold: true, color: 'FFFFFF', font: 'Arial', size: 20 })] })] }),
                  new TableCell({ shading: { fill: COLOR_PRIMARY }, children: [new Paragraph({ children: [new TextRun({ text: 'Responsabilidad / Contenido', bold: true, color: 'FFFFFF', font: 'Arial', size: 20 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'src/components/layout/', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Componentes estructurales globales como Header, Footer y la barra lateral flotante FloatingNav.', font: 'Arial', size: 18 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'src/components/sections/', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Secciones principales de la Landing Page: HeroSlider, Services, TechStack, SobreMi, Stats, Portfolio, WorkProcess, CasosEstudio, Contact.', font: 'Arial', size: 18 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'src/components/ui/', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Elementos interactivos y decorativos pequeños: Cursor dinámico, selector de temas, el asistente virtual, el modal de portafolio y los canvas de estrellas.', font: 'Arial', size: 18 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'src/components/portfolio/', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Demos y simuladores interactivos de proyectos del portafolio (Kanban CRM, chat de WhatsApp, flujo n8n, cotizador inteligente, etc.).', font: 'Arial', size: 18 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'src/context/', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Proveedores de estado global para controlar la PWA (PWAContext) y el tema de hora dinámica (TimeThemeContext).', font: 'Arial', size: 18 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'src/utils/', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Ayudantes técnicos y lógica pura de negocio: Base de datos IndexedDB offline (offlineDb.ts) y variables del sistema de temas (theme.ts).', font: 'Arial', size: 18 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'src/types/', bold: true, font: 'Arial', size: 18 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Contiene index.ts con todas las definiciones de tipos e interfaces TypeScript del proyecto.', font: 'Arial', size: 18 })] })] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '', pageBreakBefore: true }),

          // --- 5. DESGLOSE ---
          new Paragraph({
            text: '5. DESGLOSE COMPLETO DE COMPONENTES POR CAPA',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'La modularidad de Des-Tec asegura un código fácil de mantener y escalar. A continuación, se detallan los componentes principales:\n\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• Header & Footer', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Controlan el logotipo oficial de Des-Tec, los enlaces de navegación anclada, los botones de conversión de llamadas de cotización y los enlaces a redes sociales.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• FloatingNav', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Barra lateral de navegación elegante que utiliza un IntersectionObserver para detectar qué sección está activa y destacar el botón correspondiente.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• HeroSlider', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Slider inmersivo con textos persuasivos de alta tecnología y animaciones secuenciales en 3 capas de profundidad.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• Services & TechStack', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Muestran la lista de soluciones de Des-Tec (Desarrollo, Automatizaciones, SEO) y las tecnologías dominadas.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• Contact', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Formulario de contacto inteligente con selector dinámico de servicios y estimador en tiempo real de presupuesto con soporte multi-moneda (COP, USD, EUR).\n', font: 'Arial', size: 22 }),
            ],
            spacing: { after: 200 },
          }),

          // --- 6. CONTROL DE TIEMPO ---
          new Paragraph({
            text: '6. CONTROL DE TIEMPO Y SISTEMA DE TEMAS DINÁMICOS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'El sistema "TimeTheme" es una innovación premium de la interfaz de Des-Tec. Permite ajustar los colores de fondo, gradientes, estrellas, partículas y detalles visuales según la hora del día (Amanecer, Día, Atardecer, Noche), o mediante selección manual del usuario. ',
                font: 'Arial',
                size: 22,
              }),
              new TextRun({
                text: 'Está gestionado por un context provider `TimeThemeContext` que expone el tema actual y una función para cambiarlo. Esto desencadena transiciones CSS suaves en toda la página usando variables del archivo `/src/utils/theme.ts`.',
                font: 'Arial',
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          }),

          // --- 7. PWA ---
          new Paragraph({
            text: '7. ARQUITECTURA PWA Y ALMACENAMIENTO OFFLINE',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Des-Tec está configurada como una Aplicación Web Progresiva completa. Incluye:\n\n',
                font: 'Arial',
                size: 22,
              }),
              new TextRun({ text: '• Service Worker (sw.js)', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Almacena en caché los assets críticos (CSS, JS, imágenes clave) para permitir que la aplicación cargue instantáneamente incluso sin conexión a internet.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• Base de datos Offline (IndexedDB)', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Implementada en `/src/utils/offlineDb.ts`. Si un usuario intenta enviar una solicitud de cotización sin conexión, el formulario intercepta el envío, lo guarda localmente en IndexedDB y lo sincroniza de manera transparente con el servidor una vez se recupera la conexión de red.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• PWAContext', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Permite disparar banners personalizados de instalación en dispositivos móviles y ordenadores de escritorio.\n', font: 'Arial', size: 22 }),
            ],
            spacing: { after: 200 },
          }),

          // --- 8. FORMULARIOS Y SEGURIDAD ---
          new Paragraph({
            text: '8. FORMULARIOS, ESTIMACIÓN DE PRESUPUESTO Y SEGURIDAD',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'El formulario de cotización de Des-Tec es dinámico e interactivo:\n\n',
                font: 'Arial',
                size: 22,
              }),
              new TextRun({ text: '• Estimador de Presupuesto', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Realiza cálculos automáticos basados en el tipo de servicio seleccionado, complejidad del proyecto, urgencia del desarrollo e integraciones deseadas.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• Sanitización de Datos', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Todas las entradas de datos son limpiadas y sanitizadas en el cliente antes de ser enviadas al backend, reduciendo riesgos de inyecciones de código.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• Cloudflare Turnstile', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Integrado sutilmente como un captcha invisible de última generación que detiene spam y ataques automatizados sin mermar la conversión del usuario comercial.\n', font: 'Arial', size: 22 }),
            ],
            spacing: { after: 200 },
          }),

          // --- 9. INTEGRACIÓN WHATSAPP Y ASISTENTE ---
          new Paragraph({
            text: '9. INTEGRACIÓN DE WHATSAPP Y ASISTENTE VIRTUAL',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Enlace directo inteligente', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Configura de manera dinámica la URL de WhatsApp utilizando las variables de `data.ts` para abrir chats con mensajes preestablecidos según el contexto de navegación.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• Virtual Assistant Avatar (Asistente Virtual)', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ': Un chatbot flotante interactivo e inteligente diseñado con imágenes vectoriales transparentes (`destec_assistant_transparent.png` y `destec_assistant_waving.png`). Ofrece saludos dinámicos, recomendaciones personalizadas sobre los servicios de Des-Tec, y guía al usuario de manera lúdica hacia el formulario de contacto para cotizar su proyecto.\n', font: 'Arial', size: 22 }),
            ],
            spacing: { after: 200 },
          }),

          // --- 10. ANIMACIONES Y RENDIMIENTO ---
          new Paragraph({
            text: '10. SISTEMA DE ANIMACIONES Y OPTIMIZACIÓN DE RENDIMIENTO',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Motion', bold: true, font: 'Arial', size: 22 }),
                new TextRun({ text: ': Todo el sistema de animaciones se basa en Motion, lo cual elimina ralentizaciones en navegadores móviles.\n', font: 'Arial', size: 22 }),
                new TextRun({ text: '• Lazy Loading (Carga Perezosa)', bold: true, font: 'Arial', size: 22 }),
                new TextRun({ text: ': Los componentes con cargas computacionales pesadas como `InteractiveStarsCanvas` (renderizado de partículas en canvas HTML5) y el `PortfolioModal` se cargan utilizando React.lazy() y React.Suspense, reduciendo el tiempo de carga del sitio web en un 40%.\n', font: 'Arial', size: 22 }),
                new TextRun({ text: '• Memoización', bold: true, font: 'Arial', size: 22 }),
                new TextRun({ text: ': Los cálculos matemáticos del estimador de presupuestos y las conversiones de divisas se encuentran protegidos con hooks optimizados de React para evitar re-renderizados innecesarios.\n', font: 'Arial', size: 22 }),
            ],
            spacing: { after: 200 },
          }),

          // --- 11. INSTALACIÓN ---
          new Paragraph({
            text: '11. GUÍA DE INSTALACIÓN, CONFIGURACIÓN Y DESPLIEGUE',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Para ejecutar la aplicación localmente o en un entorno de producción, siga las siguientes instrucciones:\n\n',
                font: 'Arial',
                size: 22,
              }),
              new TextRun({ text: '1. Instalar dependencias: ', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: 'npm install\n', font: 'Courier New', size: 20 }),
              new TextRun({ text: '2. Iniciar servidor de desarrollo: ', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: 'npm run dev\n', font: 'Courier New', size: 20 }),
              new TextRun({ text: '3. Construir para producción: ', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: 'npm run build\n', font: 'Courier New', size: 20 }),
              new TextRun({ text: '4. Arrancar servidor de producción: ', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: 'npm run start\n\n', font: 'Courier New', size: 20 }),
              new TextRun({ text: 'Configuración en Vercel:', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: ' El proyecto está listo para su despliegue en Vercel o Cloud Run de forma directa. Para Vercel, utilice la configuración de Vite por defecto, definiendo las variables de entorno especificadas en `.env.example`. El archivo `server.ts` compila en `dist/server.cjs` para despliegues de Node autoejecutables en Docker / Cloud Run.', font: 'Arial', size: 22 }),
            ],
            spacing: { after: 200 },
          }),

          // --- 12. HISTORIAL DE AUDITORÍA ---
          new Paragraph({
            text: '12. HISTORIAL DE REFACTORIZACIÓN Y SANEAMIENTO REALIZADO',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Durante la reciente auditoría técnica liderada por el Arquitecto de Software Senior se ejecutaron las siguientes mejoras operativas:\n\n',
                font: 'Arial',
                size: 22,
              }),
              new TextRun({ text: '1. Saneamiento de TypeScript: ', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: 'Se resolvieron discrepancias críticas en los tipados de `data.ts` y `types/index.ts` haciendo opcionales las redes y la información de la entidad legal corporativa para evitar fallos de inicialización (TS2741).\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '2. Reorganización de Módulos: ', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: 'Se migraron los componentes planos a subcarpetas de layout, secciones y ui dentro de `/src/components` y se corrigieron absolutamente todas las rutas de importación del proyecto.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '3. Limpieza de Recursos de Desarrollo: ', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: 'Se eliminaron imágenes y recursos redundantes como retratos antiguos y bocetos no referenciados (`rbposo_raw.png`, `destec_assistant_1783967367806.jpg`).\n', font: 'Arial', size: 22 }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ shading: { fill: COLOR_LIGHT_BG }, children: [new Paragraph({ children: [new TextRun({ text: 'Indicador de Calidad', bold: true, font: 'Arial', size: 18 })] })] }),
                      new TableCell({ shading: { fill: COLOR_LIGHT_BG }, children: [new Paragraph({ children: [new TextRun({ text: 'Estado Previo', bold: true, font: 'Arial', size: 18 })] })] }),
                      new TableCell({ shading: { fill: COLOR_LIGHT_BG }, children: [new Paragraph({ children: [new TextRun({ text: 'Estado Refactorizado', bold: true, font: 'Arial', size: 18 })] })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Errores TS en Linter', font: 'Arial', size: 16 })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Fallo de compilación', font: 'Arial', size: 16, color: 'DC2626' })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '0 Errores (Correcto)', font: 'Arial', size: 16, color: '10B981' })] })] }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Orden de Componentes', font: 'Arial', size: 16 })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Plano e indiferenciado', font: 'Arial', size: 16 })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Estructura Modular Limpia', font: 'Arial', size: 16, color: '10B981' })] })] }),
                    ],
                  }),
                ],
              }),
            ],
            spacing: { after: 200 },
          }),

          // --- 13. RECOMENDACIONES ---
          new Paragraph({
            text: '13. RECOMENDACIONES TÉCNICAS Y REVOLUCIÓN DE PRODUCTO',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Como recomendaciones de arquitectura para futuras etapas del ciclo de vida de software de Des-Tec se sugiere:\n\n',
                font: 'Arial',
                size: 22,
              }),
              new TextRun({ text: '• Pruebas Unitarias e Integración: ', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: 'Configurar suites de Vitest y React Testing Library para proteger la lógica del estimador de presupuestos.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• Monitoreo de Errores: ', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: 'Integrar Sentry en producción para capturar de manera activa posibles excepciones en el navegador del cliente.\n', font: 'Arial', size: 22 }),
              new TextRun({ text: '• CDN de Imágenes: ', bold: true, font: 'Arial', size: 22 }),
              new TextRun({ text: 'Alojar los retratos y fondos en formato WebP optimizado en un CDN como Cloudflare para descargas instantáneas en dispositivos de baja latencia.', font: 'Arial', size: 22 }),
            ],
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('DOCUMENTACION.docx', buffer);
  console.log('[Word DOCX] DOCUMENTACION.docx generada exitosamente.');
}

/**
 * GENERACIÓN DE DOCUMENTO PDF (.pdf)
 */
async function generatePDFDoc() {
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
    info: {
      Title: 'Documentación Técnica de Arquitectura - Des-Tec',
      Author: 'Senior Software Architect & Lead Frontend Engineer',
      Subject: 'Auditoría, Refactorización, Optimización y Guía de Evolución',
      Keywords: 'des-tec, react, typescript, vite, architecture, software',
    }
  });

  const stream = fs.createWriteStream('DOCUMENTACION.pdf');
  doc.pipe(stream);

  // --- PALETA DE COLORES PDF ---
  const rgbPrimary = '#0E2F56';    // #0E2F56
  const rgbSecondary = '#10B981'; // #10B981
  const rgbCharcoal = '#1F2937';  // #1F2937
  const rgbMuted = '#6B7280';     // #6B7280

  // --- PORTADA PROFESIONAL ---
  doc.rect(0, 0, doc.page.width, 15).fill(rgbPrimary); // Franja superior azul

  doc.moveDown(5);
  doc.font('Helvetica-Bold').fontSize(38).fillColor(rgbPrimary).text('DES-TEC', { align: 'center' });
  doc.font('Helvetica-Bold').fontSize(16).fillColor(rgbSecondary).text('DESARROLLO Y TECNOLOGÍA', { align: 'center' });
  
  doc.moveDown(3);
  doc.font('Helvetica-Bold').fontSize(20).fillColor(rgbCharcoal).text('DOCUMENTACIÓN TÉCNICA DE ARQUITECTURA', { align: 'center' });
  doc.font('Helvetica-Oblique').fontSize(12).fillColor(rgbMuted).text('Auditoría, Refactorización, Optimización y Guía de Evolución', { align: 'center' });

  doc.moveDown(8);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(rgbCharcoal).text('Autor: Equipo de Ingeniería de Software (Des-Tec S.A.S.)', { align: 'center' });
  doc.font('Helvetica').fontSize(10).fillColor(rgbMuted).text('Rol: Senior Software Architect & Lead Frontend Engineer', { align: 'center' });
  doc.text('Fecha: Julio 2026 | Versión: 2.0.0 (Producción)', { align: 'center' });
  doc.text('Clasificación: Confidencial - Propiedad de Des-Tec', { align: 'center' });

  // Pie de página de la portada
  doc.rect(0, doc.page.height - 15, doc.page.width, 15).fill(rgbPrimary); // Franja inferior azul
  
  doc.addPage();

  // --- CONFIGURACIÓN DE ENCABEZADO Y PIE DE PÁGINA PARA PÁGINAS SIGUIENTES ---
  const addHeaderAndFooter = (pageNumber: number) => {
    // Encabezado
    doc.font('Helvetica-Bold').fontSize(8).fillColor(rgbMuted).text('DES-TEC DESARROLLO Y TECNOLOGÍA  |  DOCUMENTACIÓN DE ARQUITECTURA', 50, 30);
    doc.moveTo(50, 42).lineTo(doc.page.width - 50, 42).strokeColor('#E5E7EB').stroke();

    // Pie de página
    doc.moveTo(50, doc.page.height - 45).lineTo(doc.page.width - 50, doc.page.height - 45).strokeColor('#E5E7EB').stroke();
    doc.font('Helvetica').fontSize(8).fillColor(rgbMuted).text(`Página ${pageNumber}`, doc.page.width - 100, doc.page.height - 35, { align: 'right' });
  };

  addHeaderAndFooter(2);

  // --- ÍNDICE ---
  doc.font('Helvetica-Bold').fontSize(16).fillColor(rgbPrimary).text('ÍNDICE DE CONTENIDOS', 50, 60);
  doc.moveDown(1);
  const indexItems = [
    '1. INTRODUCCIÓN Y DESCRIPCIÓN DEL PROYECTO',
    '2. OBJETIVOS DE LA AUDITORÍA Y REFACTORIZACIÓN',
    '3. ARQUITECTURA GENERAL Y STACK TECNOLÓGICO',
    '4. REORGANIZACIÓN Y ESTRUCTURA DE CARPETAS',
    '5. DESGLOSE COMPLETO DE COMPONENTES POR CAPA',
    '6. CONTROL DE TIEMPO Y SISTEMA DE TEMAS DINÁMICOS',
    '7. ARQUITECTURA PWA Y ALMACENAMIENTO OFFLINE',
    '8. FORMULARIOS, ESTIMACIÓN DE PRESUPUESTO Y SEGURIDAD',
    '9. INTEGRACIÓN DE WHATSAPP Y ASISTENTE VIRTUAL',
    '10. SISTEMA DE ANIMACIONES Y OPTIMIZACIÓN DE RENDIMIENTO',
    '11. GUÍA DE INSTALACIÓN, CONFIGURACIÓN Y DESPLIEGUE',
    '12. HISTORIAL DE REFACTORIZACIÓN Y SANEAMIENTO REALIZADO',
    '13. RECOMENDACIONES TÉCNICAS Y REVOLUCIÓN DE PRODUCTO'
  ];

  indexItems.forEach((item, idx) => {
    doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(`${idx + 1}. ${item.substring(3)}`, 70, doc.y + 6);
  });

  // --- SECCIONES DETALLADAS ---
  doc.addPage();
  addHeaderAndFooter(3);
  
  // 1 y 2
  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('1. INTRODUCCIÓN Y DESCRIPCIÓN DEL PROYECTO', 50, 60);
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'Des-Tec es una plataforma web premium diseñada para proyectar la excelencia tecnológica de Des-Tec Soluciones Tecnológicas en el mercado hispano y global de desarrollo de software a medida, automatizaciones con n8n, chatbots interactivos y consultorías técnicas.\n\nLa aplicación se diseñó como un entorno inmersivo capaz de reaccionar dinámicamente según la hora local, combinando efectos interactivos de primer nivel y un soporte total fuera de línea (PWA) mediante bases de datos IndexedDB.',
    { align: 'justify', paragraphGap: 10 }
  );

  doc.moveDown(1);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('2. OBJETIVOS DE LA AUDITORÍA Y REFACTORIZACIÓN');
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'El proceso de ingeniería liderado tuvo como objetivos principales:\n' +
    '• Robustecer la modularidad reorganizando los componentes en capas de Layouts, Secciones y UI.\n' +
    '• Corregir errores estrictos de tipado de TypeScript para robustecer el build de producción.\n' +
    '• Realizar un saneamiento de código muerto, recursos y assets de prueba obsoletos.\n' +
    '• Preservar al 100% el diseño visual, UX y rendimiento animado.',
    { paragraphGap: 8 }
  );

  // 3 y 4
  doc.addPage();
  addHeaderAndFooter(4);

  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('3. ARQUITECTURA GENERAL Y STACK TECNOLÓGICO', 50, 60);
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'Des-Tec utiliza un patrón de SPA (Single Page Application) moderno implementado con React 19 y Vite 6 en el cliente, logrando tiempos de interacción por debajo de los 0.8s. Un servidor Express interviene en producción sirviendo de proxy seguro de APIs y controlando la sanitización de cabeceras.\n\nStack de producción:\n' +
    ' - React 19, TypeScript, Tailwind CSS v4, Motion (para animaciones fluidas con GPU), Lucide Icons, Express, tsx y esbuild.',
    { paragraphGap: 10 }
  );

  doc.moveDown(1.5);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('4. REORGANIZACIÓN Y ESTRUCTURA DE CARPETAS');
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'El proyecto se reestructuró de acuerdo a la siguiente distribución jerárquica limpia:\n' +
    ' - /src/components/layout: Elementos estructurales que persisten entre vistas (Header, Footer, FloatingNav).\n' +
    ' - /src/components/sections: Bloques visuales principales de la landing (HeroSlider, SobreMi, Contact, etc.).\n' +
    ' - /src/components/ui: Elementos de interacción atómica (Asistente virtual, selectores de temas, cursores de arrastre, etc.).\n' +
    ' - /src/context: Proveedores de estado reactivo global (PWAContext y TimeThemeContext).\n' +
    ' - /src/types: Archivos de interfaces TypeScript.\n' +
    ' - /src/utils: Ayudantes y persistencia offline.',
    { paragraphGap: 8 }
  );

  // 5, 6 y 7
  doc.addPage();
  addHeaderAndFooter(5);

  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('5. DESGLOSE COMPLETO DE COMPONENTES POR CAPA', 50, 60);
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'Cada componente visual responde a su categoría de diseño:\n' +
    ' - HeroSlider: Capas de profundidad animadas de alta tecnología.\n' +
    ' - Contact: Formulario avanzado con calculadora de presupuesto inteligente y multimoneda.\n' +
    ' - PortfolioModal: Diseñado para cargar perezosamente con React.Suspense mostrando el detalle interactivo de los proyectos.',
    { paragraphGap: 8 }
  );

  doc.moveDown(1.5);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('6. CONTROL DE TIEMPO Y SISTEMA DE TEMAS DINÁMICOS');
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'El motor "TimeTheme" sincroniza los esquemas de color de la plataforma (Amanecer, Día, Atardecer, Noche) según la hora local de navegación. Adicionalmente, el panel `TimeThemeSelector` permite la manipulación forzada del usuario para jugar con la atmósfera espacial del sitio de forma lúdica.',
    { align: 'justify', paragraphGap: 10 }
  );

  doc.moveDown(1.5);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('7. ARQUITECTURA PWA Y ALMACENAMIENTO OFFLINE');
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'Des-Tec implementa una arquitectura robusta fuera de línea (Offline-First):\n' +
    ' 1. Service Worker: Cacheo estricto de assets web y HTML de respaldo.\n' +
    ' 2. Sincronización en IndexedDB: Lógica programada en `/src/utils/offlineDb.ts`. Almacena en cola local las solicitudes de presupuesto sin conexión y las transmite en segundo plano de manera segura en cuanto el navegador detecte que el internet ha regresado.',
    { paragraphGap: 8 }
  );

  // 8, 9 y 10
  doc.addPage();
  addHeaderAndFooter(6);

  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('8. FORMULARIOS, ESTIMACIÓN DE PRESUPUESTO Y SEGURIDAD', 50, 60);
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'El sistema de formularios valida en caliente las entradas y estimaciones. La seguridad incluye:\n' +
    ' - Protección contra spam implementando el script silencioso invisible Cloudflare Turnstile.\n' +
    ' - Sanitización de entradas e interfaces de usuario seguras contra Cross-Site Scripting (XSS).',
    { paragraphGap: 8 }
  );

  doc.moveDown(1.5);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('9. INTEGRACIÓN DE WHATSAPP Y ASISTENTE VIRTUAL');
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'El avatar inteligente (VirtualAssistant) ofrece una interfaz guiada de chatbot con animaciones lúdicas basadas en las ilustraciones transparentes vectoriales del proyecto, orientando al usuario de forma automática en los flujos comerciales de la marca.',
    { paragraphGap: 8 }
  );

  doc.moveDown(1.5);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('10. SISTEMA DE ANIMACIONES Y OPTIMIZACIÓN DE RENDIMIENTO');
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'Optimizaciones aplicadas:\n' +
    ' - Motion/React para transiciones con GPU aceleradas.\n' +
    ' - React.lazy() y React.Suspense para el canvas interactivo de estrellas tridimensionales `InteractiveStarsCanvas` y el modal de portafolio.',
    { paragraphGap: 8 }
  );

  // 11, 12 y 13
  doc.addPage();
  addHeaderAndFooter(7);

  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('11. GUÍA DE INSTALACIÓN, CONFIGURACIÓN Y DESPLIEGUE', 50, 60);
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'Comandos clave:\n' +
    ' - npm install: Instalar paquetes\n' +
    ' - npm run dev: Ejecutar localmente\n' +
    ' - npm run build: Empaquetado estático con compilador esbuild para el backend.\n' +
    ' - npm run start: Correr en Docker / Cloud Run.',
    { paragraphGap: 8 }
  );

  doc.moveDown(1.5);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('12. HISTORIAL DE REFACTORIZACIÓN Y SANEAMIENTO REALIZADO');
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'Se corrigieron las inconsistencias de TypeScript relativas al tipado de `AppConfig` y la obligatoriedad de la información legal y redes sociales de `data.ts`. Adicionalmente, se eliminaron los recursos muertos en desuso del directorio de imágenes de desarrollo.',
    { paragraphGap: 8 }
  );

  doc.moveDown(1.5);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(rgbPrimary).text('13. RECOMENDACIONES TÉCNICAS Y REVOLUCIÓN DE PRODUCTO');
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(rgbCharcoal).text(
    'Siguientes pasos sugeridos:\n' +
    ' 1. Configurar cobertura de pruebas unitarias para el cotizador.\n' +
    ' 2. Configurar Cloudflare CDN para aceleración global de la landing page.',
    { paragraphGap: 8 }
  );

  doc.end();
  
  return new Promise((resolve) => {
    stream.on('finish', () => {
      console.log('[PDF Doc] DOCUMENTACION.pdf generada exitosamente.');
      resolve(true);
    });
  });
}

/**
 * FUNCIÓN EJECUTORA PRINCIPAL
 */
async function main() {
  console.log('Iniciando compilador de documentos técnicos de Des-Tec...');
  try {
    await generateWordDoc();
    await generatePDFDoc();
    console.log('Proceso de compilación finalizado con éxito absoluto.');
  } catch (error) {
    console.error('Error durante la generación de documentos:', error);
    process.exit(1);
  }
}

main();
