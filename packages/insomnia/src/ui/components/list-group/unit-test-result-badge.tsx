import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
/**** ><> ↑ --------- React and styled-components imports ->  */

export interface UnitTestResultBadgeProps {
  failed?: boolean;
}
/**** ><> ↑ --------- Type definitions for function props ->  */

const StyledBadge = styled.span`
  padding: var(--padding-xs) var(--padding-sm);
  border: 1px solid var(--color-success);
  background-color: var(--color-bg);
  color: var(--color-success);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-sm);
  flex-basis: 3.5em;
  flex-shrink: 0;
  text-align: center;
  text-transform: capitalize;
`;
/**** ><> ↑ --------- StyledBadge styled component definition ->  */

const StyledFailedBadge = styled(StyledBadge)`
  && {
    border-color: var(--color-danger);
    color: var(--color-danger);
  }
`;
/**** ><> ↑ --------- StyledFailedBadge styled component definition ->  */

const StyledPassedBadge = styled(StyledBadge)`
  && {
    border-color: var(--color-success);
    color: var(--color-success);
  }
`;
/**** ><> ↑ --------- StyledPassedBadge styled component definition ->  */

export const UnitTestResultBadge: FunctionComponent<UnitTestResultBadgeProps> = ({ failed }) => failed ? (
  <StyledFailedBadge>Failed</StyledFailedBadge>
) : (
  <StyledPassedBadge>Passed</StyledPassedBadge>
);
/**** ><> ↑ --------- UnitTestResultBadge FunctionComponent definition ->  */
