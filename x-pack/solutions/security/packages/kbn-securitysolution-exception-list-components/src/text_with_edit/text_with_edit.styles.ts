/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { css } from '@emotion/react';
import { euiThemeVars } from '@kbn/ui-theme';

export const textWithEditContainerCss = css`
  display: flex;
  width: fit-content;
  align-items: baseline;
  padding-bottom: ${euiThemeVars.euiSizeS};
  h1 {
    margin-bottom: 0;
  }
`;
export const editIconCss = css`
  button {
    margin-left: -${euiThemeVars.euiSizeM};
  }
`;
