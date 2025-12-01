/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ServiceParams } from '@kbn/actions-plugin/server';
import { SubActionConnector } from '@kbn/actions-plugin/server';
import type { AxiosError } from 'axios';
import type { ConnectorUsageCollector } from '@kbn/actions-plugin/server/types';
import { z } from '@kbn/zod';
import {
  ReaderBrowseParamsSchema,
  ReaderSearchParamsSchema,
  ReaderHtmlToMarkdownParamsSchema,
  ReaderBrowseResponseSchema,
  ReaderSearchResponseSchema,
  ReaderFileToMarkdownParamsSchema,
} from '../../../common/jina-reader/schema';
import type {
  Config,
  Secrets,
  ReaderBrowseParams,
  ReaderSearchParams,
  ReaderHtmlToMarkdownParams,
  ReaderBrowseResponse,
  ReaderFileToMarkdownParams,
  ReaderSearchResponse,
  ReaderTestParams,
} from '../../../common/jina-reader/types';
import {
  JINA_READER_BROWSE_URL,
  JINA_READER_SEARCH_URL,
  RETURN_FORMAT,
  SUB_ACTION,
} from '../../../common/jina-reader/constants';

export class JinaReaderConnector extends SubActionConnector<Config, Secrets> {
  protected browseUrl: string = JINA_READER_BROWSE_URL;
  protected searchUrl: string = JINA_READER_SEARCH_URL;

  constructor(params: ServiceParams<Config, Secrets>) {
    super(params);

    if (this.config.overrideBrowseUrl) {
      this.browseUrl = this.config.overrideBrowseUrl;
    }
    if (this.config.overrideSearchUrl) {
      this.searchUrl = this.config.overrideSearchUrl;
    }

    this.registerSubAction({
      name: SUB_ACTION.RUN,
      method: 'run',
      schema: ReaderBrowseParamsSchema,
    });
    this.registerSubAction({
      name: SUB_ACTION.TEST,
      method: 'test',
      schema: ReaderBrowseParamsSchema,
    });
    this.registerSubAction({
      name: SUB_ACTION.BROWSE,
      method: 'browse',
      schema: ReaderBrowseParamsSchema,
    });
    this.registerSubAction({
      name: SUB_ACTION.SEARCH,
      method: 'search',
      schema: ReaderSearchParamsSchema,
    });
    this.registerSubAction({
      name: SUB_ACTION.HTML_TO_MARKDOWN,
      method: 'htmlToMarkdown',
      schema: ReaderHtmlToMarkdownParamsSchema,
    });
    this.registerSubAction({
      name: SUB_ACTION.FILE_TO_MARKDOWN,
      method: 'fileToMarkdown',
      schema: ReaderFileToMarkdownParamsSchema,
    });
  }

  protected override getResponseErrorMessage(
    error: AxiosError<{ error?: { message?: string } }>
  ): string {
    // handle known Azure error from early release, we can probably get rid of this eventually
    if (error.message === '404 Unrecognized request argument supplied: functions') {
      // add information for known Azure error
      return `API Error: ${error.message}
        \n\nFunction support with Azure OpenAI API was added in 2023-07-01-preview. Update the API version of the Azure OpenAI connector in use
      `;
    }
    if (!error.response?.status) {
      return `Unexpected API Error: ${error.code ?? ''} - ${error.message ?? 'Unknown error'}`;
    }
    // LM Studio returns error.response?.data?.error as string
    const errorMessage = error.response?.data?.error?.message ?? error.response?.data?.error;
    if (error.response.status === 401) {
      return `Unauthorized API Error${errorMessage ? ` - ${errorMessage}` : ''}`;
    }
    return `API Error: ${error.response?.statusText}${errorMessage ? ` - ${errorMessage}` : ''}`;
  }

  private mapPluginReturnFormatToReaderReturnFormat(returnFormat?: RETURN_FORMAT): string {
    switch (returnFormat) {
      case RETURN_FORMAT.MARKDOWN:
        return 'content';
      case RETURN_FORMAT.FULL_MARKDOWN:
        return 'markdown';
      case RETURN_FORMAT.PLAIN_TEXT:
        return 'text';
      case RETURN_FORMAT.SCREENSHOT:
        return 'screenshot';
      case RETURN_FORMAT.FULL_SCREENSHOT:
        return 'pageshot';
      default:
        return 'content';
    }
  }

  /**
   * Jina Reader Browse Action
   */
  public async browse(
    params: ReaderBrowseParams,
    connectorUsageCollector: ConnectorUsageCollector
  ): Promise<ReaderBrowseResponse> {
    const { url, returnFormat, signal, options } = params;

    const res = await this.request(
      {
        method: 'POST',
        url: `${this.browseUrl}`,
        responseSchema: ReaderBrowseResponseSchema,
        headers: {
          Accept: 'application/json',
        },
        data: {
          ...options,
          url,
          returnFormat: this.mapPluginReturnFormatToReaderReturnFormat(returnFormat),
        },
        signal,
      },
      connectorUsageCollector
    );

    return res.data;
  }

  /**
   * Jina Reader Browse Action
   */
  public async htmlToMarkdown(
    params: ReaderHtmlToMarkdownParams,
    connectorUsageCollector: ConnectorUsageCollector
  ): Promise<ReaderBrowseResponse> {
    const { html, url, returnFormat, signal, options } = params;

    const res = await this.request(
      {
        method: 'POST',
        url: `${this.browseUrl}`,
        responseSchema: ReaderBrowseResponseSchema,
        headers: {
          Accept: 'application/json',
        },
        data: {
          ...options,
          html,
          url,
          returnFormat: this.mapPluginReturnFormatToReaderReturnFormat(returnFormat),
        },
        signal,
      },
      connectorUsageCollector
    );

    return res.data;
  }

  /**
   * Jina Reader File To Markdown Action
   */
  public async fileToMarkdown(
    params: ReaderFileToMarkdownParams,
    connectorUsageCollector: ConnectorUsageCollector
  ): Promise<ReaderBrowseResponse> {
    const { file, url, returnFormat, signal, options } = params;

    const formData = new FormData();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    formData.append('file', file);
    if (url) {
      formData.append('url', url);
    }
    formData.append('returnFormat', this.mapPluginReturnFormatToReaderReturnFormat(returnFormat));

    const res = await this.request(
      {
        method: 'POST',
        url: `${this.browseUrl}`,
        responseSchema: ReaderBrowseResponseSchema,
        headers: {
          Accept: 'application/json',
        },
        data: formData,
        signal,
      },
      connectorUsageCollector
    );

    return res.data;
  }

  /**
   * Jina Reader Search Action
   */
  public async search(
    params: ReaderSearchParams,
    connectorUsageCollector: ConnectorUsageCollector
  ): Promise<ReaderSearchResponse> {
    const { query, signal, options } = params;

    const res = await this.request(
      {
        method: 'POST',
        url: `${this.searchUrl}`,
        responseSchema: ReaderSearchResponseSchema,
        data: {
          ...options,
          q: query,
        },
        signal,
      },
      connectorUsageCollector
    );

    return res.data;
  }

  /**
   * Jina Reader Test Action
   */
  public async test(
    params: ReaderTestParams,
    connectorUsageCollector: ConnectorUsageCollector
  ): Promise<string> {
    const { endpoint, body, signal } = params;

    const res = await this.request(
      {
        method: body ? 'POST' : 'GET',
        url: endpoint === 'search' ? `${this.searchUrl}` : `${this.browseUrl}`,
        responseSchema: z.string(),
        data: body ? JSON.parse(body) : undefined,
        signal,
      },
      connectorUsageCollector
    );

    return res.data;
  }
}
