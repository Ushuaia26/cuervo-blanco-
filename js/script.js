// ============================================================
//  CUERVO BLANCO — common.js
//  Colores controlados desde el script (paleta fija + especial)
//  El acordeón sigue con lógica horaria
// ============================================================

// ---- ✏️ FERIADOS — para la lógica del acordeón ----
const FERIADOS = [
  "2025-01-01", "2025-03-03", "2025-03-04", "2025-03-24",
  "2025-04-02", "2025-04-17", "2025-04-18", "2025-05-01",
  "2025-05-25", "2025-06-16", "2025-06-20", "2025-07-09",
  "2025-08-17", "2025-10-12", "2025-11-20", "2025-12-08",
  "2025-12-25",
  "2026-01-01", "2026-02-16", "2026-02-17", "2026-03-24",
  "2026-04-02", "2026-04-03", "2026-04-06", "2026-05-01",
  "2026-05-25", "2026-06-15", "2026-06-20", "2026-07-09",
  "2026-08-17", "2026-10-12", "2026-11-20", "2026-12-08",
  "2026-12-25"
];

// ---- ÍCONOS del acordeón por turno de contenido ----
const ICONOS = {
  manana:    { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  ejecutivo: { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  carta:     { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  tarde:     { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
  cena:      { cafe: "ti-coffee", ejecutivo: "ti-bowl-spoon", carta: "ti-tools-kitchen-2", bebidas: "ti-glass-full" },
};

// ---- A qué sección scrollear según turno de contenido ----
const MAPA_SECCIONES = {
  manana:    "cafe-section",
  ejecutivo: "ejecutivo-section",
  carta:     "almuerzo-section",
  tarde:     "cafe-section",
  cena:      "almuerzo-section",
};

// ---- ✏️ NÚMERO DE WHATSAPP ----
const WA_NUMBER = "543413742910";

// ============================================================
//  ✏️ PALETA FIJA — Los colores de todos los días
//  Se aplica siempre, salvo que la PALETA ESPECIAL esté activada
// ============================================================
const PALETA_FIJA = {
  '--color-principal': '#050000',
  '--color-traslucer': '#2e2d2d86',
  '--color-primary':   '#646464cf',
  '--color-secundary': '#bababa',
  '--color-hover':     'rgb(252, 252, 252)',
};

// ============================================================
//  ✏️ PALETA ESPECIAL — Para días especiales o pedidos puntuales
//  Para ACTIVAR: cambiar a "true" y completar los colores de abajo
//  Para DESACTIVAR: dejar en "false" (vuelve la PALETA FIJA)
// ============================================================
const PALETA_ESPECIAL_ACTIVA = true;

const PALETA_ESPECIAL = {
  '--color-principal': '#0a1a2e',
  '--color-traslucer': '#1a2e4d86',
  '--color-primary':   '#2f9de1ce',
  '--color-secundary': '#949494',
  '--color-hover':     '#2c83d4',
};

// ---- HELPERS ----
function fechaStr(d) {
  return d.toISOString().slice(0, 10);
}
function horaDecimal(d) {
  return d.getHours() + d.getMinutes() / 60;
}
function abrirWhatsApp(mensaje) {
  window.open(`https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(mensaje)}`, '_blank');
}

// ---- Detección de turno de CONTENIDO (para el acordeón) ----
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

// ---- Aplica la paleta fija, y si está activada, la especial encima ----
function aplicarPaleta() {
  Object.entries(PALETA_FIJA).forEach(([variable, valor]) => {
    document.documentElement.style.setProperty(variable, valor);
  });

  if (PALETA_ESPECIAL_ACTIVA) {
    Object.entries(PALETA_ESPECIAL).forEach(([variable, valor]) => {
      document.documentElement.style.setProperty(variable, valor);
    });
    console.log("🎨 Paleta especial activada");
  }
}

// ---- APLICAR TURNO — solo acordeón (íconos, resaltado, scroll) ----
function aplicarTurno(hacerScroll = false) {
  const turnoContenido = getTurno();

  // Íconos del acordeón
  const iconos = ICONOS[turnoContenido];
  const items  = document.querySelectorAll(".splash__acordeon-item");
  const claves = ["cafe", "ejecutivo", "carta", "bebidas"];
  items.forEach((item, i) => {
    const icono = item.querySelector("i");
    if (!icono || !claves[i]) return;
    icono.className = icono.className.replace(/ti-[^\s]+/, iconos[claves[i]]);
  });

  // Resaltar ítem activo
  items.forEach(item => item.classList.remove("activo", "proxima"));
  const mapaItem = { manana: 0, ejecutivo: 1, carta: 2, tarde: 0, cena: 2 };
  if (items[mapaItem[turnoContenido]]) items[mapaItem[turnoContenido]].classList.add("activo");

  // Scroll automático al cargar
  if (hacerScroll) {
    const seccion = document.getElementById(MAPA_SECCIONES[turnoContenido]);
    if (seccion) seccion.scrollIntoView({ behavior: "smooth" });
  }

  console.log(`[Cuervo Blanco] Turno: ${turnoContenido} | ${new Date().toLocaleTimeString("es-AR")}`);
}

document.addEventListener("DOMContentLoaded", () => {
  aplicarTurno(true);
  aplicarPaleta();
  setInterval(() => aplicarTurno(false), 60 * 1000);
});

// ---- MODAL RESERVAS — sin cambios ----
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
  const turno   = document.getElementById('reserva-turno').value;
  const adultos = document.getElementById('reserva-adultos').value || '0';
  const ninos   = document.getElementById('reserva-ninos').value   || '0';

  if (!nombre || !fecha || !turno) {
    alert('Por favor completá nombre, fecha y turno.');
    return;
  }

  abrirWhatsApp(`Hola! Quiero hacer una reserva. Nombre: ${nombre}. Fecha: ${fecha}. Turno: ${turno}. Adultos: ${adultos}. Niños: ${ninos}. Sector: ${sectorReserva}.`);
  cerrarModalReserva();
}
