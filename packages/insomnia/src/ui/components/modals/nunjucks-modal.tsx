import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Workspace } from '../../../models/workspace';
import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
import { TagEditor } from '../templating/tag-editor';
import { VariableEditor } from '../templating/variable-editor';
/**** ><> ↑ --------- Imports of libraries and components ->  */

interface Props {
  workspace: Workspace;
}
/**** ><> ↑ --------- Props interface declaration ->  */

interface State {
  isTag: boolean;
  template: string;
  onDone: Function;
}
/**** ><> ↑ --------- State interface declaration ->  */

interface NunjucksModalOptions {
  template: string;
  onDone: Function;
}
/**** ><> ↑ --------- NunjucksModalOptions interface declaration ->  */

export interface NunjucksModalHandle {
  show: (options: NunjucksModalOptions) => void;
  hide: () => void;
}
/**** ><> ↑ --------- NunjucksModalHandle interface declaration ->  */
export const NunjucksModal = forwardRef<NunjucksModalHandle, ModalProps & Props>((props, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const [state, setState] = useState<State>({
    isTag: false,
    template: '',
    onDone: () => { },
  });

  useImperativeHandle(ref, () => ({
    hide: () => {
      modalRef.current?.hide();
    },
    show: ({ onDone, template }) => {
      setState({
        isTag: template.indexOf('{%') === 0,
        template,
        onDone,
      });
      modalRef.current?.show();
    },
  }), []);
/**** ><> ↑ --------- NunjucksModal Component declaration ->  */

  const handleTemplateChange = (template: string) => {
    setState(state => ({
      ...state,
      template,
    }));
  };
/**** ><> ↑ --------- HandleTemplateChange function declaration ->  */

  const { workspace } = props;
  const { template, isTag } = state;
  const title = isTag ? 'Tag' : 'Variable';
  let editor: JSX.Element | null = null;
  if (isTag) {
    editor = <TagEditor onChange={handleTemplateChange} defaultValue={template} workspace={workspace} />;
  } else {
    editor = <VariableEditor onChange={handleTemplateChange} defaultValue={template} />;
  }

  return (
    <Modal
      ref={modalRef}
      onHide={() => {
        state.onDone(state.template);
        setState(state => ({
          ...state,
          template: '',
        }));
      }}
    >
      <ModalHeader>Edit {title}</ModalHeader>
      <ModalBody className="pad">
        <form
          onSubmit={event => {
            event.preventDefault();
            modalRef.current?.hide();
          }}
        >{editor}</form>
      </ModalBody>
      <ModalFooter>
        <button className="btn" onClick={() => modalRef.current?.hide()}>
          Done
        </button>
      </ModalFooter>
    </Modal>
  );
/**** ><> ↑ --------- Component main rendering logic ->  */
});
NunjucksModal.displayName = 'NunjucksModal';
/**** ><> ↑ --------- Setting Component display name ->  */
