"use strict";
/* =================================================================
   Fuente de datos: movimientos de la cuenta simulada (abril a septiembre 2026)
   -----------------------------------------------------------------
   Contiene movimientos para cada uno de los meses que muestra la pantalla
   "Consulta de movimientos" (Por mes), de modo que el bot encuentre
   informacion sin importar el mes que seleccione. script.js filtra por el mes
   elegido y calcula el saldo inicial de cada mes a partir de SALDO_INICIAL
   (saldo al 1 de abril). Todos los datos son ficticios.

   Tipos de transaccion: DE deposito, NC nota de credito, CQ pago de cheque,
   ND nota de debito.
   ================================================================= */

const SALDO_INICIAL = 19007.55;   // saldo al 01/04/2026

const MOVIMIENTOS = [
  {fecha:"2026-04-02", tt:"NC", desc:"Corte POS - ventas del día", doc:"70774", debe:null, haber:8150.00},
  {fecha:"2026-04-06", tt:"CQ", desc:"Pago a proveedor A", doc:"00424", debe:2900.00, haber:null},
  {fecha:"2026-04-08", tt:"NC", desc:"Corte POS - ventas del día", doc:"70788", debe:null, haber:6730.00},
  {fecha:"2026-04-10", tt:"ND", desc:"Pago electrónico - servicios", doc:"550840", debe:1745.50, haber:null},
  {fecha:"2026-04-12", tt:"CQ", desc:"Pago a proveedor D", doc:"00430", debe:4650.00, haber:null},
  {fecha:"2026-04-15", tt:"DE", desc:"Depósito - agencia sucursal", doc:"747598214", debe:null, haber:980.00},
  {fecha:"2026-04-17", tt:"NC", desc:"Corte POS - ventas del día", doc:"70801", debe:null, haber:7020.00},
  {fecha:"2026-04-20", tt:"ND", desc:"Comisión bancaria mensual", doc:"550853", debe:125.00, haber:null},
  {fecha:"2026-04-22", tt:"CQ", desc:"Pago a proveedor B", doc:"00435", debe:3180.00, haber:null},
  {fecha:"2026-04-24", tt:"CQ", desc:"Pago a proveedor E", doc:"00441", debe:5120.00, haber:null},
  {fecha:"2026-04-25", tt:"ND", desc:"Nómina quincenal", doc:"550867", debe:14200.00, haber:null},
  {fecha:"2026-04-28", tt:"NC", desc:"Corte POS - ventas del día", doc:"70814", debe:null, haber:5860.00},
  {fecha:"2026-05-04", tt:"NC", desc:"Corte POS - ventas del día", doc:"70828", debe:null, haber:7480.00},
  {fecha:"2026-05-06", tt:"CQ", desc:"Pago a proveedor C", doc:"00446", debe:1850.00, haber:null},
  {fecha:"2026-05-08", tt:"ND", desc:"Pago electrónico - servicios", doc:"550880", debe:1812.75, haber:null},
  {fecha:"2026-05-10", tt:"CQ", desc:"Pago a proveedor D", doc:"00452", debe:5480.00, haber:null},
  {fecha:"2026-05-12", tt:"NC", desc:"Corte POS - ventas del día", doc:"70841", debe:null, haber:6390.00},
  {fecha:"2026-05-14", tt:"DE", desc:"Depósito - agencia sucursal", doc:"747631877", debe:null, haber:1120.00},
  {fecha:"2026-05-18", tt:"NC", desc:"Corte POS - ventas del día", doc:"70854", debe:null, haber:7150.00},
  {fecha:"2026-05-20", tt:"ND", desc:"Comisión bancaria mensual", doc:"550894", debe:125.00, haber:null},
  {fecha:"2026-05-22", tt:"CQ", desc:"Pago a proveedor A", doc:"00457", debe:2640.00, haber:null},
  {fecha:"2026-05-26", tt:"ND", desc:"Nómina quincenal", doc:"550907", debe:14600.00, haber:null},
  {fecha:"2026-05-27", tt:"CQ", desc:"Pago a proveedor E", doc:"00463", debe:4310.00, haber:null},
  {fecha:"2026-05-29", tt:"NC", desc:"Corte POS - ventas del día", doc:"70868", debe:null, haber:5920.00},
  {fecha:"2026-06-01", tt:"DE", desc:"Depósito - agencia sucursal", doc:"747655002", debe:null, haber:1500.00},
  {fecha:"2026-06-03", tt:"CQ", desc:"Pago a proveedor B", doc:"00468", debe:3300.00, haber:null},
  {fecha:"2026-06-03", tt:"NC", desc:"Corte POS - ventas del día", doc:"70881", debe:null, haber:7010.00},
  {fecha:"2026-06-08", tt:"CQ", desc:"Pago a proveedor D", doc:"00474", debe:5260.00, haber:null},
  {fecha:"2026-06-09", tt:"ND", desc:"Pago electrónico - servicios", doc:"550921", debe:1690.20, haber:null},
  {fecha:"2026-06-11", tt:"NC", desc:"Corte POS - ventas del día", doc:"70894", debe:null, haber:6820.00},
  {fecha:"2026-06-16", tt:"NC", desc:"Corte POS - ventas del día", doc:"70908", debe:null, haber:7290.00},
  {fecha:"2026-06-18", tt:"CQ", desc:"Pago a proveedor C", doc:"00479", debe:2275.00, haber:null},
  {fecha:"2026-06-20", tt:"ND", desc:"Comisión bancaria mensual", doc:"550934", debe:125.00, haber:null},
  {fecha:"2026-06-23", tt:"CQ", desc:"Pago a proveedor E", doc:"00485", debe:4890.00, haber:null},
  {fecha:"2026-06-24", tt:"ND", desc:"Nómina quincenal", doc:"550948", debe:14800.00, haber:null},
  {fecha:"2026-06-27", tt:"NC", desc:"Corte POS - ventas del día", doc:"70921", debe:null, haber:6540.00},
  {fecha:"2026-06-30", tt:"NC", desc:"Corte POS - ventas del día", doc:"70934", debe:null, haber:4980.00},
  {fecha:"2026-07-02", tt:"CQ", desc:"Pago a proveedor D", doc:"00490", debe:1970.00, haber:null},
  {fecha:"2026-07-03", tt:"NC", desc:"Corte POS - ventas del día", doc:"70948", debe:null, haber:7260.00},
  {fecha:"2026-07-07", tt:"ND", desc:"Pago electrónico - servicios", doc:"550961", debe:1934.10, haber:null},
  {fecha:"2026-07-08", tt:"CQ", desc:"Pago a proveedor A", doc:"00496", debe:5730.00, haber:null},
  {fecha:"2026-07-10", tt:"NC", desc:"Corte POS - ventas del día", doc:"70961", debe:null, haber:6410.00},
  {fecha:"2026-07-13", tt:"DE", desc:"Depósito - agencia sucursal", doc:"747681552", debe:null, haber:1350.00},
  {fecha:"2026-07-15", tt:"CQ", desc:"Pago a proveedor B", doc:"00501", debe:3020.00, haber:null},
  {fecha:"2026-07-17", tt:"NC", desc:"Corte POS - ventas del día", doc:"70974", debe:null, haber:7130.00},
  {fecha:"2026-07-20", tt:"ND", desc:"Comisión bancaria mensual", doc:"550975", debe:125.00, haber:null},
  {fecha:"2026-07-22", tt:"CQ", desc:"Pago a proveedor C", doc:"00507", debe:4420.00, haber:null},
  {fecha:"2026-07-24", tt:"ND", desc:"Nómina quincenal", doc:"550988", debe:15600.00, haber:null},
  {fecha:"2026-07-28", tt:"NC", desc:"Corte POS - ventas del día", doc:"70988", debe:null, haber:5780.00},
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
  {fecha:"2026-09-01", tt:"NC", desc:"Corte POS - ventas del día", doc:"71054", debe:null, haber:7620.00},
  {fecha:"2026-09-03", tt:"CQ", desc:"Pago a proveedor B", doc:"00517", debe:2100.00, haber:null},
  {fecha:"2026-09-04", tt:"NC", desc:"Corte POS - ventas del día", doc:"71068", debe:null, haber:6980.00},
  {fecha:"2026-09-07", tt:"ND", desc:"Pago electrónico - servicios", doc:"551043", debe:1910.40, haber:null},
  {fecha:"2026-09-10", tt:"DE", desc:"Depósito - agencia sucursal", doc:"747722619", debe:null, haber:1180.00},
  {fecha:"2026-09-11", tt:"NC", desc:"Corte POS - ventas del día", doc:"71081", debe:null, haber:7340.00},
  {fecha:"2026-09-14", tt:"ND", desc:"Comisión bancaria mensual", doc:"551057", debe:125.00, haber:null},
  {fecha:"2026-09-15", tt:"ND", desc:"Nómina quincenal", doc:"551070", debe:15400.00, haber:null},
  {fecha:"2026-09-15", tt:"CQ", desc:"Pago a proveedor A", doc:"00528", debe:2890.00, haber:null},
  {fecha:"2026-09-17", tt:"NC", desc:"Corte POS - ventas del día", doc:"71094", debe:null, haber:7300.00},
];
