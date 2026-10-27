# Documentación técnica

## Alcance

Proyecto React para administrar medios de aporte de AFP Atlántida mediante un enlace de sesión. La interfaz permite consultar productos y registros existentes, registrar un medio de pago, actualizarlo o desactivarlo.

Los medios disponibles en la interfaz son `TARJETA` (tarjeta de crédito o débito) y `CUENTA_AHORRO` (cuenta de ahorro para débito).

## Stack y comandos

| Área | Tecnología |
| --- | --- |
| UI | React 18, TypeScript y Material UI 5 |
| Datos | Axios |
| Formato de importe | `react-number-format` |
| Máscaras | `react-imask` |
| Validación de identidad | SDK Veriff |
| Build | Create React App 5 |

```bash
npm install
npm start
npx tsc --noEmit
npm test
npm run build
```

## Arquitectura

```text
App
 ├─ FormProvider                 estado compartido del formulario
 ├─ useValidateToken             canje y validación de la sesión
 ├─ useProductos                 carga de cuentas AFP
 ├─ ClienteProvider              datos básicos del cliente
 └─ Form1
     ├─ VeriffComponentNew       validación de identidad para canal Link
     ├─ useExtractRawData        consulta de medios ya registrados
     ├─ EditDialog               actualización de registros
     └─ ConfirmDialog            confirmación de acciones
```

| Archivo | Responsabilidad |
| --- | --- |
| `src/App.tsx` | Inicializa proveedores, sesión, carga de cuentas y pantalla principal. |
| `src/Components/Form1.tsx` | Formulario, validaciones y registro de tarjeta/cuenta de ahorro. |
| `src/Context/FormContext.tsx` | Contrato y estado global del formulario. |
| `src/Data/GetDatosClientes.tsx` | Clientes Axios y funciones de integración. |
| `src/Hooks/UseValidateTk.tsx` | Canje del código de URL y validación de sesión. |
| `src/Hooks/UseProductosCliente.tsx` | Adaptación de productos del cliente al tipo `cuenta`. |
| `src/Hooks/useExtractRawData.tsx` | Adaptación de los medios existentes para el grid. |
| `src/Utils/encryptWithPublicKey.ts` | Cifrado RSA de datos sensibles de tarjeta con `public.pem`. |

## Flujo de sesión y datos

1. `useValidateToken` lee `code` o `id` de la URL.
2. Si no existe una sesión válida, `exchangeCodeOnce` canjea el código por una sesión con cookies.
3. Se valida la sesión con `REACT_APP_API_TOKEN`. Si el canal es `Link`, la interfaz exige Veriff antes de mostrar el formulario.
4. `useProductos` consulta las cuentas mediante `REACT_APP_API_PRODUCTOS`.
5. Al seleccionar una cuenta, `useExtractRawData` consulta los medios registrados mediante `REACT_APP_API_GET`.
6. El registro se envía a `REACT_APP_API_POST`; edición y baja se envían a `REACT_APP_API_UPD`.

## Medio de pago: contrato de frontend

El estado `FormData` contiene `metodoPago` y `cuentaAhorro` en `src/Context/FormContext.tsx`.

### Tarjeta

- La aplicación valida número, marca permitida y fecha de vencimiento.
- Antes del envío, cifra `Tarjeta` y `Vencimiento` usando la clave pública `public/public.pem`.
- El cuerpo enviado deja esos dos campos vacíos y transmite `EncryptedPayload`.
- Usa `TipoDebito: "TC"`.

### Cuenta de ahorro

- Se presenta el selector de cuenta, el monto, la frecuencia (`MENSUAL` o `UNICO`) y el día de débito.
- No se muestran ni se cifran campos de tarjeta.
- El frontend envía `TipoDebito: "CA"`, la cuenta elegida en el campo heredado `Tarjeta` y el monto ingresado.

> Importante: `Tarjeta` y `Monto` son nombres heredados del contrato actual del endpoint. Antes de cambiar la API o habilitar una integración productiva nueva, el equipo backend debe confirmar que acepta `TipoDebito: "CA"`, el número de cuenta en `Tarjeta` y el monto ingresado. Se recomienda evolucionar el contrato para incorporar un campo explícito como `CuentaDebito`.

## Integraciones y variables de entorno

Las instancias activas de Axios usan las siguientes variables. Sus valores no deben documentarse ni versionarse si contienen dominios internos o secretos.

| Variable | Uso |
| --- | --- |
| `REACT_APP_API_TOKEN` | Validación de sesión. |
| `REACT_APP_API_TK` | Canje del código del enlace. |
| `REACT_APP_API_CLIENTE` | Datos del cliente. |
| `REACT_APP_API_PRODUCTOS` | Productos/cuentas del cliente. |
| `REACT_APP_API_GET` | Consulta de medios registrados. |
| `REACT_APP_API_POST` | Registro de un medio de pago. |
| `REACT_APP_API_UPD` | Actualización o desactivación. |
| `REACT_APP_API_VERIFF` | Inicio de validación Veriff. |
| `REACT_APP_API_WHOOK` | Consulta de estado Veriff y solicitud de nuevo formulario. |
| `REACT_APP_API_LGT` | Cierre de sesión. |
| `REACT_APP_API_SECRET_KEY` | Encabezado `x-api-key` de las llamadas al BFF. |

## Seguridad

- La sesión utiliza `withCredentials: true`; el backend debe limitar orígenes CORS y cookies al dominio correcto.
- Los números y vencimientos de tarjeta se cifran en el navegador con RSA antes de enviarse.
- No registrar en consola cuerpos de solicitudes, tokens, tarjetas, cuentas ni respuestas que los contengan.
- Las variables `REACT_APP_*` se incorporan al bundle de frontend. `REACT_APP_API_SECRET_KEY` no debe considerarse un secreto efectivo: la autorización sensible debe imponerse en el BFF y mediante la sesión.
- `clearSessionCookies` elimina cookies manipulables por frontend y llama al endpoint de logout antes de redirigir al sitio institucional.

## Cálculo de seguro

El producto incluye `tiene_seguro`, `prima` y `tipo_seguro`. El frontend aplica la regla únicamente para cuentas con seguro, usando el monto del aporte como base:

| Tipo de seguro | Prima | Suma asegurada |
| --- | --- | --- |
| 1 | `0` | `0` |
| 2 | Recalcula `(aporte × 300 / 1000) × 0.40`, redondeada a dos decimales. Tope: L 1,000 o US$40. | Recalcula `aporte × 300`. Tope: L 2,500,000 o US$100,000. |
| 3 | Conserva el valor actual | Conserva el valor actual |
| Sin seguro | `0` | `0` |

Para los tipos 1, 3 y sin seguro, el backend debe actualizar `MON_APORTE_INI` con el aporte recibido. El frontend no infiere campos adicionales del contrato de backend.

## Pruebas y mantenimiento

Antes de entregar cambios:

1. Ejecute `npx tsc --noEmit`.
2. Ejecute las pruebas con `npm test -- --watchAll=false`.
3. Genere el paquete con `npm run build`.
4. Pruebe manualmente ambos métodos de pago, los mensajes de error y la expiración de sesión.

Casos mínimos para el nuevo método de cuenta de ahorro:

- Mostrar el selector y ocultar campos exclusivos de tarjeta.
- Exigir la selección de la cuenta de ahorro.
- Enviar `TipoDebito: "CA"` con el valor seleccionado.
- Confirmar actualización del grid tras una respuesta satisfactoria.
- Verificar el comportamiento de editar y eliminar un registro `CA` contra el contrato real del backend.

## Limitaciones conocidas

- El grid y `EditDialog` fueron diseñados originalmente para tarjetas. Antes de permitir edición específica de cuentas de ahorro, deben adaptarse etiquetas, validaciones y cifrado condicional.
- El tipo de cuenta que se presenta como cuenta de ahorro depende de la respuesta de productos. El frontend actual no recibe una clasificación explícita de "ahorro"; si la API retorna otros productos elegibles, el backend debe exponer un atributo de tipo para filtrarlos.
- Create React App está en mantenimiento. Para una modernización futura, evaluar la migración a Vite u otro empaquetador aprobado.
