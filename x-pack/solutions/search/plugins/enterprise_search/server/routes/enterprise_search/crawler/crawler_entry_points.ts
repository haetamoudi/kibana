/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';

import type { RouteDependencies } from '../../../types';

export function registerCrawlerEntryPointRoutes({
  router,
  enterpriseSearchRequestHandler,
}: RouteDependencies) {
  router.post(
    {
      path: '/internal/enterprise_search/indices/{indexName}/crawler/domains/{domainId}/entry_points',
      validate: {
        params: schema.object({
          indexName: schema.string(),
          domainId: schema.string(),
        }),
        body: schema.object({
          value: schema.string(),
        }),
      },
    },
    enterpriseSearchRequestHandler.createRequest({
      path: '/api/ent/v1/internal/indices/:indexName/crawler2/domains/:domainId/entry_points',
      params: {
        respond_with: 'index',
      },
    })
  );

  router.put(
    {
      path: '/internal/enterprise_search/indices/{indexName}/crawler/domains/{domainId}/entry_points/{entryPointId}',
      validate: {
        params: schema.object({
          indexName: schema.string(),
          domainId: schema.string(),
          entryPointId: schema.string(),
        }),
        body: schema.object({
          value: schema.string(),
        }),
      },
    },
    enterpriseSearchRequestHandler.createRequest({
      path: '/api/ent/v1/internal/indices/:indexName/crawler2/domains/:domainId/entry_points/:entryPointId',
      params: {
        respond_with: 'index',
      },
    })
  );

  router.delete(
    {
      path: '/internal/enterprise_search/indices/{indexName}/crawler/domains/{domainId}/entry_points/{entryPointId}',
      validate: {
        params: schema.object({
          indexName: schema.string(),
          domainId: schema.string(),
          entryPointId: schema.string(),
        }),
      },
    },
    enterpriseSearchRequestHandler.createRequest({
      path: '/api/ent/v1/internal/indices/:indexName/crawler2/domains/:domainId/entry_points/:entryPointId',
      params: {
        respond_with: 'index',
      },
    })
  );
}
