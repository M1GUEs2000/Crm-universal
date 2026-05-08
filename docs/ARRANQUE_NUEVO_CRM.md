# Arranque de un nuevo CRM

Esta guia es para el flujo de trabajo principal del template: copiar la carpeta, renombrar el proyecto y empezar una variante nueva sin reconstruir el core.

## Checklist rapido

1. Copia la carpeta del proyecto.
2. Cambia el nombre en `package.json`.
3. Edita `src/config/crm.config.ts`.
4. Cambia `appName`, `shortName` y `description`.
5. Define `serviceMode`.
6. Reemplaza `companies` con las empresas reales o de prueba.
7. Ajusta `defaultCompanyId`.
8. Activa, desactiva o bloquea modulos en `modules`.
9. Cambia labels de modulos si el dominio lo necesita.
10. Ajusta el tema en `src/index.css`, bloque `@theme`.
11. Revisa campos variables en `src/config/entitySchemas.ts`.
12. Ajusta formularios especificos cuando el dominio tenga reglas especiales.
13. Ejecuta `npm.cmd run lint`.
14. Ejecuta `npm.cmd run build`.

## Archivo principal

La mayor parte del arranque vive en `src/config/crm.config.ts`.

```ts
export const crmConfig = {
  appName: 'CRM Clinica',
  shortName: 'Clinica',
  description: 'Gestion de pacientes, citas y servicios medicos.',
  serviceMode: 'mock',
  defaultCompanyId: 'matriz',
  companies: [
    { id: 'matriz', nombre: 'Clinica Matriz', ruc: '1799999999001', estab: '001', ptoEmi: '001' },
  ],
  modules: {
    clientes: { label: 'Pacientes', visibility: 'enabled' },
    productos: { label: 'Servicios', visibility: 'enabled' },
    facturacion: { visibility: 'disabled' },
  },
}
```

## Visibilidad de modulos

- `enabled`: aparece en menu y tiene rutas activas.
- `disabled`: no aparece y queda protegido por ruta.
- `locked`: aparece bloqueado en el menu.

Desde el modulo Administrador tambien se pueden activar o desactivar modulos durante la ejecucion. Esa preferencia queda guardada en `localStorage`.

## Multiempresa

Las empresas se declaran en `crm.config.ts`. La seleccion actual se guarda en `localStorage` y se usa en:

- Barra superior.
- Administrador.
- Base de documentos de facturacion.

Cuando conectes backend, el siguiente paso es enviar `companyId` o `ruc` en los servicios que deban separar datos por empresa.

## Modo de datos

`serviceMode` define la fuente de datos.

- `mock`: servicios actuales en memoria.
- `api`: reservado para implementar adaptadores HTTP.

La fabrica esta en `src/services/serviceFactory.ts`. Para conectar API real, crea servicios en `src/services/http` que implementen las mismas interfaces de `src/services/contracts`.

## Campos variables

`src/config/entitySchemas.ts` deja una declaracion base de campos por entidad. Sirve como mapa para adaptar rapidamente formularios, busquedas, columnas o futuros formularios dinamicos.

No todos los formularios estan generados automaticamente desde ese archivo todavia. La regla practica es:

- Cambia `entitySchemas` para documentar la forma de la entidad del CRM nuevo.
- Ajusta el formulario del modulo cuando haya validaciones o UI especifica.
- Mantén tipos en `src/types` alineados con esos campos.
