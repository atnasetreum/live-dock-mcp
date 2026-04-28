import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

import { McpApiService, McpServerService } from "./mcp";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [McpApiService, McpServerService],
})
export class AppModule {}
