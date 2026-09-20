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

## Cómo usarlo

Abre `index.html` directamente en un navegador (no requiere servidor ni
instalación). Para iniciar sesión, cualquier código/usuario/contraseña no
vacíos son válidos; el token de verificación de la simulación es `135790`.

## Estructura del proyecto

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura/marcado de las pantallas |
| `css/styles.css` | Estilos |
| `js/script.js` | Lógica de la aplicación (navegación, login, generación del CSV) |
| `data/movimientos.js` | Movimientos del estado de cuenta de ejemplo |

## Seguridad

El código aplica varias prácticas de seguridad del lado del cliente: una
Content-Security-Policy estricta, ningún manejador de eventos inline, bloqueo
temporal tras intentos fallidos del token de verificación, y cierre de sesión
automático por inactividad. Ver los comentarios en `js/script.js` para el
detalle.
