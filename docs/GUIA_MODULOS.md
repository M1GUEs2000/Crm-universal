# Guia de modulos

Un modulo debe concentrar su UI, configuracion y reglas de dominio dentro de `src/modulos/[modulo]`.

## Crear un modulo simple

1. Crea `src/modulos/[modulo]/index.tsx`.
2. Crea `src/modulos/[modulo]/config.tsx` si es CRUD o si necesita textos/columnas/KPIs.
3. Crea tipos en `src/types/[modulo].ts`.
4. Exporta esos tipos desde `src/types/index.ts`.
5. Crea interfaz de servicio en `src/services/interfaces/I[Modulo]Service.ts`.
6. Exporta la interfaz desde `src/services/contracts/index.ts`.
7. Crea mock en `src/services/mock/Mock[Modulo]Service.ts`.
8. Registra el servicio en `src/services/serviceFactory.ts`.
9. Agrega el modulo en `src/config/moduleRegistry.tsx`.
10. Agrega visibilidad en `src/config/crm.config.ts`.

## Registro del modulo

Ejemplo en `src/config/moduleRegistry.tsx`:

```tsx
{
  id: 'proyectos',
  label: 'Proyectos',
  defaultLabel: 'Proyectos',
  path: '/proyectos',
  defaultVisibility: 'enabled',
  icon: Briefcase,
  element: lazyElement(() => import('@/modulos/proyectos')),
}
```

## Modulos con subrutas

Usa `routes` para rutas internas y `navItems` cuando el menu deba desplegarse.

```tsx
{
  id: 'facturacion',
  label: 'Facturacion',
  defaultLabel: 'Facturacion',
  path: '/facturacion',
  defaultVisibility: 'enabled',
  icon: Receipt,
  element: <Navigate to="/facturacion/documentos-electronicos" replace />,
  routes: [
    { path: 'facturacion/documentos-electronicos', element: lazyElement(() => import('@/modulos/facturacion')) },
    { path: 'facturacion/consultas', element: lazyElement(() => import('@/modulos/facturacion/ConsultasFacturacion')) },
  ],
  navItems: [
    { label: 'Documentos electronicos', path: '/facturacion/documentos-electronicos' },
    { label: 'Consultas', path: '/facturacion/consultas' },
  ],
}
```

## Quitar un modulo

1. Ponlo como `disabled` en `src/config/crm.config.ts`.
2. Si ya no se usara en ningun CRM, elimina su entrada de `moduleRegistry.tsx`.
3. Elimina su carpeta en `src/modulos`.
4. Elimina tipos, servicios e imports asociados.
5. Ejecuta `npm.cmd run lint` y `npm.cmd run build`.

## Patron CRUD recomendado

Para entidades simples, reutiliza `CrudListPage`.

El modulo necesita:

- `index.tsx`: conecta servicio, columnas y formulario.
- `config.tsx`: textos, filtros, busqueda y columnas.
- `[Entidad]Form.tsx`: formulario con validacion local.
- Servicio que implemente `listar`, `crear`, `actualizar` y `eliminar`.

## Patron para formularios variables

Cuando un CRM tenga campos distintos:

1. Actualiza `src/config/entitySchemas.ts`.
2. Ajusta el tipo de entidad en `src/types`.
3. Ajusta el formulario del modulo.
4. Ajusta `getSearchText`, filtros y columnas en `config.tsx`.

Si varios CRMs repiten la necesidad de formularios completamente dinamicos, el siguiente paso natural es crear un `DynamicEntityForm` que renderice campos desde `entitySchemas`.
