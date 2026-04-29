# PRD - live-dock-mcp

## 1. Resumen Ejecutivo

live-dock-mcp es un servidor MCP por stdio que expone analitica operativa de live-dock-api en modo de solo lectura para asistentes compatibles con MCP (por ejemplo, Claude Desktop y VS Code).

Su objetivo es reducir el tiempo entre pregunta operativa y accion, permitiendo consultas en lenguaje natural soportadas por tools, resources y prompts del protocolo MCP.

## 2. Contexto y Problema

### Problema principal

Los equipos operativos tienen datos en la API, pero convertirlos en decisiones requiere:

- navegar multiples vistas/reportes,
- construir consultas manuales,
- interpretar metricas sin un formato estandar de salida.

### Impacto actual

- tiempo elevado de diagnostico operativo,
- baja consistencia en el analisis,
- reaccion tardia ante cuellos de botella y rechazos.

## 3. Objetivo del Producto

Habilitar un canal MCP confiable y reutilizable para que cualquier asistente compatible pueda responder preguntas operativas criticas de live-dock con evidencia cuantitativa en segundos.

## 4. Objetivos y No Objetivos

### Objetivos

- Exponer metricas clave de recepcion mediante tools MCP de solo lectura.
- Exponer catalogos de contexto mediante resources MCP dinamicos (obtenidos desde API).
- Definir prompts reutilizables para estandarizar respuestas accionables.
- Soportar ejecucion local y remota mediante npx en entornos MCP.
- Mantener seguridad basica por app key + autenticacion contra API.

### No objetivos

- Escritura o mutaciones de datos en la operacion.
- Sustituir dashboards BI avanzados.
- Gestion de usuarios/autorizaciones finas dentro del MCP (se delega a API).
- Orquestacion de flujos multi-paso fuera del alcance analitico.

## 5. Usuarios y Casos de Uso

### Usuarios objetivo

- Lider de operacion de descarga/recepcion.
- Coordinador por rol (VIGILANCIA, LOGISTICA, CALIDAD, PRODUCCION).
- Analista de mejora continua.

### Casos de uso principales

- Detectar cuello de botella actual por etapa/rol.
- Identificar concentracion de rechazos por punto del funnel.
- Medir carga y desempeno por rol.
- Medir efectividad de notificaciones por usuario.
- Consultar catalogos dinamicos de roles y tipos de evento para guiar filtros.

## 6. Alcance Funcional (MVP Actual)

### Tools MCP

- get_delays_by_role
- get_bottleneck_snapshot
- get_role_workload_and_performance
- get_rejection_funnel
- get_user_notification_effectiveness

### Resources MCP

- roles-catalog
- event-types-catalog

Nota: ambos resources se generan dinamicamente mediante peticiones a la API, sin catalogos estaticos en el MCP.

### Prompt MCP

- diagnostico_operativo_diario

## 7. Requisitos Funcionales

### RF-01: Integracion con API

El MCP debe autenticarse contra la API con LIVE_DOCK_USERNAME y LIVE_DOCK_PASSWORD, y usar token para invocar endpoints MCP de analitica.

### RF-02: Seguridad de acceso

Toda llamada debe incluir API_APP_KEY en headers y credenciales por variables de entorno.

### RF-03: Solo lectura

Todas las tools/resources deben operar en modo read-only.

### RF-04: Filtros temporales y por rol

Las tools deben soportar filtros opcionales startDate, endDate y role cuando aplique.

### RF-05: Resources dinamicos

roles-catalog y event-types-catalog deben construirse desde endpoints API dedicados.

### RF-06: Prompt reutilizable

El prompt diagnostico_operativo_diario debe guiar una salida estructurada con insights accionables.

### RF-07: Compatibilidad MCP stdio

El servidor debe funcionar via stdio con clientes MCP comunes.

## 8. Requisitos No Funcionales

### RNF-01: Confiabilidad

El servidor debe iniciar y responder sin desconexiones por configuracion de paquete.

### RNF-02: Observabilidad minima

Errores de red/autenticacion deben retornar mensajes claros para diagnostico.

### RNF-03: Rendimiento

Las consultas deben responder en un tiempo adecuado para flujo conversacional (objetivo inicial: p95 < 5s por tool en condiciones normales).

### RNF-04: Portabilidad

Debe ejecutarse por node dist/main.js y por npx del paquete publicado.

### RNF-05: Mantenibilidad

Separacion modular de prompts, resources y tools en archivos independientes.

## 9. Arquitectura de Solucion

### Componentes

- live-dock-api: backend con logica SQL/TypeORM y endpoints MCP.
- live-dock-mcp: adaptador MCP (stdio) que autentica y proxea a API.
- Cliente MCP: Claude Desktop / VS Code.

### Flujo simplificado

1. Cliente MCP invoca tool/resource/prompt.
2. live-dock-mcp autentica contra API.
3. live-dock-mcp consulta endpoint de API correspondiente.
4. Respuesta se transforma a contenido MCP tipo text/json.

## 10. Variables de Entorno

- API_BASE_URL
- API_APP_KEY
- LIVE_DOCK_USERNAME
- LIVE_DOCK_PASSWORD

## 11. KPIs y Criterios de Exito

### KPI de producto

- Reduccion del tiempo de diagnostico operativo (baseline vs con MCP).
- Porcentaje de consultas resueltas sin abrir dashboards externos.
- Frecuencia de uso semanal de tools criticas.

### KPI tecnico

- Tasa de errores de tools (< 2% objetivo inicial).
- Disponibilidad de respuesta MCP (> 99% objetivo inicial en entorno estable).
- p95 de latencia por tool.

## 12. Riesgos y Mitigaciones

### Riesgo 1: Credenciales invalidas o expiradas

Mitigacion: mensajes de error claros y validacion de env al arranque.

### Riesgo 2: Cambios de contrato API

Mitigacion: versionado de endpoints + pruebas de integracion MCP/API.

### Riesgo 3: Desconexion por configuracion de ejecucion

Mitigacion: mantener bin + entrypoint CLI validos y smoke tests con npx.

### Riesgo 4: Latencia de consultas complejas

Mitigacion: optimizacion SQL, indices y filtros obligatorios en prompts largos.

## 13. Roadmap Propuesto

### Fase 1 (actual)

- Tools core operativas.
- Resources dinamicos.
- Prompt diagnostico_operativo_diario.
- Publicacion npm y ejecucion npx.

### Fase 2

- Mas prompts guiados por escenario (turno, rol, incidentes).
- Estandar de salidas con severidad e impacto.
- Mejoras de resiliencia en errores transitorios de API.

### Fase 3

- Telemetria de uso de tools/prompts.
- Versionado semantico de contratos MCP.
- Suite automatizada de pruebas end-to-end MCP.

## 14. Criterios de Aceptacion

- El MCP inicia correctamente por npx y por node dist/main.js.
- Las 5 tools responden con datos de API y filtros funcionales.
- Los 2 resources retornan catalogos dinamicos (sin hardcode).
- El prompt diagnostico_operativo_diario aparece en listado de prompts del cliente MCP.
- Build y lint pasan en API y MCP.

## 15. Operacion y Publicacion

### Build local

- pnpm install
- pnpm build

### Publicacion

- npm pack --dry-run
- npm publish --access public

### Configuracion MCP cliente

Configurar servidor stdio con variables de entorno requeridas.

## 16. Preguntas Abiertas

- Se requiere segmentacion por planta/sitio en los endpoints actuales?
- Se necesita control de acceso por rol para cada tool en API?
- Que SLA formal se espera para latencia y disponibilidad en produccion?
- Que periodicidad de revision tendra el prompt diagnostico_operativo_diario?
