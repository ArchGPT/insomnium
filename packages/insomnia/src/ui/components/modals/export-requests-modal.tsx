import React, { useEffect, useRef, useState } from 'react';
import { OverlayContainer } from 'react-aria';
import { useFetcher, useParams } from 'react-router-dom';

import { exportRequestsToFile } from '../../../common/export';
import * as models from '../../../models';
import { GrpcRequest, isGrpcRequest } from '../../../models/grpc-request';
import { isRequest, Request } from '../../../models/request';
import { RequestGroup } from '../../../models/request-group';
import { isWebSocketRequest, WebSocketRequest } from '../../../models/websocket-request';
import { Workspace } from '../../../models/workspace';
import { Child, WorkspaceLoaderData } from '../../routes/workspace';
import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
import { Tree } from '../export-requests/tree';
/**** ><> ↑ --------- Import statements -> This section is dedicated to importing necessary libraries and modules. */

export interface Node {
  doc: Request | WebSocketRequest | GrpcRequest | RequestGroup;
  children: Node[];
  collapsed: boolean;
  totalRequests: number;
  selectedRequests: number;
}

export interface State {
  treeRoot: Node | null;
}
/**** ><> ↑ --------- Interface definitions -> This section defines the interfaces `Node` and `State` that are used in the rest of the code. */

export const ExportRequestsModal = ({ workspace, onHide }: { workspace: Workspace } & ModalProps) => {
  const modalRef = useRef<ModalHandle>(null);
  const { organizationId, projectId } = useParams() as { organizationId: string; projectId: string };
  const workspaceFetcher = useFetcher();
  const [state, setState] = useState<State>();
/**** ><> ↑ --------- Export Requests Modal Functional Component -> This section defines the functional component `ExportRequestsModal` and its initial states. */

  useEffect(() => {
    const isIdleAndUninitialized = workspaceFetcher.state === 'idle' && !workspaceFetcher.data;
    if (isIdleAndUninitialized) {
      workspaceFetcher.load(`/organization/${organizationId}/project/${projectId}/workspace/${workspace._id}`);
    }
  }, [organizationId, projectId, workspaceFetcher, workspace._id]);
  const workspaceLoaderData = workspaceFetcher?.data as WorkspaceLoaderData;
/**** ><> ↑ --------- First useEffect block -> This section is a useEffect hook which calls workspaceFetcher method when the component first mounts. */

  useEffect(() => {
    const createTreeNode = (child: Child): Node => {
      const docIsRequest = isRequest(child.doc) || isWebSocketRequest(child.doc) || isGrpcRequest(child.doc);
      const children = child.children.map((child: Child) => createTreeNode(child));
      const totalRequests = +docIsRequest + children.reduce((acc, { totalRequests }) => acc + totalRequests, 0);
      return {
        doc: child.doc,
        collapsed: false,
        children,
        totalRequests: totalRequests,
        selectedRequests: totalRequests, // Default select all
      };
    };
    const requestTree = workspaceLoaderData?.requestTree || [];
    const children: Node[] = requestTree.map(child => createTreeNode(child));
    setState({
      treeRoot: {
        doc: {
          ...models.requestGroup.init(),
          _id: 'all',
          type: models.requestGroup.type,
          name: 'All requests',
          parentId: '',
          modified: 0,
          created: 0,
          isPrivate: false,
        },
        collapsed: false,
        children: children,
        totalRequests: children.map(child => child.totalRequests).reduce((acc, totalRequests) => acc + totalRequests, 0),
        selectedRequests: children.map(child => child.totalRequests).reduce((acc, totalRequests) => acc + totalRequests, 0), // Default select all
      },
    });
  }, [workspaceLoaderData?.requestTree]);
/**** ><> ↑ --------- Second useEffect block -> This section is another useEffect hook which processes the request tree and sets the state. */

  useEffect(() => {
    modalRef.current?.show();
  }, []);
/**** ><> ↑ --------- Third useEffect block -> This section is a useEffect hook which shows the modal when the component first mounts. */
  const getSelectedRequestIds = (node: Node): string[] => {
    const docIsRequest = isRequest(node.doc) || isWebSocketRequest(node.doc) || isGrpcRequest(node.doc);
    if (docIsRequest && node.selectedRequests === node.totalRequests) {
      return [node.doc._id];
    }
    return node.children.map(child => getSelectedRequestIds(child)).reduce((acc, reqIds) => [...acc, ...reqIds], []);
  };

  const setItemSelected = (node: Node, isSelected: boolean, id?: string) => {
    if (id === null || node.doc._id === id) {
      // Switch the flags of all children in this subtree.
      node.children.forEach(child => setItemSelected(child, isSelected));
      node.selectedRequests = isSelected ? node.totalRequests : 0;
      return true;
    }
    for (const child of node.children) {
      const found = setItemSelected(child, isSelected, id);
      if (found) {
        node.selectedRequests = node.children.map(ch => ch.selectedRequests).reduce((acc, selected) => acc + selected, 0);
        return true;
      }
    }
    return false;
  };

  const setRequestGroupCollapsed = (node: Node, isCollapsed: boolean, requestGroupId: string): boolean => {
    if (node.doc._id === requestGroupId) {
      node.collapsed = isCollapsed;
      return true;
    }
    return !!node.children.find(child => setRequestGroupCollapsed(child, isCollapsed, requestGroupId));
  };
/**** ><> ↑ --------- Helper functions -> This section declares helper functions which are used in the return statement for event handlers. */

  const isExportDisabled = state?.treeRoot?.selectedRequests === 0 || false;
  return (
    <OverlayContainer onClick={e => e.stopPropagation()}>
      <Modal ref={modalRef} tall onHide={onHide}>
        <ModalHeader>Select Requests to Export</ModalHeader>
        <ModalBody>
          <div className="requests-tree">
            <Tree
              root={state?.treeRoot}
              handleSetRequestGroupCollapsed={(requestGroupId: string, isCollapsed: boolean) => {
                if (state?.treeRoot && setRequestGroupCollapsed(state?.treeRoot, isCollapsed, requestGroupId)) {
                  setState({ treeRoot: state?.treeRoot });
                }
              }}
              handleSetItemSelected={(itemId: string, isSelected: boolean) => {
                if (state?.treeRoot && setItemSelected(state?.treeRoot, isSelected, itemId)) {
                  setState({ treeRoot: state?.treeRoot });
                }
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div>
            <button className="btn" onClick={() => modalRef.current?.hide()}>
              Cancel
            </button>
            <button
              className="btn"
              onClick={() => {
                if (state?.treeRoot && state?.treeRoot.selectedRequests > 0) {
                  exportRequestsToFile(getSelectedRequestIds(state?.treeRoot));
                  modalRef.current?.hide();
                }
              }}
              disabled={isExportDisabled}
            >
              Export
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </OverlayContainer>
  );
};
/**** ><> ↑ --------- Render section -> In this section the component is returned. This includes the modal and tree view to select and export requests. */
