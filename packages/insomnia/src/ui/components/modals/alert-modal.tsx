import React, { forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react';

import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';

/**** ><> ↑ --------- Import Statements -> This section is primarily for importing necessary modules and dependencies for the code. It imports modules like 'React' and other components from base. */
export interface AlertModalOptions {
  title?: string;
  message?: ReactNode;
  addCancel?: boolean;
  okLabel?: React.ReactNode;
  onConfirm?: () => void | Promise<void>;
}
export interface AlertModalHandle {
  show: (options: AlertModalOptions) => void;
  hide: () => void;
}
/**** ><> ↑ --------- Interface Definitions -> This portion of the code is defining the 'AlertModalOptions' and 'AlertModalHandle' interfaces. These interfaces describe the shape of the properties expected in the AlertModal component. */
export const AlertModal = forwardRef<AlertModalHandle, ModalProps>((_, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const [state, setState] = useState<AlertModalOptions>({
    title: '',
    message: '',
    addCancel: false,
    okLabel: '',
  });

  useImperativeHandle(ref, () => ({
    hide: () => {
      modalRef.current?.hide();
    },
    show: ({ title, message, addCancel, onConfirm, okLabel }) => {
      setState({
        title,
        message,
        addCancel,
        okLabel,
        onConfirm,
      });
      modalRef.current?.show();
    },
  }), []);
/**** ><> ↑ --------- AlertModal Component Definition -> Here, the component 'AlertModal' is being defined using forwardRef. It will adjust its state based on the AlertModalOptions passed to the 'show' method of 'AlertModalHandle'. The 'hide' method will hide the modal. */

  const { message, title, addCancel, okLabel } = state;
  return (
    <Modal ref={modalRef} skinny>
      <ModalHeader>{title || 'Uh Oh!'}</ModalHeader>
      <ModalBody className="wide pad">{message}</ModalBody>
      <ModalFooter>
        <div>
          {addCancel ? (
            <button className="btn" onClick={() => modalRef.current?.hide()}>
              Cancel
            </button>
          ) : null}
          <button
            className="btn"
            onClick={() => {
              modalRef.current?.hide();
              if (typeof state.onConfirm === 'function') {
                state.onConfirm();
              }
            }}
          >
            {okLabel || 'Ok'}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
/**** ><> ↑ --------- Return JSX -> This segment is returning the JSX for the AlertModal. It's making use of the state to modify the modal attributes. The buttons to hide the modal or confirm are also defined in this segment. */
});
AlertModal.displayName = 'AlertModal';
/**** ><> ↑ --------- Setting Component Display Name -> This last line is setting the display name property of the AlertModal component to 'AlertModal'. This can be useful for debugging. */
