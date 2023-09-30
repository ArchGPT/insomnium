import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
/**** ><> ↑ --------- Import Statements ->  */

export interface SidebarTextItemProps {
  label: string;
  headline: string;
}
/**** ><> ↑ --------- SidebarTextItemProps Interface Definition ->  */

const StyledTextItem = styled.span`
  display: block;
  padding-left: var(--padding-sm);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
/**** ><> ↑ --------- StyledTextItem Styled Component Definition ->  */

export const SidebarTextItem: FunctionComponent<SidebarTextItemProps> = ({ label, headline }) => (
  <StyledTextItem>
    <strong>{label}</strong>
    <span>{headline}</span>
  </StyledTextItem>
);
/**** ><> ↑ --------- SidebarTextItem Functional Component Definition ->  */
