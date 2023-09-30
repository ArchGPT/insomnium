import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
import { showModal } from '.';
/**** ><> ↑ --------- Importing necessary libraries and components -> In this section, necessary libraries such as React and the custom components like Modal, ModalHeader, etc are imported for use in the file. */

export interface SelectModalOptions {
  message: string | null;
  onDone?: (selectedValue: string | null) => void | Promise<void>;
  options: {
    name: string;
    value: string;
  }[];
  title: string | null;
  value: string | null;
}
export interface SelectModalHandle {
  show: (options: SelectModalOptions) => void;
  hide: () => void;
}
/**** ><> ↑ --------- Declaration of SelectModalOptions and SelectModalHandle interfaces -> These interfaces define the shape of the options object that can be passed to the SelectModal and the methods that the SelectModal exposes respectively. */

export const SelectModal = forwardRef<SelectModalHandle, ModalProps>((_, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const [state, setState] = useState<SelectModalOptions>({
    message: null,
    options: [],
    title: null,
    value: null,
  });

  useImperativeHandle(ref, () => ({
    hide: () => {
      modalRef.current?.hide();
    },
    show: options => {
      setState(options);
      modalRef.current?.show();
    },
  }), []);
  const { message, title, options, value, onDone } = state;

  return (
    <Modal ref={modalRef}>
      <ModalHeader>{title || 'Confirm?'}</ModalHeader>
      <ModalBody className="wide pad">
        <p>{message}</p>
        <div className="form-control form-control--outlined">
          <select onChange={event => setState(state => ({ ...state, value: event.target.value }))} value={value ?? undefined}>
            {options.map(({ name, value }) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          className="btn"
          onClick={() => {
            modalRef.current?.hide();
            onDone?.(value);
          }}
        >
          Done
        </button>
      </ModalFooter>
    </Modal>
  );
});
/**** ><> ↑ --------- Definition of SelectModal component -> This is the heart of the component. It declares the SelectModal component using the React.forwardRef function. It has internal state defined using useState for managing the options and implements the show and hide methods which can be called from outside the component. */
SelectModal.displayName = 'SelectModal';

export const showSelectModal = (opts: SelectModalOptions) => showModal(SelectModal, opts);
/**** ><> ↑ --------- Declaration of showSelectModal function -> This function is a wrapper around the showModal function. It centralizes the call to showModal with the SelectModal component, allowing for code reusability. */
