import classnames from 'classnames';
import React, { FC, memo, ReactNode } from 'react';
/**** ><> ↑ --------- Imports ->  */

interface Props {
  className?: string;
  children: ReactNode;
}
/**** ><> ↑ --------- Props interface declaration ->  */

export const ModalFooter: FC<Props> = memo(({ children, className }) => (
  <div className={classnames('modal__footer theme--dialog__footer', className)}>
    {children}
  </div>
));
/**** ><> ↑ --------- ModalFooter functional component declaration ->  */

ModalFooter.displayName = 'ModalFooter';
/**** ><> ↑ --------- ModalFooter displayName assignment ->  */
