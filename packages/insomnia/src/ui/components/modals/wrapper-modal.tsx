import React, { forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react';

import { Modal, ModalHandle, type ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalHeader } from '../base/modal-header';
/**** ><> ↑ --------- Import dependencies -> This segment imports the necessary classes and methods from the react library, and some other components from base directory. */

interface WrapperModalOptions {
  title: ReactNode;
  body: ReactNode;
  tall?: boolean;
  skinny?: boolean;
  wide?: boolean;
}
export interface WrapperModalHandle {
  show: (options: WrapperModalOptions) => void;
  hide: () => void;
}
/**** ><> ↑ --------- Declare WrapperModalOptions and WrapperModalHandle interfaces -> This segment declares the 'WrapperModalOptions' interface to define the shape of the options object that 'WrapperModal' will receive. It also declares the 'WrapperModalHandle' interface to specify the methods that 'WrapperModal' exposes. */
export const WrapperModal = forwardRef<WrapperModalHandle, ModalProps>((props, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const [state, setState] = useState<WrapperModalOptions>({
    title: '',
    body: null,
    tall: false,
    skinny: false,
    wide: false,
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

  const { title, body, tall, skinny, wide } = state;

  return (
    <Modal ref={modalRef} tall={tall} skinny={skinny} wide={wide} {...props}>
      <ModalHeader>{title || 'Uh Oh!'}</ModalHeader>
      <ModalBody>{body}</ModalBody>
    </Modal>
  );
/**** ><> ↑ --------- Define WrapperModal component -> This segment defines the 'WrapperModal' functional component. It uses React's 'useRef' and 'useState' Hooks to manage local state, and the 'useImperativeHandle' Hook to expose methods. The 'show' method displays the modal with the provided options, and the 'hide' method hides the modal. */

});
WrapperModal.displayName = 'WrapperModal';
/**** ><> ↑ --------- Set display name for the WrapperModal component -> This segment sets the 'displayName' property of the 'WrapperModal' component, which can be helpful for debugging. */
