/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { IRouter } from '@kbn/core/server';
import { AutomaticImportRouteHandlerContext } from '../plugin';
import { registerApiAnalysisRoutes } from './analyze_api_route';
import { registerAnalyzeLogsRoutes } from './analyze_logs_routes';
import { registerIntegrationBuilderRoutes } from './build_integration_routes';
import { registerCategorizationRoutes } from './categorization_routes';
import { registerCelInputRoutes } from './cel_routes';
import { registerEcsRoutes } from './ecs_routes';
import { registerPipelineRoutes } from './pipeline_routes';
import { registerRelatedRoutes } from './related_routes';

export function registerRoutes(router: IRouter<AutomaticImportRouteHandlerContext>) {
  registerAnalyzeLogsRoutes(router);
  registerEcsRoutes(router);
  registerIntegrationBuilderRoutes(router);
  registerCategorizationRoutes(router);
  registerRelatedRoutes(router);
  registerPipelineRoutes(router);

  registerApiAnalysisRoutes(router);
  registerCelInputRoutes(router);
}
