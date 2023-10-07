import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useParams, useRouteLoaderData } from 'react-router-dom';

import { RequestParameter, RequestSegment } from '../../../models/request';
import { useRequestSetter } from '../../hooks/use-request';
import { RequestLoaderData, WebSocketRequestLoaderData } from '../../routes/request';
import { CodeEditor } from '../codemirror/code-editor';
import { KeyValueEditor } from '../key-value-editor/key-value-editor';
import _ from "lodash"
import { generateId } from '../../../common/misc';

interface Props {
  bulk: boolean;
  disabled?: boolean;
}

export const RequestSegmentEditor: FC<Props> = ({
  bulk,
  disabled = false,
}) => {
  const { requestId } = useParams() as { requestId: string };
  const { activeRequest } = useRouteLoaderData('request/:requestId') as RequestLoaderData | WebSocketRequestLoaderData;

  // console.log("activeRequest", activeRequest)

  const url = activeRequest.url;

  // a list of all :(.*?)/ regex matches 
  const matches = [...url.matchAll(/\:([\w_-]*?)(?=($|[^[\w_-]))/g)].filter((a) => {
    // filter if it is a number as we assume it to be the port like :3000
    return Number.isNaN(parseInt(a[1])) && a[1] !== ""
  })



  if (matches.length === 0) {
    return <></>
  }
  console.log(matches)

  // pairs : empty with strings
  const segmentedCreatedViaUI = useMemo(() => {
    return matches.map((a, i) => {
      const seg = activeRequest?.segmentParams?.find?.((b) => b.id?.endsWith("ending" + i))
      return {
        name: a[1],
        value: seg?.value || "",
        disabled: seg?.disabled || false,
        id: seg?.id || generateId('pair') + "ending" + i,
        fileName: seg?.fileName || "",
      }
    })
  }, [url, activeRequest])


  const patchRequest = useRequestSetter();
  // const handleBulkUpdate = useCallback((paramsString: string) => {
  //   const parameters: {
  //     name: string;
  //     value: string;
  //   }[] = [];

  //   const rows = paramsString.split(/\n+/);
  //   for (const row of rows) {
  //     const [rawName, rawValue] = row.split(/:(.*)$/);
  //     const name = (rawName || '').trim();
  //     const value = (rawValue || '').trim();

  //     if (!name && !value) {
  //       continue;
  //     }

  //     parameters.push({
  //       name,
  //       value,
  //     });
  //   }
  //   patchRequest(requestId, { parameters });
  // }, [patchRequest, requestId]);

  // let paramsString = '';
  // for (const param of activeRequest.parameters) {
  //   // Make sure it's not disabled
  //   if (param.disabled) {
  //     continue;
  //   }
  //   // Make sure it's not blank
  //   if (!param.name && !param.value) {
  //     continue;
  //   }

  //   paramsString += `${param.name}: ${param.value}\n`;
  // }

  const onChangeParameter = useCallback((segmentParams: RequestSegment[]) => {
  // console.log("onChange", segmentParams);

    patchRequest(requestId, {
      segmentParams: segmentParams
      // parameters: segmentParams,
    });
  }, [patchRequest, requestId]);

  useEffect(() => {
    // console.log("Changing names", segmentedCreatedViaUI.map((a) => a.name).join(","));
    onChangeParameter(segmentedCreatedViaUI)
  }, [segmentedCreatedViaUI.map((a) => a.name).join(",")])


  // if (bulk) {
  //   return (
  //     <CodeEditor
  //       id="request-parameters-editor"
  //       onChange={handleBulkUpdate}
  //       defaultValue={paramsString}
  //       enableNunjucks
  //       readOnly={disabled}
  //     />
  //   );
  // }

  return (
    <>

      <KeyValueEditor
        title={"segment parameters (found in URL)"}
        hideToolbar={true}
        allowMultiline
        namePlaceholder="name"
        valuePlaceholder="value"
        descriptionPlaceholder="description"
        pairs={segmentedCreatedViaUI
          // activeRequest.parameters
          // activeRequest?.segmentParams || requestSegments
        }
        cantDelete={true}
        onChange={onChangeParameter}
        // isDisabled={disabled}
        isFieldInferred={true}
      />
    </>
  );
};
