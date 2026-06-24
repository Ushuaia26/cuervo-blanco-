// ============================================
//  CUERVO BLANCO — Lógica horaria
// ============================================

// ── FERIADOS 2025 / 2026 Argentina ──────────
const FERIADOS = [
  // 2025
  "2025-01-01", "2025-03-03", "2025-03-04", "2025-03-24",
  "2025-04-02", "2025-04-17", "2025-04-18", "2025-05-01",
  "2025-05-25", "2025-06-16", "2025-06-20", "2025-07-09",
  "2025-08-17", "2025-10-12", "2025-11-20", "2025-12-08",
  "2025-12-25",
  // 2026
  "2026-01-01", "2026-02-16", "2026-02-17", "2026-03-24",
  "2026-04-02", "2026-04-03", "2026-04-06", "2026-05-01",
  "2026-05-25", "2026-06-15", "2026-06-20", "2026-07-09",
  "2026-08-17", "2026-10-12", "2026-11-20", "2026-12-08",
  "2026-12-25"
];

// ── CONFIGURACIÓN POR TURNO ──────────────────
const ASSETS = {
  manana:    { mostrarPrincipal: false, video: "video-cafe"     },
  ejecutivo: { mostrarPrincipal: true,  video: "video-mediodia" },
  carta:     { mostrarPrincipal: true,  video: "video-mediodia" },
  tarde:     { mostrarPrincipal: false, video: "video-cafe"     },
  cena:      { mostrarPrincipal: true,  video: "video-cena"     },
};

// ── ÍCONOS DEL ACORDEÓN POR TURNO ───────────
const ICONOS = {
  manana:    { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  ejecutivo: { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  carta:     { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  tarde:     { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  cena:      { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
};

// ── PALETA DE COLORES POR TURNO ──────────────
const PALETAS = {
  manana: {
    '--color-principal': '#0d1a0a',
    '--color-traslucer': '#1e2e1a86',
    '--color-primary':   '#22391789',
    '--color-secundary': '#8aab7a',
    '--color-hover':     '#4a6741',
  },
  tarde: {
    '--color-principal': '#0d1a0a',
    '--color-traslucer': '#1e2e1a86',
    '--color-primary':   '#22391789',
    '--color-secundary': '#8aab7a',
    '--color-hover':     '#4a6741',
  },
  ejecutivo: {
    '--color-principal': '#050000',
    '--color-traslucer': '#2e2d2d86',
    '--color-primary':   '#22391789',
    '--color-secundary': '#a5a5a5',
    '--color-hover':     'rgb(193, 199, 199)',
  },
  carta: {
    '--color-principal': '#050000',
    '--color-traslucer': '#2e2d2d86',
    '--color-primary':   '#22391789',
    '--color-secundary': '#a5a5a5',
    '--color-hover':     'rgb(138, 136, 136)',
  },
  cena: {
    '--color-principal': '#050000',
    '--color-traslucer': '#2e2d2d86',
    '--color-primary':   '#22391789',
    '--color-secundary': '#a5a5a5',
    '--color-hover':     'rgb(139, 137, 137)',
  },
};

// ── SCROLL AUTOMÁTICO POR TURNO ──────────────
const MAPA_SECCIONES = {
  manana:    "cafe-section",
  ejecutivo: "ejecutivo-section",
  carta:     "almuerzo-section",
  tarde:     "cafe-section",
  cena:      "almuerzo-section",
};

// ── HELPER: fecha como string "YYYY-MM-DD" ──
function fechaStr(d) {
  return d.toISOString().slice(0, 10);
}

// ── HELPER: hora como número decimal ────────
function horaDecimal(d) {
  return d.getHours() + d.getMinutes() / 60;
}

// ── DETECTAR TURNO ACTUAL ────────────────────
function getTurno() {
  const ahora         = new Date();
  const hora          = horaDecimal(ahora);
  const diaSemana     = ahora.getDay();
  const esFeriado     = FERIADOS.includes(fechaStr(ahora));
  const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
  const esViernes     = diaSemana === 5;

  if (hora >= 6  && hora < 12) return "manana";
  if (hora >= 12 && hora < 16) return (esFinDeSemana || esViernes || esFeriado) ? "carta" : "ejecutivo";
  if (hora >= 16 && hora < 20) return "tarde";
  return "cena";
}

// ── APLICAR TURNO ────────────────────────────
function aplicarTurno() {
  const turno  = getTurno();
  const assets = ASSETS[turno];
  const iconos = ICONOS[turno];

  // 1. Videos
  const todosLosVideos = ["video-cafe", "video-mediodia", "video-cena"];
  todosLosVideos.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("activo");
    el.pause();
  });
  const videoActivo = document.getElementById(assets.video);
  if (videoActivo) {
    videoActivo.classList.add("activo");
    videoActivo.play().catch(() => {});
  }

  // 2. Logos splash
  const divPrincipal = document.getElementById("logo-principal")?.closest(".splash__logo");
  const divCafe      = document.getElementById("logo-cafe")?.closest(".splash__logo");
  if (divPrincipal) divPrincipal.style.display = assets.mostrarPrincipal ? "block" : "none";
  if (divCafe)      divCafe.style.display      = assets.mostrarPrincipal ? "none"  : "block";

  // 3. Logos nav
  const logoNavPrincipal = document.getElementById("logo-nav-principal");
  const logoNavCafe      = document.getElementById("logo-nav-cafe");
  if (logoNavPrincipal) logoNavPrincipal.style.display = assets.mostrarPrincipal ? "block" : "none";
  if (logoNavCafe)      logoNavCafe.style.display      = assets.mostrarPrincipal ? "none"  : "block";

  // 4. Íconos del acordeón
  const items = document.querySelectorAll(".splash__acordeon-item");
  const claves = ["cafe", "ejecutivo", "carta", "bebidas"];
  items.forEach((item, i) => {
    const icono = item.querySelector("i");
    if (!icono || !claves[i]) return;
    icono.className = icono.className.replace(/ti-[^\s]+/, iconos[claves[i]]);
  });

  // 5. Highlight ítem activo
  items.forEach(item => item.classList.remove("activo", "proxima"));
  const mapaItem = { manana: 0, ejecutivo: 1, carta: 2, tarde: 0, cena: 2 };
  if (items[mapaItem[turno]]) items[mapaItem[turno]].classList.add("activo");

  // 6. Paleta de colores
  const paleta = PALETAS[turno];
  Object.entries(paleta).forEach(([variable, valor]) => {
    document.documentElement.style.setProperty(variable, valor);
  });

  // 7. Scroll automático a la sección
  const seccionId = MAPA_SECCIONES[turno];
  const seccion   = document.getElementById(seccionId);
  if (seccion) seccion.scrollIntoView({ behavior: "smooth" });

  // Log
  console.log(`[Cuervo Blanco] Turno activo: ${turno} | ${new Date().toLocaleTimeString("es-AR")}`);
}

// ── INIT ─────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  // Acordeones: cerrar al abrir otro
  const toggles = document.querySelectorAll(".checkbox__submenu");
  toggles.forEach(toggle => {
    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        toggles.forEach(otro => {
          if (otro !== toggle) otro.checked = false;
        });
      }
    });
  });

  // Aplicar turno inicial
  aplicarTurno();
  setInterval(aplicarTurno, 60 * 1000);

  // Observer carrusel: activar categoría al hacer scroll
  const secciones = document.querySelectorAll('.carta-box[id], .carta-grid[id]');
  const cards = document.querySelectorAll('.categoria-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        cards.forEach(c => c.classList.remove('active'));
        const cardActiva = document.querySelector(`.categoria-card[href="#${id}"]`);
        if (cardActiva) {
          cardActiva.classList.add('active');
          cardActiva.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    });
  }, { threshold: 0.3 });

  secciones.forEach(s => observer.observe(s));
});


/* ---- BOTONES CARRUSEL CATEGORIAS ---- */
const carrusel = document.querySelector('.categorias-carrusel');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

btnNext.addEventListener('click', () => {
    carrusel.scrollBy({ left: 150, behavior: 'smooth' });
});

btnPrev.addEventListener('click', () => {
    carrusel.scrollBy({ left: -150, behavior: 'smooth' });
});

/* ---- DOTS CARRUSEL CATEGORIAS ---- */
/*const dotsContainer = document.getElementById('dots-carrucel');
const dotCards = document.querySelectorAll('.categoria-card');
const cardWidth = 150;

dotCards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('activo');
    dot.addEventListener('click', () => {
        carrusel.scrollTo({ left: cardWidth * i, behavior: 'smooth' });
    });
    dotsContainer.appendChild(dot);
});

carrusel.addEventListener('scroll', () => {
    const index = Math.round(carrusel.scrollLeft / cardWidth);
    document.querySelectorAll('.carrusel-dots .dot').forEach((d, i) => {
        d.classList.toggle('activo', i === index);
    });
});*/

// Slider de eventos
const sliderTrack = document.getElementById('slider-track');
const sliderDots = document.querySelectorAll('.slider-dot');
let sliderCurrent = 0;
const sliderTotal = document.querySelectorAll('.slider-slide').length;

function goToSlide(index) {
    sliderCurrent = index;
    sliderTrack.style.transform = `translateX(-${sliderCurrent * 100}%)`;
    sliderDots.forEach((d, i) => d.classList.toggle('active', i === sliderCurrent));
}

document.getElementById('slider-prev')?.addEventListener('click', () => {
    goToSlide(sliderCurrent === 0 ? sliderTotal - 1 : sliderCurrent - 1);
});

document.getElementById('slider-next')?.addEventListener('click', () => {
    goToSlide(sliderCurrent === sliderTotal - 1 ? 0 : sliderCurrent + 1);
});

sliderDots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));


// Modal eventos privados
function abrirModal(tipo) {
    document.getElementById('form-tipo').value = tipo;
    document.getElementById('modal-tipo').textContent = tipo;
    document.getElementById('modal-overlay').classList.add('activo');
}

function cerrarModal() {
    document.getElementById('modal-overlay').classList.remove('activo');
}

function enviarConsulta() {
    const tipo    = document.getElementById('form-tipo').value;
    const nombre  = document.getElementById('form-nombre').value;
    const fecha   = document.getElementById('form-fecha').value;
    const adultos = document.getElementById('form-adultos').value || '0';
    const ninos   = document.getElementById('form-ninos').value || '0';

    if (!nombre || !fecha) {
        alert('Por favor completá tu nombre y la fecha del evento.');
        return;
    }

    const msg = `Hola! Quiero consultar presupuesto para un evento de ${tipo}. Nombre: ${nombre}. Fecha: ${fecha}. Adultos: ${adultos}. Niños: ${ninos}.`;
    const url = `https://api.whatsapp.com/send?phone=543413742910&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    cerrarModal();
}


//catering
function abrirModalCatering(tipo) {
    document.getElementById('form-tipo').value = tipo + ' (Catering)';
    document.getElementById('modal-tipo').textContent = tipo + ' · Catering';
    document.getElementById('modal-overlay').classList.add('activo');
}

let cateringTipoActual = '';
let cateringPaqueteActual = '';

function abrirModalCatering(tipo) {
    cateringTipoActual = tipo;
    document.getElementById('modal-catering-tipo').textContent = tipo;
    document.getElementById('catering-form-tipo').value = tipo;
    document.getElementById('catering-paso1').style.display = 'block';
    document.getElementById('catering-paso2').style.display = 'none';
    document.getElementById('modal-catering-overlay').classList.add('activo');
}

function cerrarModalCatering() {
    document.getElementById('modal-catering-overlay').classList.remove('activo');
}

function elegirPaquete(paquete) {
    cateringPaqueteActual = paquete;
    document.getElementById('catering-paquete-elegido').textContent = paquete;
    document.getElementById('catering-paso1').style.display = 'none';
    document.getElementById('catering-paso2').style.display = 'block';
}

function volverPaso1() {
    document.getElementById('catering-paso1').style.display = 'block';
    document.getElementById('catering-paso2').style.display = 'none';
}

function enviarConsultaCatering() {
    const tipo    = document.getElementById('catering-form-tipo').value;
    const nombre  = document.getElementById('catering-form-nombre').value;
    const fecha   = document.getElementById('catering-form-fecha').value;
    const adultos = document.getElementById('catering-form-adultos').value || '0';
    const ninos   = document.getElementById('catering-form-ninos').value || '0';

    if (!nombre || !fecha) {
        alert('Por favor completá tu nombre y la fecha del evento.');
        return;
    }

    const msg = `Hola! Quiero consultar catering para un evento de ${tipo}. Paquete: ${cateringPaqueteActual}. Nombre: ${nombre}. Fecha: ${fecha}. Adultos: ${adultos}. Niños: ${ninos}.`;
    const url = `https://api.whatsapp.com/send?phone=543413742910&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    cerrarModalCatering();
}

///animation scroll

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.carta-box, .evento-privado-card, .slider-container').forEach(el => {
    observer.observe(el);
});
