/* =============================================
   COLOMBIA 5.0 — SITIO WEB ACADÉMICO SENA
   script.js — Interactividad y funcionalidad
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  iniciarParticulas();
  iniciarNavbar();
  iniciarScrollSuave();
  iniciarContadores();
  iniciarBotonArriba();
  iniciarAnimacionesScroll();
  iniciarHamburger();
  iniciarLightbox();
});

/* =============================================
   PARTÍCULAS EN EL HERO
   ============================================= */
function iniciarParticulas() {
  const contenedor = document.getElementById('particles');
  if (!contenedor) return;

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('span');
    p.classList.add('particle');
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${1 + Math.random() * 3}px;
      height: ${1 + Math.random() * 3}px;
      opacity: ${0.3 + Math.random() * 0.7};
      animation-duration: ${8 + Math.random() * 12}s;
      animation-delay: ${-(Math.random() * 20)}s;
    `;
    contenedor.appendChild(p);
  }
}

/* =============================================
   NAVBAR — scroll activo + enlace activo
   ============================================= */
function iniciarNavbar() {
  const navbar    = document.getElementById('navbar');
  const enlaces   = document.querySelectorAll('.nav-link');
  const secciones = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    let actual = '';
    secciones.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) actual = sec.getAttribute('id');
    });

    enlaces.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${actual}`) link.classList.add('active');
    });
  }, { passive: true });
}

/* =============================================
   MENÚ HAMBURGUESA
   ============================================= */
function iniciarHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

/* =============================================
   SCROLL SUAVE
   ============================================= */
function iniciarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.addEventListener('click', e => {
      e.preventDefault();
      const destino = document.querySelector(enlace.getAttribute('href'));
      if (!destino) return;
      window.scrollTo({
        top: destino.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    });
  });
}

/* =============================================
   CONTADORES ANIMADOS
   ============================================= */
function iniciarContadores() {
  const contadores = document.querySelectorAll('.stat-number[data-target]');
  if (!contadores.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarContador(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  contadores.forEach(c => observer.observe(c));
}

function animarContador(el) {
  const objetivo = parseInt(el.dataset.target, 10);
  const inicio   = performance.now();

  function actualizar(ahora) {
    const progreso = Math.min((ahora - inicio) / 1800, 1);
    const suavizado = 1 - Math.pow(1 - progreso, 3);
    const actual    = Math.round(suavizado * objetivo);
    el.textContent  = actual >= 1000 ? actual.toLocaleString('es-CO') : actual;
    if (progreso < 1) requestAnimationFrame(actualizar);
  }
  requestAnimationFrame(actualizar);
}

/* =============================================
   BÚSQUEDA EN EL GLOSARIO — filtra ambas tablas
   ============================================= */
function filtrarGlosario() {
  const filtro = document.getElementById('glossarySearch').value.toLowerCase().trim();

  ['glossaryTable1', 'glossaryTable2'].forEach(id => {
    document.querySelectorAll(`#${id} tbody tr`).forEach(fila => {
      fila.classList.toggle('hidden-row', !fila.textContent.toLowerCase().includes(filtro));
    });
  });

  const visibles     = document.querySelectorAll('#glossaryTable1 tbody tr:not(.hidden-row), #glossaryTable2 tbody tr:not(.hidden-row)');
  let sinResultado   = document.getElementById('glosarioSinResultado');

  if (visibles.length === 0 && filtro !== '') {
    if (!sinResultado) {
      const cuerpo      = document.querySelector('#glossaryTable2 tbody');
      sinResultado      = document.createElement('tr');
      sinResultado.id   = 'glosarioSinResultado';
      sinResultado.innerHTML = `
        <td colspan="4" style="text-align:center;color:var(--text-muted);padding:2rem;font-family:var(--font-mono);">
          <i class="fa-solid fa-magnifying-glass" style="margin-right:8px;"></i>
          No se encontraron resultados para "<span style="color:var(--accent)">${escaparHtml(filtro)}</span>"
        </td>`;
      cuerpo.appendChild(sinResultado);
    }
  } else {
    sinResultado && sinResultado.remove();
  }
}

function escaparHtml(texto) {
  return texto.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

window.filtrarGlosario = filtrarGlosario;

/* =============================================
   BOTÓN VOLVER ARRIBA
   ============================================= */
function iniciarBotonArriba() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* =============================================
   ANIMACIONES DE ENTRADA AL HACER SCROLL
   ============================================= */
function iniciarAnimacionesScroll() {
  const estilo = document.createElement('style');
  estilo.textContent = `
    .anim-entrada { opacity:0; transform:translateY(30px); transition:opacity .6s ease,transform .6s ease; }
    .anim-entrada.visible { opacity:1; transform:translateY(0); }
  `;
  document.head.appendChild(estilo);

  const elementos = document.querySelectorAll(
    '.conference-card,.topic-card,.gallery-item,.stat-card,.quote-card,.ethics-pillars,.conf-photo-item'
  );
  elementos.forEach(el => el.classList.add('anim-entrada'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 80 * (i % 6));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elementos.forEach(el => observer.observe(el));
}

/* =============================================
   LIGHTBOX — Galería y fotos de conferencias
   ============================================= */
function iniciarLightbox() {
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,0.95); align-items:center;
    justify-content:center; cursor:zoom-out; padding:2rem;
  `;

  const imgLightbox = document.createElement('img');
  imgLightbox.style.cssText = `
    max-width:90vw; max-height:85vh; object-fit:contain;
    border-radius:8px; border:1px solid rgba(0,212,255,0.3);
    box-shadow:0 0 60px rgba(0,212,255,0.2); display:block;
  `;

  const pie = document.createElement('p');
  pie.style.cssText = `
    position:absolute; bottom:1.5rem; left:50%; transform:translateX(-50%);
    color:var(--accent,#00d4ff); font-family:'Source Code Pro',monospace;
    font-size:.85rem; letter-spacing:1.5px; background:rgba(0,0,0,0.85);
    padding:.4rem 1.2rem; border-radius:20px; white-space:nowrap;
  `;

  const btnCerrar = document.createElement('button');
  btnCerrar.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  btnCerrar.style.cssText = `
    position:absolute; top:1.5rem; right:1.5rem;
    background:rgba(0,212,255,0.15); border:1px solid rgba(0,212,255,0.3);
    color:#00d4ff; width:42px; height:42px; border-radius:8px;
    font-size:1.2rem; cursor:pointer; display:flex;
    align-items:center; justify-content:center;
  `;

  lightbox.appendChild(imgLightbox);
  lightbox.appendChild(pie);
  lightbox.appendChild(btnCerrar);
  document.body.appendChild(lightbox);

  document.querySelectorAll('.gallery-item, .conf-photo-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-overlay span, .photo-caption');
      imgLightbox.src = img.src;
      imgLightbox.alt = img.alt;
      pie.textContent = cap ? cap.textContent : '';
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  const cerrar = () => { lightbox.style.display = 'none'; document.body.style.overflow = ''; };
  lightbox.addEventListener('click', cerrar);
  btnCerrar.addEventListener('click', e => { e.stopPropagation(); cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });
}

/* =============================================
   CONSOLA
   ============================================= */
console.log(
  '%cCOLOMBIA 5.0\n%cSitio Web Académico — SENA 2026\nHTML5 · CSS3 · JavaScript',
  'color:#00d4ff;font-size:2rem;font-weight:bold;font-family:monospace;',
  'color:#8ba3c1;font-size:.9rem;font-family:monospace;'
);
