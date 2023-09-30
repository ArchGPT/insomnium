import { invariant } from '../../../utils/invariant';
import { ModalProps } from '../base/modal';
import { AlertModal, AlertModalOptions } from './alert-modal';
import { ErrorModal, ErrorModalOptions } from './error-modal';
import { PromptModal, PromptModalOptions } from './prompt-modal';
/**** ><> ↑ --------- Module imports -> These lines import necessary modules for the file */

interface ModalHandle {
  show:(options: any) => void;
  hide:() => void;
}

/**** ><> ↑ --------- ModalHandle Interface declaration -> Declaration of an interface for modal handling */
const modals: Record<string, ModalHandle> = {};

/**** ><> ↑ --------- Modals constant creation -> A constant 'modals' is created as an empty record */
export function registerModal(instance: any, modalName?: string) {
  if (instance === null) {
    // Modal was unmounted
    return;
  }

  modals[modalName ?? instance.constructor.name] = instance;
}
/**** ><> ↑ --------- registerModal function -> This function registers a modal in the 'modals' record */

type GetRefHandleFromProps<Props> = Props extends React.RefAttributes<infer TModalHandle> ? TModalHandle : never;

type ModalComponent<TModalProps> = React.ForwardRefExoticComponent<TModalProps & React.RefAttributes<GetRefHandleFromProps<TModalProps>>>;

type ModalHandleShowOptions<TModalHandle> = TModalHandle extends {
  show: (options: infer TOptions) => void;
} ? TOptions : any;

/**** ><> ↑ --------- Type declarations -> Various types used in the next part of the code are declared */
export function showModal<TModalProps extends ModalProps & React.RefAttributes<{
  show:(options: any) => void;
}>>(
  modalComponent: ModalComponent<TModalProps>, config?: ModalHandleShowOptions<GetRefHandleFromProps<TModalProps>>,
) {
  const name = modalComponent.name || modalComponent.displayName;
  invariant(name, 'Modal must have a name or displayName');
  window.main.trackPageView({ name });

  const modalHandle = getModalComponentHandle(name) as unknown as GetRefHandleFromProps<TModalProps>;

  return modalHandle.show(config);
}
/**** ><> ↑ --------- showModal function -> This function shows a modal and handles the events and routing associated with it */

export function showPrompt(options: PromptModalOptions) {
  return showModal(PromptModal, options);
}

export function showAlert(config: AlertModalOptions) {
  return showModal(AlertModal, config);
}

export function showError(config: ErrorModalOptions) {
  try {
    return showModal(ErrorModal, config);
  } catch (err) {
    console.log('[modal] Cannot show modal', err, config);
  }
}
/**** ><> ↑ --------- Specific modal display functions -> A set of functions to display specific types of modals, leveraging the 'showModal' function */

export function hideAllModals() {
  for (const key of Object.keys(modals)) {
    const modal = modals[key];
    modal.hide?.();
  }
}
/**** ><> ↑ --------- hideAllModals function -> This function hides all currently displayed modals */

function getModalComponentHandle(name: string) {
  const modalComponentRef = modals[name];
  invariant(modalComponentRef, `Modal ${name} not found`);

  return modalComponentRef;
}
/**** ><> ↑ --------- getModalComponentHandle function -> This function retrieves a modal component handle from the 'modals' record */
