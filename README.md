# live-dock-mcp

Servidor MCP por stdio para consultar metricas de live-dock-api en modo solo lectura.

## Estado del proyecto

- Paquete publicado en npm: @atnasetreum/descarga-material-mcp
- Runtime MCP: stdio
- Transport: @modelcontextprotocol/sdk
- Framework: NestJS

## Instalacion desde npm

```bash
npm i @atnasetreum/descarga-material-mcp
```

## Variables de entorno requeridas

```env
API_BASE_URL=http://localhost:4000
API_APP_KEY=replace-with-your-live-dock-api-app-key
LIVE_DOCK_USERNAME=replace-with-your-live-dock-username
LIVE_DOCK_PASSWORD=replace-with-your-live-dock-password
```

Puedes tomar como base [live-dock-mcp/.env.example](.env.example).

## Herramientas disponibles

1. get_delays_by_role

- Objetivo: resumen de retrasos por rol.
- Filtros: startDate, endDate, role, eventType.

2. get_bottleneck_snapshot

- Objetivo: detectar el cuello de botella actual en procesos EN_PROGRESO.
- Filtros: startDate, endDate.

3. get_role_workload_and_performance

- Objetivo: cruzar carga por rol vs tiempos para detectar saturacion.
- Filtros: startDate, endDate, role.

4. get_rejection_funnel

- Objetivo: identificar en que etapa/rol se concentra el rechazo.
- Filtros: startDate, endDate, role.

5. get_user_notification_effectiveness

- Objetivo: efectividad por usuario de notificaciones mostradas, confirmadas y sin accion.
- Filtros: startDate, endDate, role, userId.

## Resources disponibles

- roles-catalog
- event-types-catalog

## Preparacion local

```bash
pnpm install
pnpm build
```

## Ejecucion manual

```bash
node dist/main.js
```

## Configuracion MCP en Claude Desktop

Ejemplo funcional:

```json
{
  "mcpServers": {
    "proceso-de-recepcion": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@atnasetreum/descarga-material-mcp"],
      "env": {
        "API_BASE_URL": "http://localhost:4000",
        "API_APP_KEY": "replace-with-your-live-dock-api-app-key",
        "LIVE_DOCK_USERNAME": "replace-with-your-live-dock-username",
        "LIVE_DOCK_PASSWORD": "replace-with-your-live-dock-password"
      }
    }
  }
}
```

## Configuracion MCP en VS Code

El workspace incluye configuracion en [/.vscode/mcp.json](../.vscode/mcp.json).

Ejemplo:

```json
{
  "servers": {
    "proceso-de-recepcion": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/live-dock-mcp/dist/main.js"],
      "envFile": "${workspaceFolder}/live-dock-mcp/.env"
    }
  }
}
```

## Ejemplos de prompts

```text
Usa proceso-de-recepcion.get_bottleneck_snapshot y dime cual es el cuello de botella actual.

Usa proceso-de-recepcion.get_rejection_funnel de los ultimos 30 dias y dime en que etapa se concentran los rechazos.

Usa proceso-de-recepcion.get_user_notification_effectiveness y dime que usuarios tienen menor tasa de confirmacion de notificaciones.
```

## Publicacion

```bash
npm pack --dry-run
npm publish --access public
```

Este paquete usa publishConfig en package.json para publicar al registry oficial de npm.

## Notas operativas

- Este servidor esta pensado para stdio y se recomienda ejecutar node dist/main.js.
- Evitar pnpm start reduce ruido en stdout y mejora estabilidad del protocolo MCP.
- Si cambias codigo o definiciones de tools, recompila con pnpm build antes de reiniciar el servidor MCP.
- Nunca subas credenciales reales al README o a configuraciones versionadas.
