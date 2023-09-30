import classnames from 'classnames';
import React, { FC, HTMLAttributes, memo, ReactNode } from 'react';
/**** ><> ↑ --------- Import statements ->  */

interface Props extends HTMLAttributes<HTMLDivElement> {
  noScroll?: boolean;
  className?: string;
  children?: ReactNode;
}
/**** ><> ↑ --------- Interface definition ->  */

export const ModalBody: FC<Props> = memo(({ className, children, noScroll, ...props }) => {
  const classes = classnames(className, 'modal__body theme--dialog__body', {
    'modal__body--no-scroll': noScroll,
  });
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
});
/**** ><> ↑ --------- Functional component definition ->  */

ModalBody.displayName = 'ModalBody';
/**** ><> ↑ --------- Setting component name ->  */
