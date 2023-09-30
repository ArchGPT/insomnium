import classnames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';
/**** ><> ↑ --------- Import modules ->  */

interface PaneProps {
  className?: string;
  type: 'request' | 'response';
}
/**** ><> ↑ --------- PaneProps interface ->  */

interface PaneHeaderProps {
  className?: string;
}
/**** ><> ↑ --------- PaneHeaderProps interface ->  */

interface PaneBodyProps {
  className?: string;
  placeholder?: boolean;
}
/**** ><> ↑ --------- PaneBodyProps interface ->  */

export const Pane: FC<PropsWithChildren<PaneProps>> = ({ className, type, children }) => (
  <section className={classnames(`${type}-pane`, 'theme--pane', 'pane', className)} data-testid={`${type}-pane`}>
    {children}
  </section>
);
/**** ><> ↑ --------- Pane functional component ->  */

export const PaneHeader: FC<PropsWithChildren<PaneHeaderProps>> = ({ className, children }) => (
  <header className={classnames('pane__header', 'theme--pane__header', className)}>
    {children}
  </header>
);
/**** ><> ↑ --------- PaneHeader functional component ->  */

export const paneBodyClasses = 'pane__body theme--pane__body';
export const PaneBody: FC<PropsWithChildren<PaneBodyProps>> = ({ placeholder, children }) => (
  <div className={classnames(paneBodyClasses, placeholder && 'pane__body--placeholder')}>
    {children}
  </div>
);
/**** ><> ↑ --------- paneBodyClasses constant and PaneBody functional component ->  */
