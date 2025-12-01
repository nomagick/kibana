/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { SubActionConnectorType } from '@kbn/actions-plugin/server/sub_action_framework/types';
import { WorkflowsConnectorFeatureId } from '@kbn/actions-plugin/common';
import { JINA_READER_CONNECTOR_ID, JINA_READER_TITLE } from '../../../common/jina-reader/constants';
import { ConfigSchema, SecretsSchema } from '../../../common/jina-reader/schema';
import type { Config, Secrets } from '../../../common/jina-reader/types';
import { JinaReaderConnector } from './reader';

export const getConnectorType = (): SubActionConnectorType<Config, Secrets> => ({
  id: JINA_READER_CONNECTOR_ID,
  name: JINA_READER_TITLE,
  getService: (params) => new JinaReaderConnector(params),
  schema: {
    config: ConfigSchema,
    secrets: SecretsSchema,
  },
  supportedFeatureIds: [WorkflowsConnectorFeatureId],
  minimumLicenseRequired: 'gold' as const,
});
