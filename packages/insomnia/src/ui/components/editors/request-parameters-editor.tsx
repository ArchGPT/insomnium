import React, { FC, useCallback } from 'react';
import { useParams, useRouteLoaderData } from 'react-router-dom';
/**** ><> ↑ --------- Importing dependencies */

import { RequestParameter } from '../../../models/request';
import { useRequestPatcher } from '../../hooks/use-request';
import { RequestLoaderData, WebSocketRequestLoaderData } from '../../routes/request';
import { CodeEditor } from '../codemirror/code-editor';
import { KeyValueEditor } from '../key-value-editor/key-value-editor';
/**** ><> ↑ --------- Importing internal modules */

interface Props {
  bulk: boolean;
  disabled?: boolean;
}
/**** ><> ↑ --------- Declaration of an interface */

export const RequestParametersEditor: FC<Props> = ({
  bulk,
  disabled = false,
}) => {
  const { requestId } = useParams() as { requestId: string };
  const { activeRequest } = useRouteLoaderData('request/:requestId') as RequestLoaderData | WebSocketRequestLoaderData;
  const patchRequest = useRequestPatcher();
/**** ><> ↑ --------- Component and Hooks initialization */
  const handleBulkUpdate = useCallback((paramsString: string) => {
    const parameters: {
      name: string;
      value: string;
    }[] = [];

    const rows = paramsString.split(/\n+/);
    for (const row of rows) {
      const [rawName, rawValue] = row.split(/:(.*)$/);
      const name = (rawName || '').trim();
      const value = (rawValue || '').trim();

      if (!name && !value) {
        continue;
      }

      parameters.push({
        name,
        value,
      });
    }
    patchRequest(requestId, { parameters });
  }, [patchRequest, requestId]);
/**** ><> ↑ --------- Bulk update handler definition */

  let paramsString = '';
  for (const param of activeRequest.parameters) {
    // Make sure it's not disabled
    if (param.disabled) {
      continue;
    }
    // Make sure it's not blank
    if (!param.name && !param.value) {
      continue;
    }

    paramsString += `${param.name}: ${param.value}\n`;
  }
/**** ><> ↑ --------- Params string generation */

  const onChangeParameter = useCallback((parameters: RequestParameter[]) => {
    patchRequest(requestId, { parameters });
  }, [patchRequest, requestId]);
/**** ><> ↑ --------- Change Parameter handler definition */

  if (bulk) {
    return (
      <CodeEditor
        id="request-parameters-editor"
        onChange={handleBulkUpdate}
        defaultValue={paramsString}
        enableNunjucks
        readOnly={disabled}
      />
    );
  }
/**** ><> ↑ --------- Conditional rendering based on 'bulk' prop */

  return (
    <KeyValueEditor
      allowMultiline
      namePlaceholder="name"
      valuePlaceholder="value"
      descriptionPlaceholder="description"
      pairs={activeRequest.parameters}
      onChange={onChangeParameter}
      isDisabled={disabled}
    />
  );
};
/**** ><> ↑ --------- Default component rendering */
