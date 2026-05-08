# CLAUDE.md — CRM Universal

Plantilla base reutilizable para proyectos CRM. React + TypeScript + Tailwind CSS (Vite). Para contexto de negocio, decisiones y estado del proyecto ver el vault: `d:\Obsidian\Bovedá\proyectos\crm-universal`.

## Build & Run

```bash
npm install
npm run dev       # servidor de desarrollo (Vite)
npm run build     # build de producción
npm run preview   # preview del build
```

## Estructura de carpetas

```
crm-universal/
├── src/
│   ├── modulos/
│   │   ├── dashboard/
│   │   ├── clientes/
│   │   ├── calendario/
│   │   ├── citas/
│   │   ├── productos/
│   │   ├── estadisticas/
│   │   ├── facturacion/      ← módulo activable (feature flag)
│   │   └── configuracion/
│   ├── components/           ← componentes compartidos
│   ├── services/             ← capa de servicios (interfaces + mock)
│   ├── types/                ← tipos e interfaces TypeScript
│   ├── config/               ← feature flags y configuración
│   └── router/               ← rutas de la app
```

## Módulos

| Módulo | Ruta | Activable | Descripción |
|---|---|---|---|
| Dashboard | `/` | siempre | KPIs y resumen general |
| Clientes | `/clientes` | siempre | Lista y ficha de clientes |
| Calendario | `/calendario` | siempre | Vista de citas y eventos |
| Citas | `/citas` | siempre | CRUD de citas (pendiente → confirmada → cancelada) |
| Productos/Servicios | `/productos` | siempre | Catálogo con precios |
| Estadísticas | `/estadisticas` | siempre | Métricas y reportes |
| Facturación | `/facturacion` | ✅ feature flag | Placeholder → conecta a Facturación Universal API |
| Configuración | `/configuracion` | siempre | Nombre, logo, módulos activos |

## Reglas de código (OBLIGATORIAS)

### Manejo de errores

- En servicios: propagar el error con contexto, nunca silenciar con `catch {}`
- En UI: mostrar feedback al usuario, no pantallas en blanco
- Con logger: `console.error('[Módulo] descripción', error)`

### Seguridad

- **API calls**: nunca exponer tokens en el cliente — usar variables de entorno `VITE_*`
- **Input del usuario**: validar antes de enviar a la API
- **Credenciales**: nunca hardcodeadas — siempre en `.env.local`

## Cerebro del proyecto

> ⚠️ **OBLIGATORIO leer el vault PRIMERO.** Todo lo que no sea código técnico vive ahí: estado actual, pendientes, decisiones de arquitectura, análisis y contexto de negocio. No re-derivar esa información leyendo código — es un gasto de tokens innecesario.

### Archivos de entrada obligatorios (leer en este orden)

| Archivo | Qué contiene |
|---|---|
| `d:\Obsidian\Bovedá\proyectos\crm-universal\README.md` | Estado actual, decisiones clave, stack |
| `d:\Obsidian\Bovedá\proyectos\crm-universal\arquitectura-crm-universal.md` | Mapa de módulos y qué nodos están ✅ vs ⚠️ |
| `d:\Obsidian\Bovedá\proyectos\crm-universal\tareas.md` | Tareas pendientes |
| `d:\Obsidian\Bovedá\CLAUDE.md` | Convenciones del vault — leer solo si hay dudas de estructura |

**Flujo de sesión:**
1. Leer `README.md` → estado actual
2. Leer `arquitectura-crm-universal.md` → qué nodos están ✅ vs ⚠️
3. Ir al nodo `nodos/[modulo].md` si está ✅ — confiar en él, no leer código fuente
4. Si el nodo está ⚠️ → leer código fuente y documentar el nodo al terminar
5. Al cerrar sesión → actualizar `## 📌 Estado actual` en README

### Post-commit — mantener nodos sincronizados

Después de cada `git push`, GitHub Actions postea un comentario en el commit listando qué nodos del vault pueden estar desactualizados. **Revisar ese comentario y actualizar los nodos afectados en Obsidian antes de cerrar la sesión.** Ver `.github/node-map.yml` para el mapeo completo de archivos → nodos.
