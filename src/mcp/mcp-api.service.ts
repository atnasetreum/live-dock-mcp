import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type LoginResponse = {
  accessToken: string;
  scope: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

type GetDelaysByRoleArgs = {
  startDate?: string;
  endDate?: string;
  role?: string;
  eventType?: string;
};

type GetBottleneckSnapshotArgs = {
  startDate?: string;
  endDate?: string;
};

type GetRoleWorkloadAndPerformanceArgs = {
  startDate?: string;
  endDate?: string;
  role?: "VIGILANCIA" | "LOGISTICA" | "CALIDAD" | "PRODUCCION";
};

type GetRejectionFunnelArgs = {
  startDate?: string;
  endDate?: string;
  role?: "VIGILANCIA" | "LOGISTICA" | "CALIDAD" | "PRODUCCION";
};

type GetUserNotificationEffectivenessArgs = {
  startDate?: string;
  endDate?: string;
  role?:
    | "VIGILANCIA"
    | "LOGISTICA"
    | "CALIDAD"
    | "PRODUCCION"
    | "SISTEMA"
    | "ADMIN";
  userId?: number;
};

@Injectable()
export class McpApiService {
  constructor(private readonly configService: ConfigService) {}

  private get apiBaseUrl() {
    const apiBaseUrl = this.configService.get<string>("API_BASE_URL");

    if (!apiBaseUrl) {
      throw new Error("Missing API_BASE_URL environment variable");
    }

    return apiBaseUrl.replace(/\/$/, "");
  }

  private get appKey() {
    const appKey = this.configService.get<string>("API_APP_KEY");

    if (!appKey) {
      throw new Error("Missing API_APP_KEY environment variable");
    }

    return appKey;
  }

  private get liveDockUsername() {
    const username = this.configService.get<string>("LIVE_DOCK_USERNAME");

    if (!username) {
      throw new Error("Missing LIVE_DOCK_USERNAME environment variable");
    }

    return username;
  }

  private get liveDockPassword() {
    const password = this.configService.get<string>("LIVE_DOCK_PASSWORD");

    if (!password) {
      throw new Error("Missing LIVE_DOCK_PASSWORD environment variable");
    }

    return password;
  }

  async getDelaysByRole({
    startDate,
    endDate,
    role,
    eventType,
  }: GetDelaysByRoleArgs) {
    const loginResponse = await this.fetchJson<LoginResponse>(
      `${this.apiBaseUrl}/mcp/auth/login`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          username: this.liveDockUsername,
          password: this.liveDockPassword,
        }),
      },
    );

    const params = new URLSearchParams();

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    if (role) {
      params.set("role", role);
    }

    if (eventType) {
      params.set("eventType", eventType);
    }

    const query = params.toString();
    const endpoint = `${this.apiBaseUrl}/mcp/get_delays_by_role${query ? `?${query}` : ""}`;

    const result = await this.fetchJson<Record<string, unknown>>(endpoint, {
      method: "GET",
      headers: this.getHeaders({
        Authorization: `Bearer ${loginResponse.accessToken}`,
      }),
    });

    return {
      authenticatedUser: loginResponse.user,
      scope: loginResponse.scope,
      result,
    };
  }

  async getBottleneckSnapshot({
    startDate,
    endDate,
  }: GetBottleneckSnapshotArgs) {
    const loginResponse = await this.fetchJson<LoginResponse>(
      `${this.apiBaseUrl}/mcp/auth/login`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          username: this.liveDockUsername,
          password: this.liveDockPassword,
        }),
      },
    );

    const params = new URLSearchParams();

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    const query = params.toString();
    const endpoint = `${this.apiBaseUrl}/mcp/get_bottleneck_snapshot${query ? `?${query}` : ""}`;

    const result = await this.fetchJson<Record<string, unknown>>(endpoint, {
      method: "GET",
      headers: this.getHeaders({
        Authorization: `Bearer ${loginResponse.accessToken}`,
      }),
    });

    return {
      authenticatedUser: loginResponse.user,
      scope: loginResponse.scope,
      result,
    };
  }

  async getRoleWorkloadAndPerformance({
    startDate,
    endDate,
    role,
  }: GetRoleWorkloadAndPerformanceArgs) {
    const loginResponse = await this.fetchJson<LoginResponse>(
      `${this.apiBaseUrl}/mcp/auth/login`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          username: this.liveDockUsername,
          password: this.liveDockPassword,
        }),
      },
    );

    const params = new URLSearchParams();

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    if (role) {
      params.set("role", role);
    }

    const query = params.toString();
    const endpoint = `${this.apiBaseUrl}/mcp/get_role_workload_and_performance${query ? `?${query}` : ""}`;

    const result = await this.fetchJson<Record<string, unknown>>(endpoint, {
      method: "GET",
      headers: this.getHeaders({
        Authorization: `Bearer ${loginResponse.accessToken}`,
      }),
    });

    return {
      authenticatedUser: loginResponse.user,
      scope: loginResponse.scope,
      result,
    };
  }

  async getRejectionFunnel({
    startDate,
    endDate,
    role,
  }: GetRejectionFunnelArgs) {
    const loginResponse = await this.fetchJson<LoginResponse>(
      `${this.apiBaseUrl}/mcp/auth/login`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          username: this.liveDockUsername,
          password: this.liveDockPassword,
        }),
      },
    );

    const params = new URLSearchParams();

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    if (role) {
      params.set("role", role);
    }

    const query = params.toString();
    const endpoint = `${this.apiBaseUrl}/mcp/get_rejection_funnel${query ? `?${query}` : ""}`;

    const result = await this.fetchJson<Record<string, unknown>>(endpoint, {
      method: "GET",
      headers: this.getHeaders({
        Authorization: `Bearer ${loginResponse.accessToken}`,
      }),
    });

    return {
      authenticatedUser: loginResponse.user,
      scope: loginResponse.scope,
      result,
    };
  }

  async getUserNotificationEffectiveness({
    startDate,
    endDate,
    role,
    userId,
  }: GetUserNotificationEffectivenessArgs) {
    const loginResponse = await this.fetchJson<LoginResponse>(
      `${this.apiBaseUrl}/mcp/auth/login`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          username: this.liveDockUsername,
          password: this.liveDockPassword,
        }),
      },
    );

    const params = new URLSearchParams();

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    if (role) {
      params.set("role", role);
    }

    if (userId !== undefined) {
      params.set("userId", String(userId));
    }

    const query = params.toString();
    const endpoint = `${this.apiBaseUrl}/mcp/get_user_notification_effectiveness${query ? `?${query}` : ""}`;

    const result = await this.fetchJson<Record<string, unknown>>(endpoint, {
      method: "GET",
      headers: this.getHeaders({
        Authorization: `Bearer ${loginResponse.accessToken}`,
      }),
    });

    return {
      authenticatedUser: loginResponse.user,
      scope: loginResponse.scope,
      result,
    };
  }

  private getHeaders(extraHeaders?: Record<string, string>) {
    return {
      "Content-Type": "application/json",
      "x-app-key": this.appKey,
      ...extraHeaders,
    };
  }

  private async fetchJson<T>(input: string, init: RequestInit) {
    const response = await fetch(input, init);
    const payload = (await response.json().catch(() => null)) as
      | T
      | { message?: string }
      | null;

    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && "message" in payload
          ? payload.message
          : `Request failed with status ${response.status}`;

      throw new Error(
        Array.isArray(message) ? message.join(", ") : String(message),
      );
    }

    return payload as T;
  }
}
