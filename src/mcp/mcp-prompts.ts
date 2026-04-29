import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerMcpPrompts(server: McpServer) {
  server.registerPrompt(
    "diagnostico_operativo_diario",
    {
      title: "Diagnostico operativo diario",
      description:
        "Guia para analizar cuello de botella, embudo de rechazo y carga por rol en live-dock.",
      argsSchema: {
        startDate: z
          .string()
          .datetime()
          .optional()
          .describe("Fecha inicial ISO 8601 del analisis"),
        endDate: z
          .string()
          .datetime()
          .optional()
          .describe("Fecha final ISO 8601 del analisis"),
        role: z
          .enum(["VIGILANCIA", "LOGISTICA", "CALIDAD", "PRODUCCION"])
          .optional()
          .describe("Rol opcional para enfocar el diagnostico"),
      },
    },
    (args) => {
      const filtros = {
        ...(args.startDate ? { startDate: args.startDate } : {}),
        ...(args.endDate ? { endDate: args.endDate } : {}),
        ...(args.role ? { role: args.role } : {}),
      };

      const filtrosTexto = JSON.stringify(filtros, null, 2);

      return {
        description:
          "Plantilla para diagnostico operativo diario con herramientas de live-dock.",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: [
                "Genera un diagnostico operativo diario para live-dock.",
                "",
                "1) Ejecuta get_bottleneck_snapshot con estos filtros:",
                filtrosTexto,
                "",
                "2) Ejecuta get_rejection_funnel con los mismos filtros.",
                "",
                "3) Ejecuta get_role_workload_and_performance con los mismos filtros.",
                "",
                "4) Entrega la respuesta final con este formato:",
                "- Top 3 hallazgos (con evidencia numerica)",
                "- Rol mas comprometido (y por que)",
                "- Riesgo principal para hoy",
                "- 3 acciones concretas priorizadas (alto, medio, bajo)",
              ].join("\n"),
            },
          },
        ],
      };
    },
  );
}
