"use strict";
/* =================================================================
   Portal Bancario (Entorno de Simulación) — Lógica de la aplicación
   -----------------------------------------------------------------
   Notas de seguridad (desarrollador):
   - Ningún manejador de eventos se declara inline en el HTML
     (onclick="..."). Todos los elementos interactivos usan el
     atributo data-action y se delega un único listener de clic,
     lo que permite aplicar una Content-Security-Policy estricta
     (sin 'unsafe-inline') en <head>.
   - El contenido dinámico se inserta con textContent / creación de
     nodos DOM, nunca con innerHTML a partir de datos variables, para
     evitar inyección de HTML/script.
   - El segundo factor (token) aplica un límite de intentos fallidos
     con bloqueo temporal, simulando protección contra fuerza bruta.
   - La sesión se cierra automáticamente tras un período de
     inactividad, como en un portal bancario real.
   ================================================================= */

/* -------------------- Datos -------------------- */
// MOVIMIENTOS y SALDO_INICIAL ya no viven en este archivo: se cargan desde
// data/movimientos.js (ver ese archivo para el detalle y el porqué).

// Token fijo del entorno de prueba (para que el bot y el desarrollador puedan
// completar el segundo factor de forma determinista). No se muestra en pantalla.
const TOKEN_VALIDO = "135790";

/* -------------------- Seguridad: control de intentos de token -------------------- */
const MAX_INTENTOS_OTP = 3;
const BLOQUEO_MS = 15000; // bloqueo temporal simulado tras exceder los intentos
let intentosOtp = 0;
let bloqueadoHastaTimeout = null;

/* -------------------- Seguridad: cierre de sesión por inactividad -------------------- */
const INACTIVIDAD_LIMITE_MS = 3 * 60 * 1000; // 3 minutos
let inactividadTimer = null;

function fechaMostrar(iso){ const [y,m,d]=iso.split("-"); return `${d}/${m}/${y}`; }

/* -------------------- Login -------------------- */
function goStep1(){
  document.getElementById("step2").hidden = true;
  document.getElementById("step1").hidden = false;
}

function goStep2(){
  const u = document.getElementById("user").value.trim();
  const p = document.getElementById("pass").value.trim();
  if(!u || !p){
    document.getElementById("err1").hidden = false;
    return;
  }
  document.getElementById("err1").hidden = true;
  document.getElementById("step1").hidden = true;
  document.getElementById("step2").hidden = false;
  document.getElementById("otp").focus();
}

function goHome(){
  const otpInput = document.getElementById("otp");
  const otp = otpInput.value.trim();

  if(otp !== TOKEN_VALIDO){
    intentosOtp++;
    const restantes = MAX_INTENTOS_OTP - intentosOtp;
    const err2 = document.getElementById("err2");
    if(restantes > 0){
      err2.textContent = `Token incorrecto. Te quedan ${restantes} intento(s).`;
      err2.hidden = false;
    } else {
      bloquearOtpTemporalmente();
    }
    return;
  }

  intentosOtp = 0;
  document.getElementById("err2").hidden = true;
  document.getElementById("loginScreens").hidden = true;
  document.getElementById("appScreens").hidden = false;
  document.getElementById("hdrCodigo").textContent = document.getElementById("code").value || "00000";
  document.getElementById("hdrUsuario").textContent = (document.getElementById("user").value || "usuario").toUpperCase();
  showScreen("screenHome");
  buildCalendar();
  iniciarControlDeInactividad();
}

function bloquearOtpTemporalmente(){
  const otpInput = document.getElementById("otp");
  const btnContinuar = document.getElementById("btnStep2Continue");
  const err2 = document.getElementById("err2");

  otpInput.disabled = true;
  btnContinuar.disabled = true;
  err2.hidden = true;

  const notice = document.getElementById("notice2");
  let segundosRestantes = Math.ceil(BLOQUEO_MS / 1000);
  notice.textContent = `Por seguridad, la verificación se bloqueó temporalmente. Intenta de nuevo en ${segundosRestantes}s.`;
  notice.hidden = false;

  const cuentaRegresiva = setInterval(() => {
    segundosRestantes--;
    if(segundosRestantes > 0){
      notice.textContent = `Por seguridad, la verificación se bloqueó temporalmente. Intenta de nuevo en ${segundosRestantes}s.`;
    } else {
      clearInterval(cuentaRegresiva);
    }
  }, 1000);

  clearTimeout(bloqueadoHastaTimeout);
  bloqueadoHastaTimeout = setTimeout(() => {
    otpInput.disabled = false;
    btnContinuar.disabled = false;
    notice.hidden = true;
    otpInput.value = "";
    intentosOtp = 0;
    otpInput.focus();
  }, BLOQUEO_MS);
}

function logout(motivo){
  clearInactivityTimer();
  document.getElementById("appScreens").hidden = true;
  document.getElementById("loginScreens").hidden = false;
  ["code","user","pass","otp"].forEach(id=>{ document.getElementById(id).value = ""; });
  intentosOtp = 0;
  goStep1();

  const err1 = document.getElementById("err1");
  if(motivo === "inactividad"){
    err1.textContent = "Tu sesión se cerró automáticamente por inactividad.";
    err1.hidden = false;
  } else {
    err1.hidden = true;
  }
}

/* -------------------- Seguridad: temporizador de inactividad -------------------- */
function reiniciarTemporizadorInactividad(){
  clearTimeout(inactividadTimer);
  inactividadTimer = setTimeout(() => logout("inactividad"), INACTIVIDAD_LIMITE_MS);
}
function iniciarControlDeInactividad(){
  reiniciarTemporizadorInactividad();
}
function clearInactivityTimer(){
  clearTimeout(inactividadTimer);
}
["mousemove","keydown","click","scroll"].forEach(evt=>{
  document.addEventListener(evt, () => {
    // Solo aplica cuando hay una sesión iniciada.
    if(!document.getElementById("appScreens").hidden){
      reiniciarTemporizadorInactividad();
    }
  }, {passive:true});
});

/* -------------------- Navegación entre pantallas post-login -------------------- */
function showScreen(id){
  ["screenHome","screenMonetarios","screenMovimientos","screenDescarga"].forEach(s=>{
    document.getElementById(s).hidden = (s !== id);
  });
  document.getElementById("rowMenu").classList.remove("open");
}
// Saldos de la pantalla Monetarios, calculados a partir de los datos: el saldo
// total/disponible es el del último movimiento y el "inicial del día" es el que
// había al abrir el día de ese último movimiento.
const fmtQ = n => n.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
function cargarSaldosMonetarios(){
  const ultimo = MOVIMIENTOS[MOVIMIENTOS.length - 1];
  let saldoFinal = SALDO_INICIAL, saldoAperturaDia = SALDO_INICIAL;
  MOVIMIENTOS.forEach(m => {
    if(ultimo && m.fecha < ultimo.fecha) saldoAperturaDia = redondear2(saldoAperturaDia - (m.debe||0) + (m.haber||0));
    saldoFinal = redondear2(saldoFinal - (m.debe||0) + (m.haber||0));
  });
  document.getElementById("monSaldoInicial").textContent = fmtQ(saldoAperturaDia);
  document.getElementById("monSaldoDisponible").textContent = fmtQ(saldoFinal);
  document.getElementById("monSaldoTotal").textContent = fmtQ(saldoFinal);
}

function goMonetarios(){ cargarSaldosMonetarios(); showScreen("screenMonetarios"); }
function goMovimientos(){ showScreen("screenMovimientos"); }

function toggleRowMenu(ev){
  ev.stopPropagation();
  document.getElementById("rowMenu").classList.toggle("open");
}
document.addEventListener("click", ()=>document.getElementById("rowMenu")?.classList.remove("open"));

/* -------------------- Consulta de movimientos -------------------- */
function showDateTab(tab){
  document.getElementById("tabDia").classList.toggle("active", tab==="dia");
  document.getElementById("tabMes").classList.toggle("active", tab==="mes");
  document.getElementById("tabPers").classList.toggle("active", tab==="personalizado");
  document.getElementById("dateTabDia").hidden = tab!=="dia";
  document.getElementById("dateTabMes").hidden = tab!=="mes";
  document.getElementById("dateTabPers").hidden = tab!=="personalizado";
}

document.querySelectorAll(".month-tile").forEach(t=>{
  t.addEventListener("click", ()=>{
    document.querySelectorAll(".month-tile").forEach(x=>x.classList.remove("selected"));
    t.classList.add("selected");
  });
});

function buildCalendar(){
  const body = document.getElementById("calBody");
  if(!body || body.dataset.built) return;
  body.dataset.built = "1";
  // Septiembre 2026 empieza en martes (día 1 = martes); se arma una cuadrícula simple.
  const firstWeekday = 2; // 0=domingo
  const daysInMonth = 30;
  let day = 1;
  for(let w=0; w<6 && day<=daysInMonth; w++){
    const tr = document.createElement("tr");
    for(let d=0; d<7; d++){
      const td = document.createElement("td");
      if((w===0 && d<firstWeekday) || day>daysInMonth){
        td.classList.add("empty");
      } else {
        td.textContent = String(day);
        td.addEventListener("click", ()=>selectDay(td));
        day++;
      }
      tr.appendChild(td);
    }
    body.appendChild(tr);
  }
}
function selectDay(td){
  document.querySelectorAll("#calBody td").forEach(x=>x.classList.remove("sel"));
  td.classList.add("sel");
}
function consultar(){
  const modo = document.getElementById("modoVisualizacion").value;
  const titulos = {
    "Archivo (CSV/Excel)": "Estado de Cuenta en formato de Excel",
    "Archivo PDF": "Estado de Cuenta en formato de PDF",
    "Archivo XML": "Estado de Cuenta en formato XML",
    "Archivo de Texto": "Estado de Cuenta en formato de Texto",
  };
  document.getElementById("descargaTitulo").textContent = titulos[modo] || "Estado de Cuenta";

  if(modo === "Archivo (CSV/Excel)"){
    downloadCSV();
  }

  const now = new Date();
  document.getElementById("stampDate").textContent = now.toLocaleDateString("es-GT");
  document.getElementById("stampTime").textContent = now.toLocaleTimeString("es-GT");
  document.getElementById("stampAuth").textContent = String(Math.floor(100000000 + Math.random()*899999999));
  showScreen("screenDescarga");
}

// Quita acentos/diacríticos y cualquier carácter fuera de ASCII, para que el
// archivo se abra siempre con letras y números "planos" sin importar cómo
// interprete Excel la codificación (evita símbolos raros tipo "dÃ­a").
function quitarAcentos(texto){
  return String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x00-\x7F]/g, "");
}

const CUENTA_NUMERO = "0786461650";
const CUENTA_NOMBRE = "EMPRESA DE ALIMENTOS";
const TIPOS_TRANSACCION = [
  "DE = Deposito",
  "CQ = Pago de Cheque",
  "NC = Nota de Credito",
  "ND = Nota de Debito",
];
const MESES_ES = ["enero","febrero","marzo","abril","mayo","junio","julio",
  "agosto","septiembre","octubre","noviembre","diciembre"];

// Una consulta "Por mes" cubre el mes completo (del día 1 al último día),
// no solo el rango entre el primer y el último movimiento registrado —
// así se comporta el estado de cuenta real.
function primerYUltimoDiaDelMes(mes, anio){
  const ultimoDia = new Date(anio, mes, 0).getDate(); // día 0 del mes siguiente = último día de "mes"
  const pad = n => String(n).padStart(2, "0");
  return {
    desde: `01/${pad(mes)}/${anio}`,
    hasta: `${pad(ultimoDia)}/${pad(mes)}/${anio}`,
  };
}

// Devuelve el periodo (mes y año) que se va a consultar. Si el usuario/bot
// seleccionó un mes en la pestaña "Por mes" se usa ese; si no hay selección
// (p. ej. pestañas "Por día"/"Personalizado" sin completar), se usa el mes más
// reciente con movimientos, para que el archivo siempre corresponda a un mes
// calendario válido y con información.
function periodoConsultado(){
  const tileSeleccionado = document.querySelector(".month-tile.selected");
  if(tileSeleccionado){
    const [nombreMes, anioTexto] = tileSeleccionado.dataset.m.split(",").map(s => s.trim());
    const mes = MESES_ES.indexOf(nombreMes.toLowerCase()) + 1;
    const anio = parseInt(anioTexto, 10);
    if(mes > 0 && !Number.isNaN(anio)) return {mes, anio};
  }
  const [anioDatos, mesDatos] = (MOVIMIENTOS[MOVIMIENTOS.length - 1]?.fecha || "").split("-").map(Number);
  return {mes: mesDatos, anio: anioDatos};
}

const redondear2 = n => Math.round(n * 100) / 100;

// Movimientos del mes consultado y saldo con el que abre ese mes. El saldo
// inicial de cada mes es el saldo del 1 de abril (SALDO_INICIAL) más el efecto
// de todos los movimientos anteriores al mes, de modo que el saldo final de un
// mes coincide con el saldo inicial del siguiente (como en un estado de cuenta real).
function movimientosDelPeriodo(mes, anio){
  const inicioMes = `${anio}-${String(mes).padStart(2, "0")}-01`;
  const inicioSiguiente = mes === 12
    ? `${anio + 1}-01-01`
    : `${anio}-${String(mes + 1).padStart(2, "0")}-01`;
  let saldoInicial = SALDO_INICIAL;
  const movs = [];
  MOVIMIENTOS.forEach(m => {
    if(m.fecha < inicioMes) saldoInicial = redondear2(saldoInicial - (m.debe||0) + (m.haber||0));
    else if(m.fecha < inicioSiguiente) movs.push(m);
  });
  return {saldoInicial, movs};
}

function buildCSV(){
  const {mes, anio} = periodoConsultado();
  const rango = primerYUltimoDiaDelMes(mes, anio);
  const {saldoInicial, movs} = movimientosDelPeriodo(mes, anio);

  const lineas = [];
  lineas.push(["Tipo de Transacciones"]);
  TIPOS_TRANSACCION.forEach(t => lineas.push([t]));
  lineas.push([]);
  lineas.push([`Cuenta: ${CUENTA_NUMERO} - ${CUENTA_NOMBRE}`]);
  lineas.push([`Saldo inicial (GTQ): ${saldoInicial.toFixed(2)}`]);
  lineas.push([`Del ${rango.desde} al ${rango.hasta}`]);
  lineas.push([]);
  lineas.push(["Fecha","TT","Descripcion","No.Doc","Debe (GTQ)","Haber (GTQ)","Saldo (GTQ)"]);

  let saldo = saldoInicial;
  movs.forEach(m=>{
    saldo = redondear2(saldo - (m.debe||0) + (m.haber||0));
    lineas.push([fechaMostrar(m.fecha), m.tt, m.desc, m.doc, m.debe??"", m.haber??"", saldo.toFixed(2)]);
  });

  return lineas
    .map(fila => fila.map(v => `"${quitarAcentos(v).replace(/"/g,'""')}"`).join(","))
    .join("\r\n");
}

// Elimina cualquier carácter no válido en nombres de archivo antes de usarlo
// en el atributo download (defensa en profundidad; los valores ya provienen
// de campos internos, pero no se asume que siempre será así).
function sanitizarNombreArchivo(valor){
  return String(valor).replace(/[^a-zA-Z0-9._-]/g, "");
}

function downloadCSV(){
  const csv = buildCSV();
  // BOM UTF-8: sin él, Excel puede interpretar el archivo con la
  // codificación equivocada y mostrar símbolos extraños en lugar de tildes/ñ.
  const BOM = "﻿";
  const blob = new Blob([BOM + csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const codigo = sanitizarNombreArchivo(document.getElementById("hdrCodigo").textContent || "00000");
  const usuario = sanitizarNombreArchivo(document.getElementById("hdrUsuario").textContent || "USUARIO");
  a.href = url;
  a.download = `${codigo}-${usuario}_0786461650_estado_cuenta.csv`;
  document.body.appendChild(a);
  a.click();
  // La limpieza se retrasa un instante para dar tiempo al navegador a tomar
  // el blob antes de revocar su URL; revocarla de inmediato puede, en
  // algunos navegadores, interrumpir la descarga que se acaba de iniciar.
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 150);
}
function triggerDownload(){ downloadCSV(); }

/* -------------------- Delegación de eventos (sin onclick inline) --------------------
   Todos los elementos interactivos declaran data-action="nombreDeFuncion" en el
   HTML. Un único listener centraliza el despacho, lo que evita depender de
   atributos de evento inline y permite una Content-Security-Policy estricta. */
const ACCIONES = {
  goStep1, goStep2, goHome, logout,
  goMonetarios, goMovimientos, toggleRowMenu,
  showDateTab, consultar, triggerDownload,
};

document.addEventListener("click", (ev)=>{
  const el = ev.target.closest("[data-action], a[href='#']");
  if(!el) return;

  if(el.tagName === "A"){ ev.preventDefault(); }

  const accion = el.dataset.action;
  if(!accion) return; // enlace deshabilitado / decorativo: solo se evita la navegación
  if(el.disabled) return;

  const fn = ACCIONES[accion];
  if(typeof fn !== "function") return;

  if(accion === "showDateTab") fn(el.dataset.tab);
  else if(accion === "toggleRowMenu") fn(ev);
  else fn();
});

document.getElementById("otp").addEventListener("keydown", e=>{ if(e.key==="Enter") goHome(); });
document.getElementById("pass").addEventListener("keydown", e=>{ if(e.key==="Enter") goStep2(); });
