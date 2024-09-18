/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { testIntegration } from "@kbn/integration-assistant-plugin/__jest__/fixtures/build_integration";
import { createReadme } from "./readme";


jest.mock('../util', () => ({
    ...jest.requireActual('../util'),
    createSync: jest.fn(),
    ensureDirSync: jest.fn(),
}));

describe('createReadme', () => {

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    it('Should create expected files', async () => {

        const fields = [{
            datastream: 'data_stream_1',
            fields: [
                {
                    name: 'data_stream.type',
                    type: 'constant_keyword',
                    description: 'Data stream type.'
                },
                {
                    name: 'data_stream.dataset',
                    type: 'constant_keyword',
                    description: 'Data stream dataset name.'
                },
                {
                    name: 'event.dataset',
                    type: 'constant_keyword',
                    description: 'Event dataset',
                    value: 'package.datastream'
                },
                { name: '@timestamp', type: 'date', description: 'Event timestamp.' }
            ],
        }, {
            datastream: "data_stream_2",
            fields: [
                { name: '@timestamp', type: 'date', description: 'Event timestamp.' }
            ]
        }]



        createReadme('path', testIntegration, fields)

    });

});
