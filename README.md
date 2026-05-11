# CRM Universal

Plantilla base para construir CRMs modulares con React, TypeScript, Tailwind CSS y Vite.

La idea del proyecto no es imponer un unico modelo de cliente, producto o cita. El objetivo es entregar un nucleo comun para navegacion, layout, tema, componentes UI, servicios y patrones CRUD, permitiendo que cada CRM active sus propios modulos y defina sus propios campos de negocio.

## Estado actual

- Base React + TypeScript + Vite.
- Layout con sidebar y navbar.
- Modulos iniciales: dashboard, clientes, calendario, citas, productos, estadisticas, facturacion y configuracion.
- Facturacion incluye emision mock de facturas, notas de credito y retenciones, alineada con los contratos de FacturacionUniversal.
- Sistema de modulos activables desde `src/config/crm.config.ts` y desde Administrador.
- Seleccion de empresa global desde Administrador.
- Componentes UI compartidos en `src/components/ui`.
- Componentes CRUD reutilizables en `src/components/crud`.
- `CrudListPage` estandariza pantallas CRUD simples con servicio, columnas, filtros y formulario por modulo.
- Declaracion base de campos variables en `src/config/entitySchemas.ts`.
- Servicios mock con interfaces para futura conexion HTTP.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

En Windows, si PowerShell bloquea `npm.ps1`, usa:

```bash
npm.cmd run build
npm.cmd run lint
```

## Estructura

```txt
src/
  app/
    App.tsx     # providers y composicion principal de la app
  components/
    crud/       # piezas comunes, contratos y helpers para pantallas CRUD
    ui/         # botones, inputs, modales, tablas, tabs, etc.
  config/
    crm.config.ts      # nombre, empresas, modo de datos y modulos activos
    entitySchemas.ts   # mapa base de campos variables por entidad
    moduleRegistry.tsx # registro de modulos, rutas, iconos y componentes
    modules.ts         # compatibilidad para consumir la lista de modulos
  docs/
    ARRANQUE_NUEVO_CRM.md
    GUIA_MODULOS.md
  layout/
    Layout.tsx
    Navbar.tsx
    Sidebar.tsx
  modulos/     # pantallas y logica por dominio
  router/      # rutas generadas desde la configuracion de modulos
  services/    # contracts, factory de servicios y mocks
  types/       # tipos comunes y tipos de dominio actuales
```

## Principios

- El core debe ser estable y reutilizable.
- Los modulos deben poder activarse, ocultarse o bloquearse desde configuracion.
- Cada CRM puede definir campos distintos segun su dominio.
- Los CRUD simples deben compartir patrones visuales y de comportamiento.
- Los modulos complejos pueden tener pantallas personalizadas sin romper el layout ni el tema.
- La capa de servicios debe permitir cambiar mocks por API real sin reescribir la UI.
- El router y el sidebar deben derivarse del registro de modulos, no de listas duplicadas.
- Cada entidad puede declarar sus columnas, filtros, textos y busqueda desde su propio `config.tsx`.
- Los modulos no CRUD tambien pueden tener `config.tsx` para declarar KPIs, series o secciones propias sin forzarlos al patron CRUD.

## Adaptar a otro CRM

Para crear una variante del template para otro dominio:

1. Edita `src/config/crm.config.ts`.
2. Cambia `appName`, `shortName` y `description`.
3. Define `serviceMode`.
4. Reemplaza `companies` y `defaultCompanyId`.
5. Ajusta el tema global en `src/index.css`, dentro del bloque `@theme`.
6. Activa, desactiva o bloquea modulos desde `modules`.
7. Ajusta los labels si el dominio usa otro lenguaje. Ejemplo: `clientes` puede mostrarse como `Pacientes`, `Alumnos`, `Propietarios` o `Contactos`.
8. Revisa `src/config/entitySchemas.ts` para declarar campos variables por entidad.
9. En cada modulo, modifica su `config.tsx` para declarar columnas, filtros, busqueda y textos propios del dominio.
10. Si el formulario necesita campos nuevos, edita el formulario del modulo y sus tipos locales.

Guias operativas:

- `docs/ARRANQUE_NUEVO_CRM.md`: checklist para copiar y arrancar otro CRM.
- `docs/GUIA_MODULOS.md`: como crear, quitar o extender modulos.

Ejemplo parcial:

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

## Nivel actual como template interno

Este proyecto ya esta pensado para el flujo `copiar carpeta -> renombrar -> ajustar configuracion -> empezar CRM`.

Las piezas principales de ese flujo son:

- `crm.config.ts`: identidad, empresas, modo de datos y modulos.
- `moduleRegistry.tsx`: rutas, iconos y submenus.
- `entitySchemas.ts`: mapa inicial de campos variables.
- `serviceFactory.ts`: punto unico para cambiar mock por API.
- `docs/ARRANQUE_NUEVO_CRM.md`: checklist de arranque.
- `docs/GUIA_MODULOS.md`: patron para modulos.

## Siguiente direccion

La siguiente evolucion recomendada es separar el nucleo del template de los modulos de negocio:

- `app/` para providers y arranque.
- `layout/` para sidebar, navbar y shell visual.
- `modules/` o `modulos/` con configuracion propia por dominio.
- `services/contracts`, `services/mock` y `services/http`.
- `theme/` o `config/theme.config.ts` para branding reusable.
- `DynamicEntityForm` si varios proyectos necesitan formularios 100% generados desde `entitySchemas`.
