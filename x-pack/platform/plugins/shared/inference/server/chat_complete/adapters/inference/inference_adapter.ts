/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type OpenAI from 'openai';
import { from, identity, switchMap, throwError } from 'rxjs';
import { isReadable, Readable } from 'stream';
import { createInferenceInternalError } from '@kbn/inference-common';
import { eventSourceStreamIntoObservable } from '../../../util/event_source_stream_into_observable';
import type { InferenceConnectorAdapter } from '../../types';
import {
  parseInlineFunctionCalls,
  wrapWithSimulatedFunctionCalling,
} from '../../simulated_function_calling';
import { isNativeFunctionCallingSupported } from '../../utils/function_calling_support';
import {
  toolsToOpenAI,
  toolChoiceToOpenAI,
  messagesToOpenAI,
  processOpenAIStream,
  emitTokenCountEstimateIfMissing,
} from '../openai';

export const inferenceAdapter: InferenceConnectorAdapter = {
  chatComplete: ({
    executor,
    system,
    messages,
    toolChoice,
    tools,
    functionCalling = 'auto',
    temperature = 0,
    modelName,
    logger,
    abortSignal,
  }) => {
    const useSimulatedFunctionCalling =
      functionCalling === 'auto'
        ? !isNativeFunctionCallingSupported(executor.getConnector())
        : functionCalling === 'simulated';

    let request: Omit<OpenAI.ChatCompletionCreateParams, 'model'> & { model?: string };
    if (useSimulatedFunctionCalling) {
      const wrapped = wrapWithSimulatedFunctionCalling({
        system,
        messages,
        toolChoice,
        tools,
      });
      request = {
        temperature,
        model: modelName,
        messages: messagesToOpenAI({ system: wrapped.system, messages: wrapped.messages }),
      };
    } else {
      request = {
        temperature,
        model: modelName,
        messages: messagesToOpenAI({ system, messages }),
        tool_choice: toolChoiceToOpenAI(toolChoice),
        tools: toolsToOpenAI(tools),
      };
    }

    return from(
      executor.invoke({
        subAction: 'unified_completion_stream',
        subActionParams: {
          body: request,
          signal: abortSignal,
        },
      })
    ).pipe(
      switchMap((response) => {
        if (response.status === 'error') {
          return throwError(() =>
            createInferenceInternalError(`Error calling connector: ${response.serviceMessage}`, {
              rootError: response.serviceMessage,
            })
          );
        }
        if (isReadable(response.data as any)) {
          return eventSourceStreamIntoObservable(response.data as Readable);
        }
        return throwError(() =>
          createInferenceInternalError('Unexpected error', response.data as Record<string, any>)
        );
      }),
      processOpenAIStream(),
      emitTokenCountEstimateIfMissing({ request }),
      useSimulatedFunctionCalling ? parseInlineFunctionCalls({ logger }) : identity
    );
  },
};
