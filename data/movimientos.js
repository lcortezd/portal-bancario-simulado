"use strict";
/* =================================================================
   Fuente de datos: movimientos de la cuenta simulada
   -----------------------------------------------------------------
   Este archivo separa los DATOS (lo que en la plataforma real
   vendría de una consulta al núcleo bancario) de la LÓGICA de la
   aplicación (js/script.js). El bot / usuario nunca necesita tocar
   script.js para cambiar el ejemplo: basta con editar este archivo.

   Se carga como <script> (no con fetch) porque el portal se abre
   como archivo local (file://) sin servidor web; los navegadores
   bloquean las peticiones fetch/XHR a archivos locales por política
   de origen cruzado (CORS), pero sí permiten cargar <script src="">
   normalmente. Si en el futuro este portal se sirve desde un
   servidor HTTP real, este archivo puede convertirse fácilmente en
   un endpoint JSON consumido con fetch().
   ================================================================= */

const SALDO_INICIAL = 10000.00;

const MOVIMIENTOS = [
  {fecha:"2026-08-03", tt:"NC", desc:"Corte POS - ventas del día", doc:"71001", debe:null, haber:8500.00},
  {fecha:"2026-08-03", tt:"NC", desc:"Corte POS - ventas del día", doc:"71014", debe:null, haber:6200.00},
  {fecha:"2026-08-05", tt:"CQ", desc:"Pago a proveedor A", doc:"00512", debe:3450.00, haber:null},
  {fecha:"2026-08-07", tt:"ND", desc:"Pago electrónico - servicios", doc:"551002", debe:1890.30, haber:null},
  {fecha:"2026-08-09", tt:"DE", desc:"Depósito - agencia sucursal", doc:"747700123", debe:null, haber:1250.00},
  {fecha:"2026-08-14", tt:"ND", desc:"Comisión bancaria mensual", doc:"551015", debe:125.00, haber:null},
  {fecha:"2026-08-18", tt:"NC", desc:"Corte POS - ventas del día", doc:"71028", debe:null, haber:7400.00},
  {fecha:"2026-08-21", tt:"CQ", desc:"Pago a proveedor C", doc:"00523", debe:960.00, haber:null},
  {fecha:"2026-08-24", tt:"ND", desc:"Nómina quincenal", doc:"551030", debe:15400.00, haber:null},
  {fecha:"2026-08-27", tt:"NC", desc:"Corte POS - ventas del día", doc:"71041", debe:null, haber:5300.00},
];
