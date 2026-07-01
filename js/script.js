// ============================================================
//  CUERVO BLANCO — common.js
//  Lógica compartida entre index.html y home.html
//  Para modificar colores, horarios o videos buscá las
//  secciones marcadas con ✏️ — son las únicas que necesitás tocar
// ============================================================


// ============================================================
//  ✏️ FERIADOS — Agregar o quitar fechas en formato "YYYY-MM-DD"
// ============================================================
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


// ============================================================
//   VIDEOS Y LOGOS — Qué video y logo mostrar en cada turno
//  mostrarPrincipal: true  → logo Cuervo Blanco (cuervo2.png)
//  mostrarPrincipal: false → logo Cuervo Café (cuervocafe2.png)
//  video: id del <video> en el HTML
// ============================================================
const ASSETS = {
  manana:    { mostrarPrincipal: false, video: "video-cafe"     }, // 06:00 – 11:59
  ejecutivo: { mostrarPrincipal: true,  video: "video-mediodia" }, // 12:00 – 15:59 L-J
  carta:     { mostrarPrincipal: true,  video: "video-mediodia" }, // 12:00 – 15:59 V-S-D-feriados
  tarde:     { mostrarPrincipal: false, video: "video-cafe"     }, // 16:00 – 19:59
  cena:      { mostrarPrincipal: true,  video: "video-cena"     }, // 20:00+
};


// ============================================================
//   ÍCONOS DEL ACORDEÓN — Clases de Tabler Icons por turno
//  Orden: cafe, ejecutivo, carta, bebidas
//  Ver iconos en: tabler.io/icons
// ============================================================
const ICONOS = {
  manana:    { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  ejecutivo: { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  carta:     { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  tarde:     { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  cena:      { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
};


// ============================================================
//  ✏️ PALETA DE COLORES — Colores del tema por turno
//  Cambiá --color-hover para cambiar el color principal de cada turno
//  Estos valores sobreescriben las variables CSS del :root
// ============================================================
const PALETAS = {
  manana: {
    '--color-principal': '#0d1a0a', // fondo oscuro verdoso
    '--color-traslucer': '#1e2e1a86',
    '--color-primary':   '#22391789',
    '--color-secundary': '#8aab7a',  // verde claro
    '--color-hover':     '#4a6741',  // verde logo café
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
    '--color-hover':     '#8a8888',
  },
  cena: {
    '--color-principal': '#050000',
    '--color-traslucer': '#2e2d2d86',
    '--color-primary':   '#22391789',
    '--color-secundary': '#a5a5a5',
    '--color-hover':     'rgb(139, 137, 137)',
  },
};


// ============================================================
//  SCROLL AUTOMÁTICO — A qué sección ir al abrir cada turno
//  El id tiene que coincidir con el id de la <section> en el HTML
// ============================================================
const MAPA_SECCIONES = {
  manana:    "cafe-section",
  ejecutivo: "ejecutivo-section",
  carta:     "almuerzo-section",
  tarde:     "cafe-section",
  cena:      "almuerzo-section",
};


// ============================================================
//  ✏️ NÚMERO DE WHATSAPP — Cambiar si cambia el número del local
// ============================================================
const WA_NUMBER = "543413742910";


// ============================================================
//  HELPERS — No necesitás tocar esto
// ============================================================

// Convierte fecha a string "YYYY-MM-DD" para comparar con FERIADOS
function fechaStr(d) {
  return d.toISOString().slice(0, 10);
}

// Convierte hora a número decimal (ej: 11:45 → 11.75)
function horaDecimal(d) {
  return d.getHours() + d.getMinutes() / 60;
}

// Abre WhatsApp con un mensaje pre-armado
function abrirWhatsApp(mensaje) {
  window.open(`https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(mensaje)}`, '_blank');
}


// ============================================================
//  LÓGICA HORARIA — Detecta el turno según hora y día
// ============================================================
function getTurno() {
  const ahora         = new Date();
  const hora          = horaDecimal(ahora);
  const diaSemana     = ahora.getDay(); // 0=Dom, 1=Lun ... 6=Sab
  const esFeriado     = FERIADOS.includes(fechaStr(ahora));
  const esFinDeSemana = diaSemana === 0 || diaSemana === 6; // Dom o Sab
  const esViernes     = diaSemana === 5;

  // ✏️ Horarios — modificar si cambian los horarios del local
  if (hora >= 6  && hora < 12) return "manana";
  if (hora >= 12 && hora < 16) return (esFinDeSemana || esViernes || esFeriado) ? "carta" : "ejecutivo";
  if (hora >= 16 && hora < 20) return "tarde";
  return "cena"; // 20:00 en adelante y madrugada
}


// ============================================================
//  APLICAR TURNO — Actualiza videos, logos, íconos y colores
//  hacerScroll: true solo la primera vez al cargar la página
// ============================================================
function aplicarTurno(hacerScroll = false) {
  const turno  = getTurno();
  const assets = ASSETS[turno];
  const iconos = ICONOS[turno];

  // 1. Videos — oculta todos y activa el del turno
  ["video-cafe", "video-mediodia", "video-cena"].forEach(id => {
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

  // 2. Logos splash (index.html)
  const divPrincipal = document.getElementById("logo-principal")?.closest(".splash__logo");
  const divCafe      = document.getElementById("logo-cafe")?.closest(".splash__logo");
  if (divPrincipal) divPrincipal.style.display = assets.mostrarPrincipal ? "block" : "none";
  if (divCafe)      divCafe.style.display      = assets.mostrarPrincipal ? "none"  : "block";

  // 3. Logos nav (home.html)
  const logoNavPrincipal = document.getElementById("logo-nav-principal");
  const logoNavCafe      = document.getElementById("logo-nav-cafe");
  if (logoNavPrincipal) logoNavPrincipal.style.display = assets.mostrarPrincipal ? "block" : "none";
  if (logoNavCafe)      logoNavCafe.style.display      = assets.mostrarPrincipal ? "none"  : "block";

  // 4. Íconos del acordeón en index.html
  //    Orden en el HTML: cafe(0), ejecutivo(1), carta(2), bebidas(3)
  const items  = document.querySelectorAll(".splash__acordeon-item");
  const claves = ["cafe", "ejecutivo", "carta", "bebidas"];
  items.forEach((item, i) => {
    const icono = item.querySelector("i");
    if (!icono || !claves[i]) return;
    icono.className = icono.className.replace(/ti-[^\s]+/, iconos[claves[i]]);
  });

  // 5. Resaltar el ítem activo en el acordeón
  items.forEach(item => item.classList.remove("activo", "proxima"));
  const mapaItem = { manana: 0, ejecutivo: 1, carta: 2, tarde: 0, cena: 2 };
  if (items[mapaItem[turno]]) items[mapaItem[turno]].classList.add("activo");

  // 6. Aplicar paleta de colores del turno
  Object.entries(PALETAS[turno]).forEach(([variable, valor]) => {
    document.documentElement.style.setProperty(variable, valor);
  });

  // 7. Scroll automático a la sección correspondiente (solo al cargar)
  if (hacerScroll) {
    const seccion = document.getElementById(MAPA_SECCIONES[turno]);
    if (seccion) seccion.scrollIntoView({ behavior: "smooth" });
  }

  console.log(`[Cuervo Blanco] Turno: ${turno} | ${new Date().toLocaleTimeString("es-AR")}`);
}


// ============================================================
//  INIT — Aplicar turno al cargar (con scroll) y cada 60 segundos
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  aplicarTurno(true);
  setInterval(() => aplicarTurno(false), 60 * 1000);
});


// ============================================================
//  MODAL RESERVAS — Botón RESERVAR del nav e index
//  Presente en index.html y home.html
// ============================================================
let sectorReserva = 'Adentro';

function abrirModalReserva() {
  document.getElementById('modal-reserva-overlay').classList.add('activo');
}
function cerrarModalReserva() {
  document.getElementById('modal-reserva-overlay').classList.remove('activo');
}
function elegirSectorReserva(sector, btn) {
  sectorReserva = sector;
  document.querySelectorAll('#modal-reserva-overlay .sector-btn').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');
}
function enviarReserva() {
  const nombre  = document.getElementById('reserva-nombre').value;
  const fecha   = document.getElementById('reserva-fecha').value;
  const hora    = document.getElementById('reserva-hora').value;
  const adultos = document.getElementById('reserva-adultos').value || '0';
  const ninos   = document.getElementById('reserva-ninos').value   || '0';

  if (!nombre || !fecha || !hora) {
    alert('Por favor completá nombre, fecha y hora.');
    return;
  }

  abrirWhatsApp(`Hola! Quiero hacer una reserva. Nombre: ${nombre}. Fecha: ${fecha}. Hora: ${hora}. Adultos: ${adultos}. Niños: ${ninos}. Sector: ${sectorReserva}.`);
  cerrarModalReserva();
}