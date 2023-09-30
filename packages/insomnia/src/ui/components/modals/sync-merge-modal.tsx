import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import type { MergeConflict } from '../../../sync/types';
import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
/**** ><> ↑ --------- Importing dependencies -> This segment is used to import all necessary dependencies from various modules. */
export interface SyncMergeModalOptions {
  conflicts?: MergeConflict[];
  handleDone?: (conflicts?: MergeConflict[]) => void;
}
/**** ><> ↑ --------- SyncMergeModalOptions interface -> This is the interface for options that can be passed to the SyncMergeModal. It expects an optional array of MergeConflict and an optional handleDone function. */
export interface SyncMergeModalHandle {
  show: (options: SyncMergeModalOptions) => void;
  hide: () => void;
}
/**** ><> ↑ --------- SyncMergeModalHandle interface -> This is the interface for a referential handle used in the SyncMergeModal component, providing explicit methods including show and hide. */
export const SyncMergeModal = forwardRef<SyncMergeModalHandle, ModalProps>((_, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const [state, setState] = useState<SyncMergeModalOptions>({
    conflicts: [],
  });

  useImperativeHandle(ref, () => ({
    hide: () => modalRef.current?.hide(),
    show: ({ conflicts, handleDone }) => {
      setState({
        conflicts,
        handleDone,
      });
      modalRef.current?.show();
    },
  }), []);

  const { conflicts, handleDone } = state;

  return (
/**** ><> ↑ --------- SyncMergeModal function component -> This is a functional component wrapped with forwardRef to gain access to the ref of the component. The SyncMergeModal uses state to manage conflicts and a ref to handle the Modal component. */
    <Modal ref={modalRef}>
      <ModalHeader key="header">Resolve Conflicts</ModalHeader>
      <ModalBody key="body" className="pad text-center" noScroll>
        <table className="table--fancy table--outlined">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th
                style={{
                  width: '10rem',
                }}
              >
                Choose
              </th>
            </tr>
          </thead>
          <tbody>
            {conflicts?.length && conflicts.map(conflict => (
              <tr key={conflict.key}>
                <td className="text-left">{conflict.name}</td>
                <td className="text-left">{conflict.message}</td>
                <td className="no-wrap">
                  <label className="no-pad">
                    Mine{' '}
                    <input
                      type="radio"
                      value={conflict.mineBlob || ''}
                      checked={conflict.choose === conflict.mineBlob}
                      onChange={event => setState({
                        ...state,
                        conflicts: conflicts.map(c => c.key !== conflict.key ? c : { ...c, choose: event.target.value || null }),
                      })}
                    />
                  </label>
                  <label className="no-pad margin-left">
                    Theirs{' '}
                    <input
                      type="radio"
                      value={conflict.theirsBlob || ''}
                      checked={conflict.choose === conflict.theirsBlob}
                      onChange={event => setState({
                        ...state,
                        conflicts: conflicts.map(c => c.key !== conflict.key ? c : { ...c, choose: event.target.value || null }),
                      })}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ModalBody>
      <ModalFooter>
        <button
          className="btn"
          onClick={() => {
            handleDone?.(conflicts);
            modalRef.current?.hide();
          }}
        >
          Submit Resolutions
        </button>
      </ModalFooter>
    </Modal >
  );
/**** ><> ↑ --------- Modal JSX return -> This segment returns the Modal JSX. It includes a header, body which contains a table to show conflicts and a footer with a button to submit resolutions and close the modal. */
});
SyncMergeModal.displayName = 'SyncMergeModal';
/**** ><> ↑ --------- Setting displayName property -> This segment sets the displayName property of the SyncMergeModal component to 'SyncMergeModal'. This is useful for debugging purposes. */
