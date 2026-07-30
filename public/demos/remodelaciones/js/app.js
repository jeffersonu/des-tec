/**
 * ============================================================
 * ARCHIVO    : js/app.js
 * DESCRIPCIÓN: Lógica general de la página web.
 *              - Año automático en el footer
 *              - Menú hamburguesa para móvil
 *              - Scroll suave al hacer clic en links del menú
 *              - Efecto de scroll en la navbar
 *              - Envío de formularios via Web3Forms (sin PHP)
 *
 * 
 * ============================================================
 */


document.addEventListener('DOMContentLoaded', function () {


  /* ----------------------------------------------------------
    1. AÑO AUTOMÁTICO EN EL FOOTER
  ---------------------------------------------------------- */
  const elementoAnio = document.getElementById('anio-actual');
  if (elementoAnio) {
    elementoAnio.textContent = new Date().getFullYear();
  }


  /* ----------------------------------------------------------
    2. MENÚ HAMBURGUESA (MÓVIL)
  ---------------------------------------------------------- */
  const botonHamburguesa = document.getElementById('hamburguesa');
  const listaNavLinks    = document.querySelector('.nav-links');

  if (botonHamburguesa && listaNavLinks) {
    botonHamburguesa.addEventListener('click', function () {
      botonHamburguesa.classList.toggle('activo');
      listaNavLinks.classList.toggle('menu-abierto');
    });

    listaNavLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        botonHamburguesa.classList.remove('activo');
        listaNavLinks.classList.remove('menu-abierto');
      });
    });
  }


  /* ----------------------------------------------------------
    3. EFECTO SCROLL EN LA NAVBAR
  ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
    });
  }


  /* ----------------------------------------------------------
    4. SCROLL SUAVE A LAS SECCIONES
    IDs correctos en el HTML:
      #inicio    → <header id="inicio">
      #nosotros  → <section id="nosotros">
      #servicios → <section id="servicios">
      #contacto  → <section id="contacto">
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const destino = document.querySelector(href);
      if (!destino) return;

      e.preventDefault();

      const alturaNavbar    = navbar ? navbar.offsetHeight : 70;
      const posicionDestino = destino.getBoundingClientRect().top + window.scrollY - alturaNavbar;

      window.scrollTo({ top: posicionDestino, behavior: 'smooth' });
    });
  });


  /* ----------------------------------------------------------
    5. FORMULARIO DEL HERO — WEB3FORMS
    Envía los datos a la API de Web3Forms via fetch (AJAX).
    El usuario NO es redirigido a otra página.
    La respuesta llega como JSON: { success: true/false }

    RECUERDA: reemplaza YOUR_ACCESS_KEY_HERE en index.html
              con tu clave real de web3forms.com
  ---------------------------------------------------------- */
  const formularioHero = document.getElementById('form-hero');

  if (formularioHero) {
    formularioHero.addEventListener('submit', function (e) {
      e.preventDefault();

      const boton = document.getElementById('btn-hero-submit');
      if (boton) {
        boton.textContent = 'Enviando...';
        boton.disabled = true;
      }

      const datos = new FormData(this);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: datos,
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            mostrarNotificacion('✓ ¡Cita agendada! Te contactaremos pronto.');
            formularioHero.reset();
          } else {
            mostrarNotificacion('⚠ Error al enviar. Verifica tu clave Web3Forms.');
          }
        })
        .catch(function () {
          mostrarNotificacion('⚠ Error de red. Intenta de nuevo.');
        })
        .finally(function () {
          if (boton) {
            boton.textContent = 'Solicitar cita →';
            boton.disabled = false;
          }
        });
    });
  }


  /* ----------------------------------------------------------
    6. FORMULARIO DE CONTACTO — WEB3FORMS
    Misma lógica que el formulario del hero.
    El botón se desactiva mientras envía para evitar doble envío.
  ---------------------------------------------------------- */
  const formularioContacto = document.getElementById('form-contacto');

  if (formularioContacto) {
    formularioContacto.addEventListener('submit', function (e) {
      e.preventDefault();

      const boton = formularioContacto.querySelector('button[type="submit"]');
      if (boton) {
        boton.textContent = 'Enviando...';
        boton.disabled = true;
      }

      const datos = new FormData(this);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: datos,
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            mostrarNotificacion('✓ ¡Mensaje enviado! Te contactaremos pronto.');
            formularioContacto.reset();
          } else {
            mostrarNotificacion('⚠ Error al enviar. Verifica tu clave Web3Forms.');
          }
        })
        .catch(function () {
          mostrarNotificacion('⚠ Error de red. Intenta de nuevo.');
        })
        .finally(function () {
          if (boton) {
            boton.textContent = 'Enviar mensaje →';
            boton.disabled = false;
          }
        });
    });
  }


}); // FIN DOMContentLoaded


/* ============================================================
  FUNCIÓN GLOBAL: MOSTRAR NOTIFICACIÓN
  Muestra el cartel verde en la esquina inferior derecha.
  Se puede llamar desde cualquier archivo JS.
  Uso: mostrarNotificacion('Tu mensaje aquí');
============================================================ */
function mostrarNotificacion(mensaje) {
  const notificacion = document.getElementById('notificacion');
  if (!notificacion) return;

  const span = notificacion.querySelector('span');
  if (span && mensaje) span.textContent = mensaje;

  notificacion.classList.add('visible');

  setTimeout(function () {
    notificacion.classList.remove('visible');
  }, 5000);
}
