import React, { FC, ReactNode } from 'react';

import { Tooltip } from './tooltip';

/**** ><> ↑ --------- Imports and dependencies ->  */
interface Props {
  children: ReactNode;
  position?: string;
  className?: string;
  info?: boolean;
}
/**** ><> ↑ --------- Props interface ->  */

export const HelpTooltip: FC<Props> = props => {
  const { children, className, info } = props;
  return (
    <Tooltip position="top" className={className} message={children}>
      <i className={'fa ' + (info ? 'fa-info-circle' : 'fa-question-circle')} />
    </Tooltip>
  );
};
/**** ><> ↑ --------- HelpTooltip Component ->  */
