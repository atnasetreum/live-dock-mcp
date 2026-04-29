import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { McpApiService } from "./mcp-api.service";

export function registerMcpTools(
  server: McpServer,
  mcpApiService: McpApiService,
) {
  server.tool(
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
      const result = await mcpApiService.getDelaysByRole(args);

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

  server.tool(
    "get_bottleneck_snapshot",
    "Obtiene un snapshot del cuello de botella actual para procesos EN_PROGRESO.",
    {
      startDate: z
        .string()
        .datetime()
        .optional()
        .describe(
          "Fecha inicial ISO 8601 para filtrar por fecha del ultimo evento",
        ),
      endDate: z
        .string()
        .datetime()
        .optional()
        .describe(
          "Fecha final ISO 8601 para filtrar por fecha del ultimo evento",
        ),
    },
    async (args) => {
      const result = await mcpApiService.getBottleneckSnapshot(args);

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

  server.tool(
    "get_role_workload_and_performance",
    "Cruza carga por rol (usuarios activos, volumen de eventos/metricas) contra tiempos de reaccion para detectar saturacion.",
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
        .describe("Filtra por un rol especifico"),
    },
    async (args) => {
      const result = await mcpApiService.getRoleWorkloadAndPerformance(args);

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

  server.tool(
    "get_rejection_funnel",
    "Muestra cuantos procesos terminan en rechazado y en que etapa/rol ocurre el rechazo para identificar causas raiz.",
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
        .describe("Filtra por un rol especifico"),
    },
    async (args) => {
      const result = await mcpApiService.getRejectionFunnel(args);

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

  server.tool(
    "get_user_notification_effectiveness",
    "Mide la efectividad de notificaciones por usuario: mostradas, confirmadas, no accionadas y tiempos de reaccion.",
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
        .enum([
          "VIGILANCIA",
          "LOGISTICA",
          "CALIDAD",
          "PRODUCCION",
          "SISTEMA",
          "ADMIN",
        ])
        .optional()
        .describe("Filtra por rol"),
      userId: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Filtra por usuario"),
    },
    async (args) => {
      const result = await mcpApiService.getUserNotificationEffectiveness(args);

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
}
