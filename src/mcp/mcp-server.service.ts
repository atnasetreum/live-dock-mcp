import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { McpApiService } from "./mcp-api.service";
import { registerMcpPrompts } from "./mcp-prompts";
import { registerMcpResources } from "./mcp-resources";
import { registerMcpTools } from "./mcp-tools";

@Injectable()
export class McpServerService implements OnModuleDestroy {
  private server?: McpServer;

  constructor(private readonly mcpApiService: McpApiService) {}

  async start() {
    this.server = new McpServer({
      name: "live-dock-mcp",
      version: "0.1.0",
    });

    registerMcpResources(this.server, this.mcpApiService);
    registerMcpPrompts(this.server);
    registerMcpTools(this.server, this.mcpApiService);

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async onModuleDestroy() {
    await this.server?.close();
  }
}
