import React, { FunctionComponent } from 'react';

import { Pane, PaneBody, PaneHeader } from './pane';
/**** ><> ↑ --------- Import statements ->  */

interface Props {
  type: 'request' | 'response';
}
/**** ><> ↑ --------- Props definition ->  */

export const BlankPane: FunctionComponent<Props> = ({ type }) => (
  <Pane type={type}>
    <PaneHeader />
    <PaneBody placeholder />
  </Pane>
);
/**** ><> ↑ --------- BlankPane component definition ->  */
