import classnames from 'classnames';
import React, { forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react';

import { Modal, ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
import { PromptButton } from '../base/prompt-button';
/**** ><> ↑ --------- Importing necessary packages and components -> These lines import the necessary packages and components that are used throughout this document. This includes both external packages (like 'classnames' and 'React') and internal components (like 'Modal', 'ModalBody', etc.). */
interface State {
  title: string;
  hints?: string[];
  defaultValue?: string | null;
  submitName?: string | null;
  selectText?: boolean | null;
  upperCase?: boolean | null;
  validate?: ((arg0: string) => string) | null;
  hint?: string | null;
  label?: string | null;
  placeholder?: string | null;
  inputType?: string | null;
  onComplete?: (arg0: string) => Promise<void> | void;
  onHide?: () => void;
  onDeleteHint?: ((arg0?: string) => void) | null;
  loading: boolean;
}
export interface PromptModalOptions {
  title: string;
  defaultValue?: string;
  submitName?: string;
  selectText?: boolean;
  upperCase?: boolean;
  hint?: string;
  inputType?: string;
  placeholder?: string;
  validate?: (arg0: string) => string;
  label?: string;
  hints?: string[];
  onComplete?: (arg0: string) => Promise<void> | void;
  onHide?: () => void;
  onDeleteHint?: (arg0?: string) => void;
}
export interface PromptModalHandle {
  show: (options: PromptModalOptions) => void;
  hide: () => void;
}
/**** ><> ↑ --------- Defining types and interfaces -> Here, the code defines several TypeScript types and interfaces that are used to manage the component's state and props. This helps ensure type safety and clear communication of what the component expects and can handle. */
export const PromptModal = forwardRef<PromptModalHandle, ModalProps>((_, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<State>({
    title: 'Not Set',
    hints: [],
    defaultValue: '',
    submitName: '',
    selectText: false,
    upperCase: false,
    validate: null,
    hint: '',
    label: '',
    placeholder: '',
    inputType: '',
    onComplete: undefined,
    onDeleteHint: undefined,
    onHide: undefined,
    loading: false,
  });

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement | HTMLButtonElement>) => {
    event.preventDefault();
    if (inputRef.current) {
      const result = inputRef.current.type === 'checkbox' ? inputRef.current.checked.toString() : inputRef.current.value;
      if (result || inputRef.current?.type === 'text') {
        state.onComplete?.(state.upperCase ? result?.toUpperCase() : result);
      }
      modalRef.current?.hide();
    }
  };
  useImperativeHandle(ref, () => ({
    hide: () => {
      modalRef.current?.hide();
    },
    show: options => {
      setState({
        ...options,
        loading: false,
      });
      modalRef.current?.show();
    },
  }), []);

  const {
    submitName,
    title,
    hint,
    inputType,
    placeholder,
    label,
    upperCase,
    hints,
  } = state;
  const input = (
    <input
      ref={inputRef}
      onChange={event => {
        if (state.validate) {
          const errorMessage = state.validate(event.target.value);
          event.target.setCustomValidity(errorMessage);
        }
      }}
      autoFocus
      defaultValue={state.defaultValue || ''}
      id="prompt-input"
      type={inputType === 'decimal' ? 'number' : inputType || 'text'}
      step={inputType === 'decimal' ? '0.1' : undefined}
      min={inputType === 'decimal' ? '0.5' : undefined}
      style={{
        textTransform: upperCase ? 'uppercase' : 'none',
      }}
      placeholder={placeholder || ''}
    />
  );
  let sanitizedHints: ReactNode[] = [];

  if (Array.isArray(hints)) {
    sanitizedHints = hints.slice(0, 15).map(hint =>
      (<div key={hint} className="btn btn--outlined btn--super-duper-compact margin-right-sm margin-top-sm inline-block">
        <button
          className="tall"
          onClick={() => {
            if (hint) {
              state.onComplete?.(state.upperCase ? hint?.toUpperCase() : hint);
            }
            modalRef.current?.hide();
          }}
        >
          {hint}
        </button>
        <PromptButton
          confirmMessage=""
          className="tall space-left icon"
          onClick={() => {
            state.onDeleteHint?.(hint);
            const hints = state.hints?.filter(h => h !== hint);
            setState(state => ({
              ...state,
              hints,
            }));
          }}
        >
          <i className="fa fa-close faint" />
        </PromptButton>
      </div>));
  }

  let field = input;

  if (label) {
    const labelClasses = classnames({
      'inline-block': inputType === 'checkbox',
    });
    field = (
      <label htmlFor="prompt-input" className={labelClasses}>
        {label} {input}
      </label>
    );
  }

  const divClassnames = classnames('form-control form-control--wide', {
    'form-control--outlined': inputType !== 'checkbox',
  });
  return (
    <Modal
      ref={modalRef}
      onHide={state.onHide}
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody className="wide">
        <form onSubmit={handleSubmit} className="wide pad">
          <div className={divClassnames}>{field}</div>
          {sanitizedHints}
        </form>
      </ModalBody>
      <ModalFooter>
        <div className="margin-left faint italic txt-sm">{hint ? `* ${hint}` : ''}</div>
        <button className="btn" onClick={handleSubmit}>
          {submitName || 'Submit'}
        </button>
      </ModalFooter>
    </Modal>
  );
/**** ><> ↑ --------- The PromptModal functional component definition -> This is the core of the file: the definition of the PromptModal. It is using the React Hook useImperativeHandle to customize the instance value that is exposed to parent components when using ref. This component handles user input, form submission, and rendering of the modal. */
});

PromptModal.displayName = 'PromptModal';
/**** ><> ↑ --------- Setting displayName of the component -> This line sets the displayName of the component that is used in debugging messages. It's generally good practice to set this particularly for higher-order components. */
