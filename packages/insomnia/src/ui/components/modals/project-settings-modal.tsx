import React, { FC, useEffect, useRef } from 'react';
import { OverlayContainer } from 'react-aria';
import { useFetcher, useParams } from 'react-router-dom';

import { strings } from '../../../common/strings';
import { isRemoteProject, Project } from '../../../models/project';
import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalHeader } from '../base/modal-header';
import { PromptButton } from '../base/prompt-button';
import { HelpTooltip } from '../help-tooltip';
/**** ><> ↑ --------- Import declarations -> This segment of the code imports necessary dependencies from both native and third-party libraries as well as local files. */

export interface ProjectSettingsModalProps extends ModalProps {
  project: Project;
}
/**** ><> ↑ --------- Type definitions -> Declaration of types and interfaces used in the project. It's good for type checking and ensuring the code robustness. */

export const ProjectSettingsModal: FC<ProjectSettingsModalProps> = ({ project, onHide }) => {
  const modalRef = useRef<ModalHandle>(null);
  const { organizationId } = useParams<{organizationId: string}>();
  const { submit } = useFetcher();

  useEffect(() => {
    modalRef.current?.show();
  }, []);

  const isRemote = isRemoteProject(project);

/**** ><> ↑ --------- Component Function -> Initial definition of the functional component and its variables using functional component structures such as `useEffect`, `useRef`, and `useParams`. */
  return (
    <OverlayContainer>
      <Modal onHide={onHide} ref={modalRef}>
        <ModalHeader key={`header::${project._id}`}>
          {strings.project.singular} Settings{' '}
          <div className="txt-sm selectable faint monospace">{project._id}</div>
        </ModalHeader>
        <ModalBody key={`body::${project._id}`} className="pad">
          <div className="form-control form-control--outlined">
            <label>
              Name
              {isRemote && (
                <>
                  <HelpTooltip className="space-left">
                    To rename a {strings.remoteProject.singular.toLowerCase()}{' '}
                    {strings.project.singular.toLowerCase()} please visit{' '}
                    <a href="https://app.insomnia.rest/app/teams">
                      the insomnia website.
                    </a>
                  </HelpTooltip>
                  <input disabled readOnly defaultValue={project.name} />
                </>
              )}
              {!isRemote && (
                <input
                  type="text"
                  placeholder={`My ${strings.project.singular}`}
                  defaultValue={project.name}
                  onChange={e => {
                    submit(
                      {
                        name: e.currentTarget.value,
                      },
                      {
                        action: `/organization/${organizationId}/project/${project._id}/rename`,
                        method: 'post',
                      }
                    );
                  }}
                />
              )}
            </label>
          </div>
          <h2>Actions</h2>
          <div className="form-control form-control--padded">
            <PromptButton
              onClick={() =>
                submit(
                  {},
                  { method: 'post', action: `/organization/${organizationId}/project/${project._id}/delete` }
                )
              }
              className="width-auto btn btn--clicky inline-block"
            >
              <i className="fa fa-trash-o" /> Delete
            </PromptButton>
          </div>
        </ModalBody>
      </Modal>
    </OverlayContainer>
  );
/**** ><> ↑ --------- Component Return -> The return statement of the functional component which defines the rendered user interface. It includes multiple nested components from Modal Header to Modal Body. */
};

ProjectSettingsModal.displayName = 'ProjectSettingsModal';
/**** ><> ↑ --------- Component Display Name -> Assigning the display name of the functional component. It helps during debugging and testing. */

export default ProjectSettingsModal;
/**** ><> ↑ --------- Component Export -> The final export statement for the functional component to be used outside of the module. */
