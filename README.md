# live-dock-mcp

Servidor MCP por `stdio` para consultar metricas de `live-dock-api` sin acceso de escritura.

## Herramienta disponible

- `get_delays_by_role`: autentica contra la API con credenciales definidas en variables de entorno, obtiene un bearer token read-only y consulta retrasos agrupados por rol.
- `get_bottleneck_snapshot`: identifica el cuello de botella actual usando solo procesos en progreso y su tiempo desde el ultimo evento.
- `get_role_workload_and_performance`: cruza carga por rol (usuarios activos, volumen de eventos y metricas) con tiempos de reaccion para detectar saturacion.
- `get_rejection_funnel`: muestra cuantos procesos terminan en rechazado y en que etapa/rol ocurre el rechazo para atacar causas raiz.
- `get_user_notification_effectiveness`: mide la efectividad de notificaciones por usuario (mostradas, confirmadas, no accionadas y tiempos de reaccion).

## Variables de entorno

Este proyecto usa estas variables:

```env
API_BASE_URL=http://localhost:4000
API_APP_KEY=replace-with-your-live-dock-api-app-key
LIVE_DOCK_USERNAME=replace-with-your-live-dock-username
LIVE_DOCK_PASSWORD=replace-with-your-live-dock-password
```

Puedes tomar como base [live-dock-mcp/.env.example](.env.example).

## Preparacion local

```bash
pnpm install
pnpm build
```

## Ejecucion manual

```bash
node dist/main.js
```

## Configuracion para VS Code

El workspace ya incluye una configuracion lista en [/.vscode/mcp.json](../.vscode/mcp.json).

Usa este formato si quieres copiarla a tu perfil global de VS Code:

```json
{
  "servers": {
    "liveDockMetrics": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/live-dock-mcp/dist/main.js"],
      "envFile": "${workspaceFolder}/live-dock-mcp/.env"
    }
  }
}
```

## Como activarlo en VS Code

1. Ejecuta `pnpm build` dentro de `live-dock-mcp`.
2. Abre el comando `MCP: Open Workspace Folder MCP Configuration` para revisar o ajustar `mcp.json`.
3. Inicia el servidor desde `MCP: List Servers` o desde el editor de `mcp.json`.
4. Confirma la confianza del servidor la primera vez.

## Ejemplo de uso en chat

Puedes pedir algo como esto en Copilot Chat:

```text
Usa liveDockMetrics.get_delays_by_role con role "LOGISTICA" y dame un resumen de los retrasos.

Usa liveDockMetrics.get_bottleneck_snapshot y dime cual es el cuello de botella actual.

Usa liveDockMetrics.get_role_workload_and_performance y dime que rol esta mas saturado considerando carga y tiempos de reaccion.

Usa liveDockMetrics.get_rejection_funnel y dime en que etapa y rol se concentran los rechazos.

Usa liveDockMetrics.get_user_notification_effectiveness y dime que usuarios tienen menor tasa de confirmacion de notificaciones.
```

## Notas

- Este servidor esta pensado para `stdio`, por eso se ejecuta con `node dist/main.js` en lugar de `pnpm start`.
- Evitar `pnpm start` reduce ruido en stdout y hace mas estable el protocolo MCP.
- Si cambias el codigo del servidor, vuelve a ejecutar `pnpm build` antes de reiniciarlo en VS Code.
