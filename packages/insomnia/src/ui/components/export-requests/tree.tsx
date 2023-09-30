import React, { FC } from 'react';

import { isGrpcRequest } from '../../../models/grpc-request';
import { isRequest } from '../../../models/request';
import { isWebSocketRequest } from '../../../models/websocket-request';
import type { Node } from '../modals/export-requests-modal';
import { RequestGroupRow } from './request-group-row';
import { RequestRow } from './request-row';
/**** ><> ↑ --------- Import statements ->  */

interface Props {
  root?: Node | null;
  handleSetRequestGroupCollapsed: (...args: any[]) => any;
  handleSetItemSelected: (...args: any[]) => any;
}
/**** ><> ↑ --------- Props interface declaration ->  */

export const Tree: FC<Props> = ({ root, handleSetRequestGroupCollapsed, handleSetItemSelected }) => {
  const renderChildren = (node?: Node | null) => {
    if (node == null) {
      return null;
    }
/**** ><> ↑ --------- Tree component declaration and start of implementation ->  */

    if (isRequest(node.doc) || isWebSocketRequest(node.doc) || isGrpcRequest(node.doc)) {
      return (
        <RequestRow
          key={node.doc._id}
          handleSetItemSelected={handleSetItemSelected}
          isSelected={node.selectedRequests === node.totalRequests}
          request={node.doc}
        />
      );
/**** ><> ↑ --------- If condition to check the type of request and return a RequestRow ->  */
    }

    if (node.totalRequests === 0) {
      // Don't show empty folders.
      return null;
    }
/**** ><> ↑ --------- If condition to check if there are no requests and returning null if so ->  */

    return (
      <RequestGroupRow
        key={node.doc._id}
        handleSetRequestGroupCollapsed={handleSetRequestGroupCollapsed}
        handleSetItemSelected={handleSetItemSelected}
        isCollapsed={node.collapsed}
        totalRequests={node.totalRequests}
        selectedRequests={node.selectedRequests}
        requestGroup={node.doc}
      >
        {node.children.map(child => renderChildren(child))}
      </RequestGroupRow>
    );
/**** ><> ↑ --------- If none of the above conditions are met, return a RequestGroupRow ->  */
  };

  return (
    <ul className="tree__list tree__list-root theme--tree__list">{renderChildren(root)}</ul>
  );
};
/**** ><> ↑ --------- Component return statement ->  */
