import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
/**** ><> ↑ --------- Module and dependency imports */
interface State {
  title: string;
  message: React.ReactNode;
  yesText: string;
  noText: string;
  onDone?: (success: boolean) => Promise<void>;
}
export interface AskModalOptions {
  title?: string;
  message: React.ReactNode;
  onDone?: (success: boolean) => Promise<void>;
  yesText?: string;
  noText?: string;
}
/**** ><> ↑ --------- State and AskModalOptions interface definitions */
export interface AskModalHandle {
  show: (options: AskModalOptions) => void;
  hide: () => void;
}
/**** ><> ↑ --------- AskModalHandle interface definition */
export const AskModal = forwardRef<AskModalHandle, ModalProps>((_, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const [state, setState] = useState<State>({
    title: '',
    message: '',
    yesText: 'Yes',
    noText: 'No',
    onDone: async () => { },
  });

/**** ><> ↑ --------- AskModal functional component definition and state initialization */
  useImperativeHandle(ref, () => ({
    hide: () => {
      modalRef.current?.hide();
    },
    show: ({ title, message, onDone, yesText, noText }) => {
      setState({
        title: title || 'Confirm',
        message: message || 'No message provided',
        yesText: yesText || 'Yes',
        noText: noText || 'No',
        onDone,
      });
      modalRef.current?.show();
    },
  }), []);
/**** ><> ↑ --------- useImperativeHandle hook for exposing component methods */
  const { message, title, yesText, noText, onDone } = state;
  return (
    <Modal ref={modalRef}>
      <ModalHeader>{title || 'Confirm?'}</ModalHeader>
      <ModalBody className="wide pad">{message}</ModalBody>
      <ModalFooter>
        <div>
          <button
            className="btn"
            onClick={() => {
              modalRef.current?.hide();
              onDone?.(false);
            }}
          >
            {noText}
          </button>
          <button
            className="btn"
            onClick={() => {
              modalRef.current?.hide();
              onDone?.(true);
            }}
          >
            {yesText}
          </button>
        </div>
      </ModalFooter>
    </Modal>
/**** ><> ↑ --------- Rendering of Modal structure */
  );
});
AskModal.displayName = 'AskModal';
/**** ><> ↑ --------- Setting displayName */
