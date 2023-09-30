import classnames from 'classnames';
import React, { FC, memo, ReactNode } from 'react';
/**** ><> ↑ --------- Imports dependencies ->  */

interface Props {
  children: ReactNode;
  hideCloseButton?: boolean;
  className?: string;
}
/**** ><> ↑ --------- Defines Props interface ->  */

export const ModalHeader: FC<Props> = memo(({ hideCloseButton, className, children }) => {
  let closeButton: null | JSX.Element = null;

  if (!hideCloseButton) {
    closeButton = (
      <button type="button" className="btn btn--compact modal__close-btn" data-close-modal="true">
        <i className="fa fa-times" />
      </button>
    );
  }

  return (
    <div className={classnames('modal__header theme--dialog__header', className)}>
      <div className="modal__header__children">{children}</div>
      {closeButton}
    </div>
  );
});
/**** ><> ↑ --------- Declares the ModalHeader functional component ->  */

ModalHeader.displayName = 'ModalHeader';
/**** ><> ↑ --------- Sets the displayName of the ModalHeader component ->  */
