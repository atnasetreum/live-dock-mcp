import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpApiService } from "./mcp-api.service";

const ROLES_RESOURCE_URI = "live-dock://catalog/roles";
const EVENT_TYPES_RESOURCE_URI = "live-dock://catalog/event-types";

export function registerMcpResources(
  server: McpServer,
  mcpApiService: McpApiService,
) {
  server.registerResource(
    "roles-catalog",
    ROLES_RESOURCE_URI,
    {
      title: "Catalogo de roles de live-dock",
      description:
        "Describe los roles operativos validos para consultar metricas de live-dock.",
      mimeType: "application/json",
    },
    async () => {
      const data = await mcpApiService.getRolesCatalog();

      return {
        contents: [
          {
            uri: ROLES_RESOURCE_URI,
            mimeType: "application/json",
            text: JSON.stringify(data.result, null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    "event-types-catalog",
    EVENT_TYPES_RESOURCE_URI,
    {
      title: "Catalogo de event_type de notification_metrics",
      description:
        "Lista los valores validos de event_type usados en notification_metrics.",
      mimeType: "application/json",
    },
    async () => {
      const data = await mcpApiService.getEventTypesCatalog();

      return {
        contents: [
          {
            uri: EVENT_TYPES_RESOURCE_URI,
            mimeType: "application/json",
            text: JSON.stringify(data.result, null, 2),
          },
        ],
      };
    },
  );
}
