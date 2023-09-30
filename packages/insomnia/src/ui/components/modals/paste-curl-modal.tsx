import React, { useEffect, useRef, useState } from 'react';
import { OverlayContainer } from 'react-aria';

import { Request } from '../../../models/request';
import { convert } from '../../../utils/importers/convert';
import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
import { CodeEditor } from '../codemirror/code-editor';
/**** ><> ↑ --------- Importing necessary libraries and components -> This section of the code imports necessary libraries and components from various modules that would be used within this file. */

export const PasteCurlModal = ({ onHide, onImport, defaultValue }: ModalProps & { onImport: (req: Partial<Request>) => void; defaultValue?: string }) => {
  const modalRef = useRef<ModalHandle>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [req, setReq] = useState<any>({});

/**** ><> ↑ --------- Defining the PasteCurlModal component and initializing useState and useRef hooks -> The PasteCurlModal component is defined here, along with initialization of state and ref hooks for managing component state and modals respectively. */
  useEffect(() => {
    async function parseCurlToRequest() {
      try {
        const { data } = await convert(defaultValue || '');
        const { resources } = data;
        const importedRequest = resources[0];
        setIsValid(true);
        setReq(importedRequest);

      } catch (error) {
        console.log('error', error);
        setIsValid(false);
        setReq({});
      } finally {
        modalRef.current?.show();
      }
    }
    parseCurlToRequest();

  }, [defaultValue]);
/**** ><> ↑ --------- useEffect hook for side effects -> This useEffect hook segment is meant to handle side effects in the component. Here, it calls a function that converts a string to a request object and manages state accordingly. */

  return (
    <OverlayContainer onClick={e => e.stopPropagation()}>
      <Modal ref={modalRef} tall onHide={onHide}>
        <ModalHeader>Paste Curl to import request</ModalHeader>
        <ModalBody className="">
          <CodeEditor
            id="paste-curl-content"
            placeholder="Paste curl request here"
            className=" border-top"
            mode="text"
            dynamicHeight
            defaultValue={defaultValue}
            onChange={async value => {
              if (!value) {
                return;
              }
              try {
                const { data } = await convert(value);
                const { resources } = data;
                const importedRequest = resources[0];
                setIsValid(true);
                setReq(importedRequest);

              } catch (error) {
                console.log('error', error);
                setIsValid(false);
                setReq({});
              }
            }}
          />
        </ModalBody>
        <ModalFooter>
          <div className="margin-left italic txt-sm truncate">
            {isValid ? `Detected ${req.method} request to ${req.url}` : 'Invalid input'}
          </div>
          <div>
            <button className="btn" onClick={() => modalRef.current?.hide()}>
              Cancel
            </button>
            <button
              className="btn"
              onClick={() => {
                onImport(req);
                modalRef.current?.hide();
              }}
              disabled={!isValid}
            >
              Import
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </OverlayContainer>
  );
};
/**** ><> ↑ --------- Return section with actual JSX -> This section returns the JSX for the component, including the OverlayContainer, Modal, and all the child components. It describes how the component would look and behave. */
