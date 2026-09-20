# Portal Bancario Simulado

Portal bancario de simulación construido para fines académicos, como parte del
proyecto de graduación de Ludwin Cortez (UMG) sobre Automatización Robótica de
Procesos (RPA) aplicada a la conciliación bancaria.

Este NO es el portal de ningún banco real. Reproduce, con marca y colores
genéricos, la estructura y el flujo de un portal bancario típico (inicio de
sesión, verificación en dos pasos, consulta de cuentas y descarga del estado
de cuenta) para que un bot de UiPath pueda probarse y grabarse contra él sin
depender de datos ni de una institución real.

## Datos de la simulación

Todos los datos son ficticios: cuenta `0786461650`, alias
`EMPRESA DE ALIMENTOS`, y montos de ejemplo inventados. No representan a
ninguna empresa o cuenta real.

Hay movimientos para **cada uno de los meses** que muestra la pantalla
"Consulta de movimientos" (abril a septiembre de 2026). Al consultar por mes,
el CSV descargado contiene solo los movimientos de ese mes, con el saldo
inicial correspondiente en el encabezado (el saldo final de un mes es el saldo
inicial del siguiente). Si no se elige ningún mes, se usa el más reciente.

El CSV solo se puede descargar cuando el **Modo de visualización** es
"Archivo (CSV/Excel)". Con "En Pantalla", XML, PDF o Texto no se genera el
archivo, el enlace "Descargar" se oculta y se muestra un aviso.

## Cómo usarlo

**En línea (GitHub Pages):** una vez publicado, el portal queda en
`https://lcortezd.github.io/portal-bancario-simulado/`. No se indexa en
buscadores (`noindex` y `robots.txt`) y muestra el aviso "ENTORNO DE SIMULACIÓN".

**Local:**

Abre `index.html` directamente en un navegador (no requiere servidor ni
instalación). Para iniciar sesión, cualquier código/usuario/contraseña no
vacíos son válidos; el token de verificación de la simulación es `135790`.

## Estructura del proyecto

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura/marcado de las pantallas |
| `css/styles.css` | Estilos |
| `js/script.js` | Lógica de la aplicación (navegación, login, generación del CSV) |
| `data/movimientos.js` | Movimientos del estado de cuenta de ejemplo (abril a septiembre 2026) y saldo al 1 de abril |

## Seguridad

El código aplica varias prácticas de seguridad del lado del cliente: una
Content-Security-Policy estricta, ningún manejador de eventos inline, bloqueo
temporal tras intentos fallidos del token de verificación, y cierre de sesión
automático por inactividad. Ver los comentarios en `js/script.js` para el
detalle.
