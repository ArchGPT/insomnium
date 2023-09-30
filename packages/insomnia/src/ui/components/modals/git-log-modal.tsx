import React, { FC, useEffect, useRef } from 'react';
import { OverlayContainer } from 'react-aria';
import { useFetcher, useParams } from 'react-router-dom';

import { GitLogLoaderData } from '../../routes/git-actions';
import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
import { TimeFromNow } from '../time-from-now';
import { Tooltip } from '../tooltip';
/**** ><> ↑ --------- Importing modules -> This section of code imports necessary modules from libraries and other script files. */

type Props = ModalProps & {
  branch: string;
};
/**** ><> ↑ --------- Type declaration -> Declares the type Props for type validation in following script. */

export const GitLogModal: FC<Props> = ({ branch, onHide }) => {
  const { organizationId, projectId, workspaceId } = useParams() as {
    organizationId: string;
    projectId: string;
    workspaceId: string;
  };
  const modalRef = useRef<ModalHandle>(null);
  const gitLogFetcher = useFetcher<GitLogLoaderData>();

/**** ><> ↑ --------- Function component declaration -> Declares the GitLogModal function component and its hooks. */
  const isLoading = gitLogFetcher.state !== 'idle';
  useEffect(() => {
    if (gitLogFetcher.state === 'idle' && !gitLogFetcher.data) {
      gitLogFetcher.load(`/organization/${organizationId}/project/${projectId}/workspace/${workspaceId}/git/log`);
    }
  }, [organizationId, projectId, workspaceId, gitLogFetcher]);
/**** ><> ↑ --------- Handling fetch state -> Lines that handle the loading state of the fetched git log data. */
  useEffect(() => {
    modalRef.current?.show();
  }, []);

/**** ><> ↑ --------- Display Modal upon updating -> Makes the modal visible upon updating the component. */
  const { log } = gitLogFetcher.data && 'log' in gitLogFetcher.data ? gitLogFetcher.data : { log: [] };
/**** ><> ↑ --------- Data extraction -> Extract the log data from the fetcher data. */

  return (
    <OverlayContainer>
      <Modal ref={modalRef} onHide={onHide}>
        <ModalHeader>Git History</ModalHeader>
        <ModalBody className="pad">
          {isLoading && <div className="txt-sm faint italic">
            <i className="fa fa-spinner fa-spin space-right" />
            Loading git log...
          </div>}
          {!isLoading && <table className="table--fancy table--striped">
            <thead>
              <tr>
                <th className="text-left">Message</th>
                <th className="text-left">When</th>
                <th className="text-left">Author</th>
              </tr>
            </thead>
            <tbody>{log.map(entry => {
              const {
                commit: { author, message },
                oid,
              } = entry;
              return (
                <tr key={oid}>
                  <td>{message}</td>
                  <td>
                    <TimeFromNow
                      className="no-wrap"
                      timestamp={author.timestamp * 1000}
                      intervalSeconds={30}
                    />
                  </td>
                  <td>
                    <Tooltip message={`${author.name} <${author.email}>`} delay={800}>
                      {author.name}
                    </Tooltip>
                  </td>
                </tr>
              );
            })}</tbody>
          </table>}
        </ModalBody>
        <ModalFooter>
          <div className="margin-left italic txt-sm">
            <i className="fa fa-code-fork" /> {branch}
          </div>
          <div>
            <button className="btn" onClick={() => modalRef.current?.hide()}>
              Done
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </OverlayContainer>
  );
/**** ><> ↑ --------- JSX structure and data mapping -> This large section of code describes the visual composition of the component, including conditionally rendering a loading text or a table of git log data. */
};
GitLogModal.displayName = 'GitLogModal';
/**** ><> ↑ --------- Component display name declaration -> Assigns a display name to the function component. */
