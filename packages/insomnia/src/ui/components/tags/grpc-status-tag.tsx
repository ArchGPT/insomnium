import { status } from '@grpc/grpc-js';
import classnames from 'classnames';
import React, { FC, memo } from 'react';
/**** ><> ↑ --------- Module imports ->  */

import { Tooltip } from '../tooltip';
/**** ><> ↑ --------- Component import ->  */

interface Props {
  statusCode?: number;
  small?: boolean;
  statusMessage?: string;
  tooltipDelay?: number;
}
/**** ><> ↑ --------- Interface definition ->  */

export const GrpcStatusTag: FC<Props> = memo(({ statusMessage, statusCode, small, tooltipDelay }) => {
  const colorClass = statusCode === status.OK ? 'bg-success' : 'bg-danger';
  const message = statusCode === status.OK ? 'OK' : statusMessage;
  return (
    <div
      className={classnames('tag', colorClass, {
        'tag--small': small,
      })}
      data-testid="response-status-tag"
    >
      <Tooltip message={message} position="bottom" delay={tooltipDelay}>
        <strong>{statusCode} </strong>
        {message}
      </Tooltip>
    </div>
  );
});
/**** ><> ↑ --------- Component Function ->  */

GrpcStatusTag.displayName = 'GrpcStatusTag';
/**** ><> ↑ --------- Setting Display Name ->  */
