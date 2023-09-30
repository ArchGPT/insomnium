import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import * as models from '../../../models/index';
import { RequestGroup } from '../../../models/request-group';
import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
import { EnvironmentEditor, EnvironmentEditorHandle } from '../editors/environment-editor';
/**** ><> ↑ --------- Import statements -> This segment is for importing necessary modules and components from various libraries and files. The imports include both common libraries such as 'react' and custom components or models from the project's own directories. */

interface State {
  requestGroup: RequestGroup | null;
}

export interface EnvironmentEditModalOptions {
  requestGroup: RequestGroup;
}
export interface EnvironmentEditModalHandle {
  show: (options: EnvironmentEditModalOptions) => void;
  hide: () => void;
}
/**** ><> ↑ --------- Interface declarations -> This segment declares the 'State', 'EnvironmentEditModalOptions', and 'EnvironmentEditModalHandle' interfaces. These types will be used in state management and function signatures in the following code. */
export const EnvironmentEditModal = forwardRef<EnvironmentEditModalHandle, ModalProps>((props, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const environmentEditorRef = useRef<EnvironmentEditorHandle>(null);
  const [state, setState] = useState<State>({
    requestGroup: null,
  });

  useImperativeHandle(ref, () => ({
    hide: () => {
      modalRef.current?.hide();
    },
    show: ({ requestGroup }) => {
      setState(state => ({ ...state, requestGroup }));
      modalRef.current?.show();
    },
  }), []);

  const { requestGroup } = state;
/**** ><> ↑ --------- Component Definition -> This segment is the initial setup of the 'EnvironmentEditModal' component using React's 'forwardRef'. It outlines the initial state, useRef hooks, and useImperativeHandle hook for managing child component behaviors. */
  const environmentInfo = {
    object: requestGroup ? requestGroup.environment : {},
    propertyOrder: requestGroup && requestGroup.environmentPropertyOrder,
  };
  return (
    <Modal ref={modalRef} tall {...props}>
      <ModalHeader>Environment Overrides (JSON Format)</ModalHeader>
      <ModalBody noScroll className="pad-top-sm">
        <EnvironmentEditor
          ref={environmentEditorRef}
          key={requestGroup ? requestGroup._id : 'n/a'}
          environmentInfo={environmentInfo}
          onBlur={() => {
            setState({ requestGroup });
            if (environmentEditorRef.current?.isValid()) {
              try {
                const data = environmentEditorRef.current?.getValue();
                if (state.requestGroup && data) {
                  models.requestGroup.update(state.requestGroup, {
                    environment: data.object,
                    environmentPropertyOrder: data.propertyOrder,
                  });
                }
              } catch (err) {
                console.warn('Failed to update environment', err);
              }
            }
          }}
        />
      </ModalBody>
      <ModalFooter>
        <div className="margin-left italic txt-sm">
          * Used to override data in the global environment
        </div>
        <button className="btn" onClick={() => modalRef.current?.hide()}>
          Close
        </button>
      </ModalFooter>
    </Modal >
  );
/**** ><> ↑ --------- Component Return Statement -> This is the JSX returned by the 'EnvironmentEditModal' component. It includes the definitions and properties of 'Modal', 'ModalHeader', 'ModalBody', 'EnvironmentEditor', and 'ModalFooter'. */
});
EnvironmentEditModal.displayName = 'EnvironmentEditModal';
/**** ><> ↑ --------- Component Display Name Setting -> This line sets the display name of the 'EnvironmentEditModal'. This is helpful for debugging, especially when the component is used in higher-order components. */
