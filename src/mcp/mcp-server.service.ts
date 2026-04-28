import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { McpApiService } from "./mcp-api.service";

const ROLES_RESOURCE_URI = "live-dock://catalog/roles";
const EVENT_TYPES_RESOURCE_URI = "live-dock://catalog/event-types";

const ROLE_CATALOG = {
  roles: [
    {
      key: "VIGILANCIA",
      name: "Vigilancia",
      description: "Registra ingresos y valida entregas de ticket.",
    },
    {
      key: "LOGISTICA",
      name: "Logistica",
      description: "Autoriza ingresos y gestiona captura de peso en SAP.",
    },
    {
      key: "CALIDAD",
      name: "Calidad",
      description: "Confirma analisis, aprueba material y libera en SAP.",
    },
    {
      key: "PRODUCCION",
      name: "Produccion",
      description: "Confirma, inicia y finaliza la descarga de material.",
    },
  ],
} as const;

const EVENT_TYPE_CATALOG = {
  eventTypes: [
    {
      key: "NOTIFICATION_SHOWN",
      description: "La notificacion fue mostrada al usuario.",
    },
    {
      key: "ACTION_CLICKED_CONFIRM",
      description: "El usuario dio clic en la accion de confirmacion.",
    },
    {
      key: "NOTIFICATION_CLICKED_NOT_ACTION",
      description:
        "Se hizo clic en la notificacion fuera de la accion principal.",
    },
    {
      key: "NOTIFICATION_CLOSED",
      description: "La notificacion fue cerrada por el usuario o el sistema.",
    },
  ],
} as const;

@Injectable()
export class McpServerService implements OnModuleDestroy {
  private server?: McpServer;

  constructor(private readonly mcpApiService: McpApiService) {}

  async start() {
    this.server = new McpServer({
      name: "live-dock-mcp",
      version: "0.1.0",
    });

    this.server.registerResource(
      "roles-catalog",
      ROLES_RESOURCE_URI,
      {
        title: "Catalogo de roles de live-dock",
        description:
          "Describe los roles operativos validos para consultar metricas de live-dock.",
        mimeType: "application/json",
      },
      () => ({
        contents: [
          {
            uri: ROLES_RESOURCE_URI,
            mimeType: "application/json",
            text: JSON.stringify(ROLE_CATALOG, null, 2),
          },
        ],
      }),
    );

    this.server.registerResource(
      "event-types-catalog",
      EVENT_TYPES_RESOURCE_URI,
      {
        title: "Catalogo de event_type de notification_metrics",
        description:
          "Lista los valores validos de event_type usados en notification_metrics.",
        mimeType: "application/json",
      },
      () => ({
        contents: [
          {
            uri: EVENT_TYPES_RESOURCE_URI,
            mimeType: "application/json",
            text: JSON.stringify(EVENT_TYPE_CATALOG, null, 2),
          },
        ],
      }),
    );

    this.server.tool(
      "get_delays_by_role",
      "Obtiene metricas de retraso agrupadas por rol desde la API de live-dock usando credenciales configuradas en variables de entorno.",
      {
        startDate: z
          .string()
          .datetime()
          .optional()
          .describe("Fecha inicial ISO 8601"),
        endDate: z
          .string()
          .datetime()
          .optional()
          .describe("Fecha final ISO 8601"),
        role: z
          .enum(["VIGILANCIA", "LOGISTICA", "CALIDAD", "PRODUCCION"])
          .optional()
          .describe("Filtra por rol"),
        eventType: z
          .enum([
            "NOTIFICATION_SHOWN",
            "ACTION_CLICKED_CONFIRM",
            "NOTIFICATION_CLICKED_NOT_ACTION",
            "NOTIFICATION_CLOSED",
          ])
          .optional()
          .describe("Filtra por tipo de evento de notificacion"),
      },
      async (args) => {
        const result = await this.mcpApiService.getDelaysByRole(args);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    );

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async onModuleDestroy() {
    await this.server?.close();
  }
}
