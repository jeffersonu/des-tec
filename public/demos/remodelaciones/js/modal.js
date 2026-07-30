/**
 * ============================================================
 * ARCHIVO    : js/modal.js
 * DESCRIPCIÓN: Datos de servicios + flip cards con carrusel.
 *
 * ÍCONOS 3D: Cada recuadrito tiene su propio ícono único.
 *            Se usan emojis nativos del sistema operativo
 *            que se ven en 3D/color en todos los dispositivos.
 *
 * CÓMO AGREGAR FOTOS:
 *   fotos: ['img/servicios/foto1.jpg', 'img/servicios/foto2.jpg']
 *   Sin límite de fotos. Recomendado: 800x600 px JPG.
 * ============================================================
 */

const SERVICIOS_DATA = {

  soporte: {
    titulo: 'Soporte y Consultoría',
    descripcion: 'Asesoría profesional para planificar tu remodelación perfecta.',
    gradiente: 'linear-gradient(135deg, #1565c0, #42a5f5)',
    icono: 'fa-headphones',
    trabajos: [
      { etiqueta: 'Asesoría de espacios',    descripcion: 'Diseño y distribución',   emoji: '📐', fotos: [] },
      { etiqueta: 'Selección de materiales', descripcion: 'Guía de productos',        emoji: '🧱', fotos: [] },
      { etiqueta: 'Presupuesto detallado',   descripcion: 'Planificación de costos',  emoji: '📋', fotos: [] },
      { etiqueta: 'Seguimiento de obra',     descripcion: 'Supervisión técnica',      emoji: '🔍', fotos: [] },
      { etiqueta: 'Consulta virtual',        descripcion: 'Atención remota',          emoji: '💻', fotos: [] },
      { etiqueta: 'Soporte post-venta',      descripcion: 'Garantía y soporte',       emoji: '🤝', fotos: [] },
    ],
    incluye: ['Visita técnica gratuita','Cotización sin costo','Asesoría virtual','Plan de trabajo detallado'],
  },

  pintura: {
    titulo: 'Pintura de Apartamentos',
    descripcion: 'Transformamos tu hogar con colores perfectos y acabados de lujo.',
    gradiente: 'linear-gradient(135deg, #1b5e20, #43a047)',
    icono: 'fa-paint-roller',
    trabajos: [
      { etiqueta: 'Sala y comedor',      descripcion: 'Ambiente elegante',      emoji: '🛋️',  fotos: [] },
      { etiqueta: 'Habitaciones',        descripcion: 'Colores personalizados',  emoji: '🛏️',  fotos: ['/img/pintura/pintura3.jpeg','/img/pintura/pintura4.jpeg','/img/pintura/pintura5.jpeg','/img/pintura/pintura6.jpeg',] },
      { etiqueta: 'Cocina',              descripcion: 'Pintura especial',        emoji: '🍳',  fotos: [] },
      { etiqueta: 'Baños',               descripcion: 'Anticorrosiva',           emoji: '🚿',  fotos: [] },
      { etiqueta: 'Fachadas',            descripcion: 'Exterior premium',        emoji: '🏠',  fotos: ['/img/pintura/pintura.jpeg','/img/pintura/pintura1.jpeg','/img/pintura/pintura2.jpeg','/img/pintura/pintura7.jpeg',
        '/img/pintura/pintura8.jpeg','/img/pintura/pintura9.jpeg','/img/pintura/pintura10.jpeg','/img/pintura/pintura11.jpeg',
      ] },
      { etiqueta: 'Efectos decorativos', descripcion: 'Texturas y degradados',   emoji: '🎨',  fotos: [] },
    ],
    incluye: ['Pintura de primera calidad','Preparación de superficies','Protección de muebles','Limpieza post-trabajo'],
  },

  plomeria: {
    titulo: 'Plomería',
    descripcion: 'Instalación y reparación de sistemas hidráulicos con garantía.',
    gradiente: 'linear-gradient(135deg, #0d47a1, #1976d2)',
    icono: 'fa-faucet-drip',
    trabajos: [
      { etiqueta: 'Reparación de fugas',  descripcion: 'Atención urgente',       emoji: '💧', fotos: [] },
      { etiqueta: 'Grifería',             descripcion: 'Todas las marcas',        emoji: '🚰', fotos: [] },
      { etiqueta: 'Tuberías nuevas',      descripcion: 'PVC',             emoji: '🔧', fotos: [] },
      { etiqueta: 'Sanitarios',           descripcion: 'Cambio e instalación',    emoji: '🚽', fotos: [] },
      { etiqueta: 'Calentadores',         descripcion: 'duchas eléctricas',          emoji: '🔥', fotos: [] },
      { etiqueta: 'Alcantarillado',       descripcion: 'Destape y limpieza',      emoji: '🌀', fotos: [] },
    ],
    incluye: ['Diagnóstico gratuito','Materiales garantizados','Atención de urgencias','Garantía 2 meses'],
  },

  electricidad: {
    titulo: 'Electricidad',
    descripcion: 'Instalaciones eléctricas seguras y certificadas para tu hogar.',
    gradiente: 'linear-gradient(135deg, #e65100, #ff9800)',
    icono: 'fa-plug',
    trabajos: [
      { etiqueta: 'Puntos de luz',          descripcion: 'luminaria led',     emoji: '💡', fotos: ['/img/electricidad/luces.jpeg'] },
      { etiqueta: 'Tableros eléctricos',    descripcion: 'Modernización',         emoji: '⚡', fotos: ['/img/electricidad/cuadro-electrico.jpeg'] },
      { etiqueta: 'Toma corrientes',        descripcion: 'Dobles e interructores',         emoji: '🔌', fotos: [] },
      { etiqueta: 'Iluminación LED',        descripcion: 'Ahorro energético',     emoji: '🔆', fotos: [] },
      { etiqueta: 'Circuitos nuevos',       descripcion: 'Certificados',          emoji: '🛡️', fotos: [] },
      { etiqueta: 'Interruptores intelig.', descripcion: 'Domótica',              emoji: '📱', fotos: [] },
    ],
    incluye: ['Revisión eléctrica','Materiales de calidad','Certificado de instalación'],
  },

  cieloraso: {
    titulo: 'Cielo Raso',
    descripcion: 'Cielos rasos modernos que transforman cualquier espacio.',
    gradiente: 'linear-gradient(135deg, #4a148c, #ab47bc)',
    icono: 'fa-people-roof',
    trabajos: [
      { etiqueta: 'Cielo raso liso',       descripcion: 'Acabado premium',        emoji: '🏛️', fotos: [] },
      { etiqueta: 'Diseños con molduras',  descripcion: 'Estilo clásico',          emoji: '🪟', fotos: [] },
      { etiqueta: 'Cielo flotante',        descripcion: 'Moderno y elegante',      emoji: '✨', fotos: [] },
      { etiqueta: 'Iluminación integrada', descripcion: 'Luces empotradas',        emoji: '🔅', fotos: [] },
      { etiqueta: 'PVC decorativo',        descripcion: 'Resistente a humedad',    emoji: '💎', fotos: [] },
      { etiqueta: 'Aislamiento acústico',  descripcion: 'Confort total',           emoji: '🎵', fotos: [] },
    ],
    incluye: ['Medición y diseño','Estructura metálica','Acabado perfecto','Garantía estructural'],
  },

  remodelacion: {
    titulo: 'Remodelación General',
    descripcion: 'Renovación integral de todos los espacios de tu hogar.',
    gradiente: 'linear-gradient(135deg, #006064, #00acc1)',
    icono: 'fa-house-chimney-window',
    trabajos: [
      { etiqueta: 'Renovación de cocinas', descripcion: 'Diseño moderno',          emoji: '🍽️', fotos: [] },
      { etiqueta: 'Baños completos',       descripcion: 'De lujo',                  emoji: '🛁', fotos: [] },
      { etiqueta: 'Pisos y enchapes',      descripcion: 'Cerámica y madera',        emoji: '🪵', fotos: ['/img/enchape/baño.jpeg','/img/enchape/baño2.jpeg','/img/enchape/baño3.jpeg','/img/enchape/baño4.jpeg',
        '/img/enchape/baño5.jpeg','/img/enchape/enchape.jpeg','/img/enchape/piso14.jpeg','/img/enchape/piso15.jpeg','/img/enchape/piso16.jpeg','/img/enchape/piso17.jpeg','/img/enchape/piso18.jpeg',
      ] },
      { etiqueta: 'Paredes y muros',       descripcion: 'Estructural y estético',   emoji: '🧱', fotos: [] },
      { etiqueta: 'Ampliaciones',          descripcion: 'Más espacio para ti',      emoji: '📐', fotos: [] },
      { etiqueta: 'Proyecto integral',     descripcion: 'Todo en uno',              emoji: '🏗️', fotos: [] },
    ],
    incluye: [
      'Remodelación y ampliación de cocina',
      'Cambio de pisos y enchapes',
      'Divisiones en drywall',
      'Instalaciones eléctricas y plomería',
      'Pintura interior y exterior',
      'Cielo raso y acabados en general',
    ],
  },

  soldadura: {
    titulo: 'Soldadura',
    descripcion: 'Trabajos de soldadura profesional para estructuras, rejas, puertas y más.',
    gradiente: 'linear-gradient(135deg, #37474f, #90a4ae)',
    icono: 'fa-fire-flame-curved',
    trabajos: [
      { etiqueta: 'Rejas y portones',      descripcion: 'Seguridad y diseño',     emoji: '🚪', fotos: ['/img/soldadura/bicicletero.jpeg','/img/soldadura/bicicletero2.jpeg','/img/soldadura/escalera-metal.jpeg',
        '/img/soldadura/escalera-metal2.jpeg','/img/soldadura/porton.jpeg','/img/soldadura/porton2.jpeg','/img/soldadura/puerta.jpeg'
      ] },
      { etiqueta: 'Estructuras metálicas', descripcion: 'Soporte y resistencia',  emoji: '🏗️', fotos: ['/img/soldadura/techo1.jpeg','/img/soldadura/techo2.jpeg','/img/soldadura/techo3.jpeg','/img/soldadura/techo4.jpeg',
        '/img/soldadura/techo5.jpeg','/img/soldadura/techo6.jpeg','/img/soldadura/techo7.jpeg','/img/soldadura/techo8.jpeg','/img/soldadura/techo9.jpeg','/img/soldadura/techo10.jpeg','/img/soldadura/techo11.jpeg',
      ] },
      { etiqueta: 'Puertas en hierro',     descripcion: 'A medida',               emoji: '🔐', fotos: ['/img/soldadura/porton.jpeg','/img/soldadura/porton2.jpeg','/img/soldadura/puerta.jpeg'] },
      { etiqueta: 'Escaleras metálicas',   descripcion: 'Interiores y exteriores',emoji: '🪜', fotos: [] },
      { etiqueta: 'Reparaciones',          descripcion: 'Soldadura y refuerzo',   emoji: '🔩', fotos: ['/img/soldadura/arreglo-estructura.jpeg','/img/soldadura/arreglo-estructura1.jpeg','/img/soldadura/arreglo-estructura2.jpeg'] },
      { etiqueta: 'Cerramientos',          descripcion: 'Perfiles y tubería',      emoji: '⛓️', fotos: [] },
    ],
    incluye: ['Soldadura MIG y eléctrica','Fabricación a medida','Pintura anticorrosiva incluida','Instalación en sitio'],
  },

  impermeabilizacion: {
    titulo: 'Impermeabilización y Techos',
    descripcion: 'Protegemos tu hogar de filtraciones, humedad y goteras con garantía.',
    gradiente: 'linear-gradient(135deg, #01579b, #0288d1)',
    icono: 'fa-droplet-slash',
    trabajos: [
      { etiqueta: 'Terrazas y losas',       descripcion: 'Membrana y manto',         emoji: '🏢', fotos: [] },
      { etiqueta: 'Cubiertas en teja',      descripcion: 'Cambio y reparación',      emoji: '🏠', fotos: ['/img/impermeabilizacion y techos/estructur techo.jpeg','/img/impermeabilizacion y techos/techo-transparente.jpeg','/img/impermeabilizacion y techos/techo.jpeg'] },
      { etiqueta: 'Goteras urgentes',       descripcion: 'Atención rápida',          emoji: '⛈️', fotos: [] },
      { etiqueta: 'Cubiertas metálicas',    descripcion: 'Lámina y panel',            emoji: '🔩', fotos: [] },
    ],
    incluye: ['Diagnóstico de filtraciones gratis','Manto asfáltico y membranas','Cambio completo de teja','6 meses de garantia'],
  },

  enchape: {
    titulo: 'Enchape',
    descripcion: 'Instalación de baldosas, cerámicas y revestimientos con acabados perfectos.',
    gradiente: 'linear-gradient(135deg, #bf360c, #ff7043)',
    icono: 'fa-border-all',
    trabajos: [
      { etiqueta: 'Pisos en cerámica',     descripcion: 'Interior y exterior',    emoji: '🟫', fotos: ['/img/enchape/piso14.jpeg','/img/enchape/piso15.jpeg','/img/enchape/piso16.jpeg','/img/enchape/piso17.jpeg','/img/enchape/piso18.jpeg',] },
      { etiqueta: 'Enchape de baños',      descripcion: 'Pared y piso completo',  emoji: '🚿', fotos: ['/img/enchape/baño.jpeg','/img/enchape/baño2.jpeg','/img/enchape/baño3.jpeg','/img/enchape/baño4.jpeg','/img/enchape/baño5.jpeg',] },
      { etiqueta: 'Enchape de cocinas',    descripcion: 'Mesones y paredes',      emoji: '🍳', fotos: ['/img/enchape/enchape.jpeg'] },
      { etiqueta: 'Porcelanato',           descripcion: 'Alto tráfico y lujo',    emoji: '✨', fotos: [] },
      { etiqueta: 'Mosaicos decorativos',  descripcion: 'Diseños exclusivos',     emoji: '🎨', fotos: [] },
      { etiqueta: 'Reparación de enchape', descripcion: 'Cambio de piezas',       emoji: '🔧', fotos: [] },
    ],
    incluye: [
      'Preparación de superficie',
      'Fraguado y nivelación',
      'Cerámica, porcelanato y mosaico',
      'Garantía en mano de obra',
    ],
  },

};


/* ============================================================
  VOLTEAR CARTA (frente → reverso)
============================================================ */
function voltearCarta(card) {
  if (card.classList.contains('volteada')) return;
  card.classList.add('volteada');

  /* Fijar ancho exacto en px al voltear para que el carrusel
     no quede a mitad de foto. Doble rAF para esperar render. */
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      var carrusel = card.querySelector('.flip-carrusel');
      if (!carrusel) return;
      var anchoPx = carrusel.getBoundingClientRect().width;
      if (!anchoPx) return;
      carrusel.querySelectorAll('.flip-slide').forEach(function(s) {
        s.style.minWidth = anchoPx + 'px';
        s.style.width    = anchoPx + 'px';
      });
    });
  });
}

/* ============================================================
  VOLVER AL FRENTE (reverso → frente)
============================================================ */
function voltearDeVuelta(ev, boton) {
  ev.stopPropagation();
  var card = boton.closest('.flip-card');
  if (card) card.classList.remove('volteada');
}

/* ============================================================
  MOVER CARRUSEL  +1 siguiente / -1 anterior
============================================================ */
function moverCarrusel(ev, id, dir) {
  ev.stopPropagation();
  var wrap = document.getElementById(id);
  if (!wrap) return;
  var pista  = wrap.querySelector('.flip-pista');
  var slides = wrap.querySelectorAll('.flip-slide');
  var total  = slides.length;
  if (total <= 1) return;

  var actual = parseInt(pista.getAttribute('data-idx') || '0', 10) + dir;
  if (actual < 0)      actual = 0;
  if (actual >= total) actual = total - 1;

  /* Medir el ancho real en px en este momento */
  var anchoPx = wrap.getBoundingClientRect().width;
  slides.forEach(function(s) {
    s.style.minWidth = anchoPx + 'px';
    s.style.width    = anchoPx + 'px';
  });
  pista.style.transform = 'translateX(-' + (actual * anchoPx) + 'px)';
  pista.setAttribute('data-idx', actual);

  /* Contador y botones */
  var barra = wrap.closest('.flip-reverso').querySelector('.flip-barra');
  if (!barra) return;
  var ctr = barra.querySelector('.flip-contador');
  if (ctr) ctr.textContent = (actual + 1) + ' / ' + total;
  var prev = barra.querySelector('.flip-prev');
  var next = barra.querySelector('.flip-next');
  if (prev) prev.disabled = (actual === 0);
  if (next) next.disabled = (actual === total - 1);
}

/* ============================================================
  CONSTRUIR UNA FLIP-CARD
============================================================ */
function construirCard(trabajo, servicio, idx) {
  var tieneFotos = trabajo.fotos && trabajo.fotos.length > 0;
  var total      = tieneFotos ? trabajo.fotos.length : 0;
  var cid        = 'cr-' + idx + '-' + Math.random().toString(36).slice(2,6);
  var labelHint  = tieneFotos
    ? 'Ver ' + total + ' foto' + (total > 1 ? 's' : '')
    : 'Próximamente';

  /* ── FRENTE con emoji 3D ── */
  var frente = ''
    + '<div class="flip-frente">'
    +   '<div class="flip-fondo" style="background:' + servicio.gradiente + ';position:absolute;inset:0;"></div>'
    +   '<div class="fc-inner">'
    +     '<span class="fc-emoji">' + trabajo.emoji + '</span>'
    +     '<strong class="fc-titulo">' + trabajo.etiqueta + '</strong>'
    +     '<small  class="fc-sub">'   + trabajo.descripcion + '</small>'
    +   '</div>'
    +   '<div class="flip-hint">'
    +     '<i class="fa-solid fa-images"></i>'
    +     '<span>' + labelHint + '</span>'
    +   '</div>'
    + '</div>';

  /* ── REVERSO ── */
  var reversoInner;
  if (tieneFotos) {
    var slides = trabajo.fotos.map(function(ruta, i) {
      return '<div class="flip-slide">'
        + '<img src="' + ruta + '" alt="' + trabajo.etiqueta + ' foto ' + (i+1) + '" loading="lazy" '
        + 'style="width:100%;height:100%;object-fit:cover;display:block;" '
        + 'onerror="this.style.display=\'none\'">'
        + '</div>';
    }).join('');
    var dis = total <= 1 ? ' disabled' : '';
    reversoInner = ''
      + '<div class="flip-carrusel" id="' + cid + '">'
      +   '<div class="flip-pista" data-idx="0" style="display:flex;height:100%;transition:transform .38s ease;will-change:transform;">'
      +     slides
      +   '</div>'
      + '</div>'
      + '<div class="flip-barra">'
      +   '<span class="flip-barra-titulo">' + trabajo.etiqueta + '</span>'
      +   '<div class="flip-controles">'
      +     '<button class="flip-btn-nav flip-prev"' + dis + ' onclick="moverCarrusel(event,\'' + cid + '\',-1)" aria-label="Anterior"><i class="fa-solid fa-chevron-left"></i></button>'
      +     '<span class="flip-contador">1 / ' + total + '</span>'
      +     '<button class="flip-btn-nav flip-next"' + dis + ' onclick="moverCarrusel(event,\'' + cid + '\',1)" aria-label="Siguiente"><i class="fa-solid fa-chevron-right"></i></button>'
      +     '<button class="flip-volver" onclick="voltearDeVuelta(event,this)" aria-label="Volver"><i class="fa-solid fa-rotate-left"></i></button>'
      +   '</div>'
      + '</div>';
  } else {
    reversoInner = ''
      + '<div class="flip-sin-fotos">'
      +   '<span style="font-size:3.5rem;">' + trabajo.emoji + '</span>'
      +   '<p><strong>' + trabajo.etiqueta + '</strong></p>'
      +   '<span>Fotos próximamente</span>'
      + '</div>'
      + '<div class="flip-barra">'
      +   '<span class="flip-barra-titulo">' + trabajo.etiqueta + '</span>'
      +   '<div class="flip-controles">'
      +     '<button class="flip-volver" onclick="voltearDeVuelta(event,this)" aria-label="Volver"><i class="fa-solid fa-rotate-left"></i></button>'
      +   '</div>'
      + '</div>';
  }

  return ''
    + '<div class="galeria-item flip-card" onclick="voltearCarta(this)" tabindex="0" role="button"'
    +   ' aria-label="Ver fotos de ' + trabajo.etiqueta + '"'
    +   ' onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();voltearCarta(this);}">'
    +   '<div class="flip-interior">'
    +     frente
    +     '<div class="flip-reverso">' + reversoInner + '</div>'
    +   '</div>'
    + '</div>';
}

/* ============================================================
  GENERAR HTML COMPLETO DEL MODAL
============================================================ */
function generarHTMLModal(clave) {
  var s = SERVICIOS_DATA[clave];
  var galeria = s.trabajos.map(function(t,i){ return construirCard(t,s,i); }).join('');
  var incluye = s.incluye.map(function(item){
    return '<div class="incluye-item"><i class="fa-solid fa-circle-check"></i> ' + item + '</div>';
  }).join('');
  return ''
    + '<div class="modal-cabecera">'
    +   '<div class="modal-cabecera-info"><h2 id="modal-titulo">' + s.titulo + '</h2><p>' + s.descripcion + '</p></div>'
    +   '<button class="btn-cerrar" onclick="cerrarModal()" aria-label="Cerrar">✕</button>'
    + '</div>'
    + '<p class="modal-flip-aviso"><i class="fa-solid fa-hand-pointer"></i> Toca cada recuadro para ver las fotos</p>'
    + '<div class="modal-galeria">' + galeria + '</div>'
    + '<div class="modal-info"><h3>¿Qué incluye este servicio?</h3><div class="incluye-grid">' + incluye + '</div></div>'
    + '<div class="modal-cta">'
    +   '<button class="btn-modal-primario" onclick="cerrarModal();document.getElementById(\'contacto\').scrollIntoView({behavior:\'smooth\'});">Solicitar cotización →</button>'
    +   '<button class="btn-modal-secundario" onclick="cerrarModal()">Cerrar</button>'
    + '</div>';
}

/* ============================================================
  ABRIR / CERRAR MODAL
============================================================ */
function abrirModal(clave) {
  var overlay    = document.getElementById('modal-overlay');
  var contenedor = document.getElementById('modal-contenido');
  contenedor.innerHTML = generarHTMLModal(clave);
  overlay.classList.add('activo');
  document.body.style.overflow = 'hidden';
}
function cerrarModal() {
  document.getElementById('modal-overlay').classList.remove('activo');
  document.body.style.overflow = '';
}

/* ============================================================
  EVENTOS AL CARGAR
============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) cerrarModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') cerrarModal();
  });
  document.querySelectorAll('.servicio-card').forEach(function(t) {
    t.addEventListener('click', function() {
      var k = this.getAttribute('data-servicio');
      if (k && SERVICIOS_DATA[k]) abrirModal(k);
    });
    t.addEventListener('keydown', function(e) {
      if (e.key==='Enter'||e.key===' ') {
        e.preventDefault();
        var k = this.getAttribute('data-servicio');
        if (k && SERVICIOS_DATA[k]) abrirModal(k);
      }
    });
  });
});
