/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { z } from '@kbn/zod';
import type {
  ConfigSchema,
  SecretsSchema,
  ReaderTestParamsSchema,
  ReaderBrowseParamsSchema,
  ReaderSearchParamsSchema,
  ReaderHtmlToMarkdownParamsSchema,
  ReaderFileToMarkdownParamsSchema,
  ReaderBrowseResponseSchema,
  ReaderSearchResponseSchema,
} from './schema';

export type Config = z.input<typeof ConfigSchema>;
export type Secrets = z.infer<typeof SecretsSchema>;
export type ReaderTestParams = z.infer<typeof ReaderTestParamsSchema>;
export type ReaderBrowseParams = z.infer<typeof ReaderBrowseParamsSchema>;
export type ReaderSearchParams = z.infer<typeof ReaderSearchParamsSchema>;
export type ReaderHtmlToMarkdownParams = z.infer<typeof ReaderHtmlToMarkdownParamsSchema>;
export type ReaderFileToMarkdownParams = z.infer<typeof ReaderFileToMarkdownParamsSchema>;
export type ReaderBrowseResponse = z.infer<typeof ReaderBrowseResponseSchema>;
export type ReaderSearchResponse = z.infer<typeof ReaderSearchResponseSchema>;
