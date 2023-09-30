import React from 'react';
import styled from 'styled-components';
/**** ><> ↑ --------- Importing packages ->  */

import { PlatformKeyCombinations } from '../../../../common/settings';
import { Hotkey } from '../../hotkey';
/**** ><> ↑ --------- Importing local modules ->  */

const StyledHotkey = styled(Hotkey)({
  color: 'var(--hl-xl)',
  marginLeft: 'auto',
  paddingLeft: 'var(--padding-lg)',
});
/**** ><> ↑ --------- Styled component creation ->  */

interface Props {
  keyBindings: PlatformKeyCombinations;
}
/**** ><> ↑ --------- Props Interface ->  */

export const DropdownHint = (props: Props) => {
  return <StyledHotkey keyBindings={props.keyBindings} />;
};
/**** ><> ↑ --------- React functional component ->  */
