/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiText, EuiTourStep } from '@elastic/eui';
import React, { useState } from 'react';
import { FormattedMessage } from '@kbn/i18n-react';

import type { TOUR_STORAGE_CONFIG } from '../../../../constants';
import { TOUR_STORAGE_KEYS } from '../../../../constants';
import { useStartServices } from '../../../../hooks';

export const AgentExportCSVTour: React.FC<{}> = () => {
  const { storage, uiSettings } = useStartServices();

  const [tourState, setTourState] = useState({ isOpen: true });

  const isTourHidden =
    uiSettings.get('hideAnnouncements', false) ||
    (
      storage.get(TOUR_STORAGE_KEYS.AGENT_EXPORT_CSV) as
        | TOUR_STORAGE_CONFIG['AGENT_EXPORT_CSV']
        | undefined
    )?.active === false;

  const setTourAsHidden = () => {
    storage.set(TOUR_STORAGE_KEYS.AGENT_EXPORT_CSV, {
      active: false,
    } as TOUR_STORAGE_CONFIG['AGENT_EXPORT_CSV']);
  };

  const onFinish = () => {
    setTourState({ isOpen: false });
    setTourAsHidden();
  };

  return (
    <>
      <EuiTourStep
        content={
          <EuiText>
            <FormattedMessage
              id="xpack.fleet.agentExportCSVTour.tourContent"
              defaultMessage="Once you have selected the agents, click the action menu to download the CSV file."
            />
          </EuiText>
        }
        isStepOpen={!isTourHidden && tourState.isOpen}
        onFinish={onFinish}
        minWidth={360}
        maxWidth={360}
        step={1}
        stepsTotal={1}
        title={
          <FormattedMessage
            id="xpack.fleet.agentExportCSVTour.tourTitle"
            defaultMessage="Download CSV file"
          />
        }
        anchorPosition="upLeft"
        anchor="#agentListSelectionText"
      />
    </>
  );
};
