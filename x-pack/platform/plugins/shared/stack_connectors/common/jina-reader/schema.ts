/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { z } from '@kbn/zod';
import { RETURN_FORMAT } from './constants';

// Connector schema
export const ConfigSchema = z
  .object({
    overrideBrowseUrl: z.string().url().optional(),
    overrideSearchUrl: z.string().url().optional(),
    options: z.record(z.string(), z.any()).optional(),
  })
  .strict();

export const SecretsSchema = z.union([
  z.object({ apiKey: z.string() }).strict(),
  z
    .object({
      apiKey: z.string().startsWith('jina_').length(65).optional(),
    })
    .strict(),
]);

// Reader Test Action
export const ReaderTestParamsSchema = z.object({
  endpoint: z.enum(['browse', 'search']),
  body: z.string().optional(),
  signal: z.any().optional(),
});

// Reader Browse Action
export const ReaderBrowseParamsSchema = z.object({
  url: z.string().url(),
  returnFormat: z
    .enum([
      RETURN_FORMAT.MARKDOWN,
      RETURN_FORMAT.FULL_MARKDOWN,
      RETURN_FORMAT.PLAIN_TEXT,
      RETURN_FORMAT.SCREENSHOT,
      RETURN_FORMAT.FULL_SCREENSHOT,
    ])
    .optional(),
  signal: z.any().optional(),
  options: z.record(z.string(), z.any()).optional(),
});

// Reader Search Action
export const ReaderSearchParamsSchema = z.object({
  query: z.string().min(1),
  signal: z.any().optional(),
  options: z.record(z.string(), z.any()).optional(),
});

// HTMLToMarkdown Browse Action
export const ReaderHtmlToMarkdownParamsSchema = z.object({
  html: z.string().min(1),
  url: z.string().url().optional(),
  returnFormat: z
    .enum([RETURN_FORMAT.MARKDOWN, RETURN_FORMAT.FULL_MARKDOWN, RETURN_FORMAT.PLAIN_TEXT])
    .optional(),
  signal: z.any().optional(),
  options: z.record(z.string(), z.any()).optional(),
});

// FileToMarkdown Browse Action
export const ReaderFileToMarkdownParamsSchema = z.object({
  file: z.instanceof(File),
  url: z.string().url().optional(),
  returnFormat: z
    .enum([RETURN_FORMAT.MARKDOWN, RETURN_FORMAT.FULL_MARKDOWN, RETURN_FORMAT.PLAIN_TEXT])
    .optional(),
  signal: z.any().optional(),
  options: z.record(z.string(), z.any()).optional(),
});

export const ReaderBrowseResponseSchema = z.object({
  code: z.number(),
  data: z.object({
    title: z.string(),
    url: z.string(),
    warning: z.string().optional(),
    description: z.string(),
    content: z.string(),
    publishedTime: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
    external: z.record(z.string(), z.any()).optional(),
  }),
  meta: z.object({
    usage: z.object({
      tokens: z.number(),
    }),
  }),
});

export const ReaderSearchResponseSchema = z.object({
  code: z.number(),
  data: z.array(
    z.object({
      url: z.string(),
      warning: z.string().optional(),
      title: z.string(),
      description: z.string(),
      content: z.string().optional(),
      publishedTime: z.string().optional(),
      metadata: z.record(z.string(), z.any()).optional(),
      external: z.record(z.string(), z.any()).optional(),
    })
  ),
  meta: z.object({
    usage: z.object({
      tokens: z.number(),
    }),
  }),
});
