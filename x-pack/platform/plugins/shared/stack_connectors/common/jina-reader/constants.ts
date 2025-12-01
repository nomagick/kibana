/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export const JINA_READER_TITLE = 'Jina (Reader)';
export const JINA_READER_CONNECTOR_ID = '.jina';
export enum SUB_ACTION {
  BROWSE = 'browse',
  SEARCH = 'search',
  HTML_TO_MARKDOWN = 'htmlToMarkdown',
  FILE_TO_MARKDOWN = 'fileToMarkdown',
  RUN = 'run',
  TEST = 'test',
}

export enum RETURN_FORMAT {
  MARKDOWN = 'markdown',
  FULL_MARKDOWN = 'fullMarkdown',
  PLAIN_TEXT = 'plainText',
  SCREENSHOT = 'screenshot',
  FULL_SCREENSHOT = 'fullScreenshot',
}

export const DEFAULT_TIMEOUT_MS = 120000;
export const JINA_READER_BROWSE_URL = 'https://r.jina.ai' as const;
export const JINA_READER_SEARCH_URL = 'https://s.jina.ai' as const;
