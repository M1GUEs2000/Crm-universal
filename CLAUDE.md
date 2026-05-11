# CLAUDE.md - CRM Universal

Plantilla base reutilizable para construir CRMs por copia del proyecto. React + TypeScript + Tailwind CSS + Vite.

## Objetivo

El flujo esperado es:

1. Copiar carpeta.
2. Renombrar proyecto.
3. Ajustar `src/config/crm.config.ts`.
4. Ajustar tema y campos del dominio.
5. Empezar a desarrollar el CRM concreto.

La app no busca ser un SaaS generico publicado. Es una base interna para acelerar nuevos CRMs.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

En Windows, si PowerShell bloquea scripts:

```bash
npm.cmd run build
npm.cmd run lint
```

## Estructura principal

```txt
src/
  app/                  # providers y composicion principal
  components/
    crud/               # piezas comunes para CRUD
    ui/                 # sistema UI compartido
  config/
    crm.config.ts       # identidad, empresas, modo de datos y modulos
    entitySchemas.ts    # campos variables por entidad
    moduleRegistry.tsx  # rutas, iconos, subrutas y menu
  layout/               # shell visual
  modulos/              # dominios de negocio
  router/               # rutas generadas desde modulos
  services/             # interfaces, mocks y factory
  types/                # tipos de dominio
docs/
  ARRANQUE_NUEVO_CRM.md
  GUIA_MODULOS.md
```

## Reglas del template

- El core debe mantenerse pequeno, estable y reutilizable.
- Los modulos se registran en `moduleRegistry.tsx`.
- La visibilidad inicial vive en `crm.config.ts`.
- Administrador puede activar/desactivar modulos en ejecucion.
- Las empresas se declaran en `crm.config.ts`.
- La empresa seleccionada se guarda como preferencia local.
- Los CRUD simples deben usar `CrudListPage`.
- Los modulos complejos pueden tener pantallas personalizadas.
- Los servicios deben depender de interfaces en `src/services/contracts`.
- `serviceMode` decide si se usan mocks o una futura API.
- Los campos variables se documentan en `entitySchemas.ts` y se reflejan en tipos/formularios.

## Modulos actuales

| Modulo | Ruta | Estado |
|---|---|---|
| Dashboard | `/` | sistema |
| Clientes | `/clientes` | CRUD |
| Calendario | `/calendario` | calendario visual |
| Citas | `/citas` | CRUD |
| Productos | `/productos` | CRUD |
| Estadisticas | `/estadisticas` | reportes |
| Facturacion | `/facturacion` | submodulos |
| Configuracion | `/configuracion` | sistema |
| Administrador | `/administrador` | sistema |

## Guias obligatorias antes de crear variantes

- Lee `docs/ARRANQUE_NUEVO_CRM.md` para copiar y adaptar el template.
- Lee `docs/GUIA_MODULOS.md` para crear, quitar o extender modulos.

## Manejo de errores

- En servicios: propagar el error con contexto.
- En UI: mostrar feedback al usuario.
- No silenciar errores con `catch {}`.
- Si se usa logger temporal: `console.error('[Modulo] descripcion', error)`.

## Seguridad

- No exponer tokens en el cliente.
- Usar variables `VITE_*` solo para datos publicos del frontend.
- No hardcodear credenciales.
- Validar input antes de enviarlo a servicios externos.
