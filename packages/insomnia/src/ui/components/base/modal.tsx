import classnames from 'classnames';
import React, { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { createKeybindingsHandler } from '../keydown-binder';
/**** ><> ↑ --------- Import statements ->  */
// Keep global z-index reference so that every modal will
// appear over top of an existing one.
let globalZIndex = 1000;
/**** ><> ↑ --------- Global variable initialization ->  */

export interface ModalProps {
  centered?: boolean;
  tall?: boolean;
  wide?: boolean;
  skinny?: boolean;
  onShow?: Function;
  onHide?: Function;
  children?: ReactNode;
  className?: string;
}
/**** ><> ↑ --------- ModalProps interface declaration ->  */

export interface ModalHandle {
  show: (options?: { onHide?: () => void }) => void;
  hide: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}
/**** ><> ↑ --------- ModalHandle interface declaration ->  */
export const Modal = forwardRef<ModalHandle, ModalProps>(({
  centered,
  children,
  className,
  onHide: onHideProp,
  onShow,
  skinny,
  tall,
  wide,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [zIndex, setZIndex] = useState(globalZIndex);
  const [onHideArgument, setOnHideArgument] = useState<() => void>();

/**** ><> ↑ --------- Modal Component declaration and internal state, callbacks initialization ->  */
  const show: ModalHandle['show'] = useCallback(options => {
    options?.onHide && setOnHideArgument(options.onHide);
    setOpen(true);
    setZIndex(globalZIndex++);
    onShow?.();
  }, [onShow]);
/**** ><> ↑ --------- show function definition ->  */

  const hide = useCallback(() => {
    setOpen(false);
    if (typeof onHideProp === 'function') {
      onHideProp();
    }
    if (typeof onHideArgument === 'function') {
      onHideArgument();
    }
  }, [onHideProp, onHideArgument]);
/**** ><> ↑ --------- hide function definition ->  */

  useImperativeHandle(ref, () => ({
    show,
    hide,
    toggle: () => open ? hide() : show(),
    isOpen: () => open,
  }), [show, open, hide]);
/**** ><> ↑ --------- useImperativeHandle hook ->  */

  const classes = classnames(
    'modal',
    'theme--dialog',
    className,
    { 'modal--fixed-height': tall },
    { 'modal--wide': wide },
    { 'modal--skinny': skinny },
  );
/**** ><> ↑ --------- classes definition ->  */

  useEffect(() => {
    const closeElements = containerRef.current?.querySelectorAll('[data-close-modal]');

    for (const element of closeElements || []) {
      element.addEventListener('click', hide);
    }
  }, [hide, open]);
/**** ><> ↑ --------- useEffect hook for event listeners on elements with [data-close-modal] attribute ->  */

  const handleKeydown = createKeybindingsHandler({
    'Escape': () => {
      hide();
    },
  });
/**** ><> ↑ --------- handleKeydown function definition ->  */
  useEffect(() => {
    document.body.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);
/**** ><> ↑ --------- useEffect hook for adding and removing keyboard event listener ->  */

  return (open ?
    <div
      ref={containerRef}
      onKeyDown={handleKeydown}
      tabIndex={-1}
      className={classes}
      style={{ zIndex }}
      aria-hidden={false}
      role="dialog"
    >
      <div className="modal__backdrop overlay theme--transparent-overlay" data-close-modal />
      <div className={classnames('modal__content__wrapper', { 'modal--centered': centered })}>
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
    : null
  );
/**** ><> ↑ --------- Modal component returned HTML ->  */
});
Modal.displayName = 'Modal';
/**** ><> ↑ --------- Setting displayName for Modal Component ->  */
