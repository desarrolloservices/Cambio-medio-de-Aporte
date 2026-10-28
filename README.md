# Actualización de medio de aporte

Aplicación web de AFP Atlántida para que un afiliado, mediante un enlace seguro, consulte y administre el medio de débito asociado a una cuenta de aporte.

La aplicación permite registrar tarjetas de crédito o débito y cuentas de ahorro. También permite consultar, editar y desactivar los registros existentes conforme a las capacidades del servicio de backend.

## Documentación

- [Guía de usuario](docs/GUIA_USUARIO.md): pasos para completar el formulario y resolver situaciones comunes.
- [Documentación técnica](docs/DOCUMENTACION_TECNICA.md): arquitectura, configuración, integraciones, seguridad y mantenimiento.

## Inicio rápido para desarrollo

1. Instale Node.js compatible con Create React App 5.
2. Ejecute `npm install`.
3. Configure las variables `REACT_APP_*` descritas en la documentación técnica. No agregue secretos al repositorio.
4. Ejecute `npm start`.

Para validar tipos se puede ejecutar `npx tsc --noEmit`. Para construir el paquete de producción use `npm run build`.

## Tecnologías principales

- React 18 y TypeScript
- Material UI
- Axios
- Veriff, cuando el canal del enlace lo requiere
