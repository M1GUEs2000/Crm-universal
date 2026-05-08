# CRM Universal

Plantilla base para construir CRMs modulares con React, TypeScript, Tailwind CSS y Vite.

La idea del proyecto no es imponer un unico modelo de cliente, producto o cita. El objetivo es entregar un nucleo comun para navegacion, layout, tema, componentes UI, servicios y patrones CRUD, permitiendo que cada CRM active sus propios modulos y defina sus propios campos de negocio.

## Estado actual

- Base React + TypeScript + Vite.
- Layout con sidebar y navbar.
- Modulos iniciales: dashboard, clientes, calendario, citas, productos, estadisticas, facturacion y configuracion.
- Sistema inicial de modulos activables en `src/config/modules.ts`.
- Componentes UI compartidos en `src/components/ui`.
- Componentes CRUD reutilizables en `src/components/crud`.
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
  components/
    crud/       # piezas comunes para pantallas CRUD
    ui/         # botones, inputs, modales, tablas, tabs, etc.
  config/
    modules.ts # registro de modulos activos/bloqueados
  modulos/     # pantallas y logica por dominio
  router/      # rutas generadas desde la configuracion de modulos
  services/    # interfaces y mocks
  types/       # tipos comunes y tipos de dominio actuales
```

## Principios

- El core debe ser estable y reutilizable.
- Los modulos deben poder activarse, ocultarse o bloquearse desde configuracion.
- Cada CRM puede definir campos distintos segun su dominio.
- Los CRUD simples deben compartir patrones visuales y de comportamiento.
- Los modulos complejos pueden tener pantallas personalizadas sin romper el layout ni el tema.
- La capa de servicios debe permitir cambiar mocks por API real sin reescribir la UI.

## Siguiente direccion

La siguiente evolucion recomendada es separar el nucleo del template de los modulos de negocio:

- `app/` para providers y arranque.
- `layout/` para sidebar, navbar y shell visual.
- `modules/` o `modulos/` con configuracion propia por dominio.
- `services/contracts`, `services/mock` y `services/http`.
- `theme/` o `config/theme.config.ts` para branding reusable.
