// ============================================================
//  CUERVO BLANCO — home.js
//  Lógica exclusiva de home.html (carta completa)
//  Requiere que common.js esté cargado antes
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // Menú hamburguesa: cerrarlo al clickear un ítem del nav
  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      const menuToggle = document.getElementById('menu-toggle');
      if (menuToggle) menuToggle.checked = false;

      const toggleCartaNav = document.getElementById('toggle-carta-nav');
      if (toggleCartaNav) toggleCartaNav.checked = false; 
    });
  });

  // Observer del carrusel: resalta la categoría visible al hacer scroll
  const observerCarrusel = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      document.querySelectorAll('.categoria-card').forEach(c => c.classList.remove('active'));
      const cardActiva = document.querySelector(`.categoria-card[href="#${id}"]`);
      if (cardActiva) {
        cardActiva.classList.add('active');
        cardActiva.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.carta-box[id], .carta-grid[id]').forEach(s => observerCarrusel.observe(s));

  // Observer de animaciones: agrega clase 'visible' al entrar en pantalla
  const observerAnim = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observerAnim.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.carta-box, .evento-privado-card, .slider-container').forEach(el => observerAnim.observe(el));

});


// ============================================================
//  CARRUSEL DE CATEGORÍAS — Botones anterior/siguiente
//  Recorre cada .categorias-wrapper por separado (café, comida
//  y bebidas tienen su propio carrusel independiente)
// ============================================================
document.querySelectorAll('.categorias-wrapper').forEach(wrapper => {
    const carrusel = wrapper.querySelector('.categorias-carrusel');
    const btnPrev  = wrapper.querySelector('.carrusel-btn:first-child');
    const btnNext  = wrapper.querySelector('.carrusel-btn:last-child');

    if (btnNext) btnNext.addEventListener('click', () => carrusel.scrollBy({ left:  150, behavior: 'smooth' }));
    if (btnPrev) btnPrev.addEventListener('click', () => carrusel.scrollBy({ left: -150, behavior: 'smooth' }));
});

// ============================================================
//  SLIDER DE EVENTOS — Flechas y dots del slider de días especiales
// ============================================================
const sliderTrack = document.getElementById('slider-track');
const sliderDots  = document.querySelectorAll('.slider-dot');
let sliderCurrent = 0;
const sliderTotal = document.querySelectorAll('.slider-slide').length;

function goToSlide(index) {
  sliderCurrent = index;
  if (sliderTrack) sliderTrack.style.transform = `translateX(-${sliderCurrent * 100}%)`;
  sliderDots.forEach((d, i) => d.classList.toggle('active', i === sliderCurrent));
}

document.getElementById('slider-prev')?.addEventListener('click', () =>
  goToSlide(sliderCurrent === 0 ? sliderTotal - 1 : sliderCurrent - 1));
document.getElementById('slider-next')?.addEventListener('click', () =>
  goToSlide(sliderCurrent === sliderTotal - 1 ? 0 : sliderCurrent + 1));
sliderDots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));


// ============================================================
//  MODAL EVENTOS DÍAS ESPECIALES — Miércoles de pasta / Jueves pizza
//  Valida que sea el día correcto y que la hora sea desde las 20:00
// ============================================================
let sectorEvento = 'Adentro';
let diaEvento    = '';

function abrirModalEvento(tipo, dia) {
  diaEvento = dia;
  document.getElementById('modal-evento-tipo').textContent      = tipo;
  document.getElementById('evento-dia-label').textContent       = dia === 'miercoles' ? 'miércoles' : 'jueves';
  document.getElementById('evento-fecha').value                 = '';
  document.getElementById('evento-hora').value                  = '';
  document.getElementById('modal-evento-overlay').classList.add('activo');
}
function cerrarModalEvento() {
  document.getElementById('modal-evento-overlay').classList.remove('activo');
}
function elegirSectorEvento(sector, btn) {
  sectorEvento = sector;
  document.querySelectorAll('#modal-evento-overlay .sector-btn').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');
}
function enviarReservaEvento() {
  const nombre  = document.getElementById('evento-nombre').value;
  const fecha   = document.getElementById('evento-fecha').value;
  const hora    = document.getElementById('evento-hora').value;
  const adultos = document.getElementById('evento-adultos').value || '0';
  const ninos   = document.getElementById('evento-ninos').value   || '0';

  if (!nombre || !fecha || !hora) { alert('Por favor completá nombre, fecha y hora.'); return; }
  if (hora < '20:00')             { alert('Las reservas para eventos son a partir de las 20:00hs.'); return; }

  // Validar día correcto
  const diaSemana = new Date(fecha + 'T00:00:00').getDay();
  if (diaEvento === 'miercoles' && diaSemana !== 3) { alert('El miércoles de pasta solo es los miércoles.'); return; }
  if (diaEvento === 'jueves'    && diaSemana !== 4) { alert('El jueves de pizza & burger solo es los jueves.'); return; }

  const tipo = document.getElementById('modal-evento-tipo').textContent;
  abrirWhatsApp(`Hola! Quiero reservar para ${tipo}. Nombre: ${nombre}. Fecha: ${fecha}. Hora: ${hora}. Adultos: ${adultos}. Niños: ${ninos}. Sector: ${sectorEvento}.`);
  cerrarModalEvento();
}


// ============================================================
//  MODAL EVENTOS PRIVADOS — Cumpleaños, casamientos, etc.
// ============================================================
function abrirModal(tipo) {
  document.getElementById('form-tipo').value              = tipo;
  document.getElementById('modal-tipo').textContent       = tipo;
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
  const ninos   = document.getElementById('form-ninos').value   || '0';

  if (!nombre || !fecha) { alert('Por favor completá tu nombre y la fecha del evento.'); return; }

  abrirWhatsApp(`Hola! Quiero consultar presupuesto para un evento de ${tipo}. Nombre: ${nombre}. Fecha: ${fecha}. Adultos: ${adultos}. Niños: ${ninos}.`);
  cerrarModal();
}


// ============================================================
//  MODAL CATERING — Con selección de paquete en dos pasos
// ============================================================
let cateringTipoActual    = '';
let cateringPaqueteActual = '';

function abrirModalCatering(tipo) {
  cateringTipoActual = tipo;
  document.getElementById('modal-catering-tipo').textContent  = tipo;
  document.getElementById('catering-form-tipo').value         = tipo;
  document.getElementById('catering-paso1').style.display     = 'block';
  document.getElementById('catering-paso2').style.display     = 'none';
  document.getElementById('modal-catering-overlay').classList.add('activo');
}
function cerrarModalCatering() {
  document.getElementById('modal-catering-overlay').classList.remove('activo');
}
function elegirPaquete(paquete) {
  cateringPaqueteActual = paquete;
  document.getElementById('catering-paquete-elegido').textContent = paquete;
  document.getElementById('catering-paso1').style.display          = 'none';
  document.getElementById('catering-paso2').style.display          = 'block';
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
  const ninos   = document.getElementById('catering-form-ninos').value   || '0';

  if (!nombre || !fecha) { alert('Por favor completá tu nombre y la fecha del evento.'); return; }

  abrirWhatsApp(`Hola! Quiero consultar catering para un evento de ${tipo}. Paquete: ${cateringPaqueteActual}. Nombre: ${nombre}. Fecha: ${fecha}. Adultos: ${adultos}. Niños: ${ninos}.`);
  cerrarModalCatering();
}
