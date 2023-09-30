import { JSONPath } from 'jsonpath-plus';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { docsTemplateTags } from '../../../common/documentation';
import { GrpcRequest } from '../../../models/grpc-request';
import { Request } from '../../../models/request';
import { WebSocketRequest } from '../../../models/websocket-request';
import { RenderError } from '../../../templating';
import { Link } from '../base/link';
import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalHeader } from '../base/modal-header';
/**** ><> ↑ --------- Importing necessary libraries and modules. -> These lines import necessary libraries and functions needed for this file. This will be called when the file is being loaded. */
export interface RequestRenderErrorModalOptions {
  error: RenderError | null;
  request: Request | WebSocketRequest | GrpcRequest | null;
}
export interface RequestRenderErrorModalHandle {
  show: (options: RequestRenderErrorModalOptions) => void;
  hide: () => void;
}
/**** ><> ↑ --------- Interface definitions for the error modal. -> Defines the 'RequestRenderErrorModalOptions' and 'RequestRenderErrorModalHandle' interfaces. They represent the structure of the data. This can be used whenever we want this type of object. */

export const RequestRenderErrorModal = forwardRef<RequestRenderErrorModalHandle, ModalProps>((_, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const [state, setState] = useState<RequestRenderErrorModalOptions>({
    error: null,
    request: null,
  });
  const { request, error } = state;

  useImperativeHandle(ref, () => ({
    hide: () => {
      modalRef.current?.hide();
    },
    show: options => {
      setState(options);
      modalRef.current?.show();
    },
  }), []);

  const fullPath = `Request.${error?.path}`;
  const result = JSONPath({ json: request, path: `$.${error?.path}` });
  const template = result && result.length ? result[0] : null;
  const locationLabel = template?.includes('\n') ? `line ${error?.location.line} of` : null;

  return (
    <Modal ref={modalRef}>
      <ModalHeader>Failed to Render Request</ModalHeader>
      <ModalBody>{request && error ? (
        <div className="pad">
          <div className="notice warning">
            <p>
              Failed to render <strong>{fullPath}</strong> prior to sending
            </p>
            <div className="pad-top-sm">
              <Link button href={docsTemplateTags} className="btn btn--clicky">
                Templating Documentation <i className="fa fa-external-link" />
              </Link>
            </div>
          </div>

          <p>
            <strong>Render error</strong>
            <code className="block selectable">{error.message}</code>
          </p>

          <p>
            <strong>Caused by the following field</strong>
            <code className="block">
              {locationLabel} {fullPath}
            </code>
          </p>
        </div>
      ) : null}</ModalBody>
    </Modal>
  );
});
/**** ><> ↑ --------- React component for displaying the error modal. -> This is the main component of the file. It utilizes hooks to manage its local state and render the modal component. It will be called when the component is used in a JSX expression. */

RequestRenderErrorModal.displayName = 'RequestRenderErrorModal';
/**** ><> ↑ --------- Setting a display name for the component. -> Defines the 'displayName' property of the component. This is used in error messages, and is usually helpful in a debugging context. */
