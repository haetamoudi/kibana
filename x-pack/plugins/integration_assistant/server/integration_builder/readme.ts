/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import nunjucks from 'nunjucks';

import { join as joinPath } from 'path';
import { createSync, ensureDirSync } from '../util';

export function createReadme(packageDir: string, integration: Integration, fields: object[]) {
    const templateDir = joinPath(__dirname, '../templates');
    const agentTemplates = joinPath(templateDir, 'agent');
    const manifestTemplates = joinPath(templateDir, 'manifest');
    const systemTestTemplates = joinPath(templateDir, 'system_tests');
    nunjucks.configure([templateDir, agentTemplates, manifestTemplates, systemTestTemplates], {
        autoescape: false,
    });

    const readmeDirPath = joinPath(packageDir, '_dev/build/docs/');
    const mainReadmeDirPath = joinPath(packageDir, 'docs/');
    ensureDirSync(mainReadmeDirPath);
    ensureDirSync(readmeDirPath);
    const readmeTemplate = nunjucks.render('package_readme.md.njk', {
        package_name: integration.name,
        fields: fields
    });

    console.log(readmeTemplate)

    createSync(joinPath(readmeDirPath, 'README.md'), readmeTemplate);
    createSync(joinPath(mainReadmeDirPath, 'README.md'), readmeTemplate);
}
