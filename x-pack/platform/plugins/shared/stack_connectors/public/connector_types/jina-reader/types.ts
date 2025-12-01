/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ActionTypeModel as ConnectorTypeModel } from '@kbn/triggers-actions-ui-plugin/public';
import type { UserConfiguredActionConnector } from '@kbn/triggers-actions-ui-plugin/public/types';
import type { SUB_ACTION } from '../../../common/jina-reader/constants';
import type { ReaderTestParams, Config, Secrets } from '../../../common/jina-reader/types';
export type { Config, Secrets } from '../../../common/jina-reader/types';

export interface ActionParams {
  subAction: SUB_ACTION.RUN | SUB_ACTION.TEST;
  subActionParams: ReaderTestParams;
}

export type JinaReaderConnector = ConnectorTypeModel<Config, Secrets, ActionParams>;
export type JinaReaderActionConnector = UserConfiguredActionConnector<Config, Secrets>;
