/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import nunjucks from 'nunjucks';

import { createSync, generateFields, mergeSamples } from '../util';

import * as yaml from 'js-yaml';
import { flattenObjectsList } from '../util/samples';

export function createFieldMapping(
  packageName: string,
  dataStreamName: string,
  specificDataStreamDir: string,
  docs: object[]
): object {
  const baseFields = createBaseFields(specificDataStreamDir, packageName, dataStreamName);
  const customFields = createCustomFields(specificDataStreamDir, docs);

  return mergeFields(baseFields, customFields)
}

function createBaseFields(
  specificDataStreamDir: string,
  packageName: string,
  dataStreamName: string
): object[] {
  const datasetName = `${packageName}.${dataStreamName}`;
  const baseFields = nunjucks.render('base_fields.yml.njk', {
    module: packageName,
    dataset: datasetName,
  });

  createSync(`${specificDataStreamDir}/base-fields.yml`, baseFields);

  return yaml.load(baseFields)
}

function createCustomFields(specificDataStreamDir: string, pipelineResults: object[]): object[] {
  const mergedResults = mergeSamples(pipelineResults);
  const fieldKeys = generateFields(mergedResults);
  createSync(`${specificDataStreamDir}/fields/fields.yml`, fieldKeys);

  return yaml.load(fieldKeys)
}

function mergeFields(baseFields: object[], customFields: object[]): object[] {
  const fields = [...baseFields, ...customFields]

  return flattenObjectsList(fields)

}