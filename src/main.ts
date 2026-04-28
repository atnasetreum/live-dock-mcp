import "reflect-metadata";

import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";

import { McpServerService } from "./mcp";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  const mcpServer = app.get(McpServerService);
  await mcpServer.start();

  process.stderr.write(
    `[live-dock-mcp] ready via stdio (${process.env.NODE_ENV ?? "development"})\n`,
  );
}

void bootstrap().catch((error: unknown) => {
  console.error("Failed to start live-dock-mcp", error);
  process.exit(1);
});
