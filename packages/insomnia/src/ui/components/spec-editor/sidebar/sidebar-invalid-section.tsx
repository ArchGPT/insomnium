import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
/**** ><> ↑ --------- Import statements ->  */

export interface SidebarInvalidSectionProps {
  name: string;
}
/**** ><> ↑ --------- Interface definition ->  */

const StyledInvalidSection = styled.div`
  padding: var(--padding-xs) var(--padding-xs) var(--padding-md) var(--padding-md);
  color: var(--color-warning);
`;
/**** ><> ↑ --------- Styled component definition ->  */

export const SidebarInvalidSection: FunctionComponent<SidebarInvalidSectionProps> = ({ name }) => (
  <StyledInvalidSection>Error: Invalid {name} specification.</StyledInvalidSection>
);
/**** ><> ↑ --------- Component function definition ->  */
