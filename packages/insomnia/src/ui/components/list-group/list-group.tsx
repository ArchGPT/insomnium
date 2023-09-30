import { ReactNode } from 'react';
import styled from 'styled-components';
/**** ><> ↑ --------- Imports necessary libraries ->  */

export interface ListGroupProps {
  children?: ReactNode;
  bordered?: boolean;
}
/**** ><> ↑ --------- Declaration of ListGroupProps interface ->  */

export const ListGroup = styled.ul<ListGroupProps>`
  list-style-type: none;
  margin: 0;
  padding: 0;

/**** ><> ↑ --------- Definition of ListGroup component ->  */
  ${({ bordered }) =>
    bordered &&
    `border: 1px solid var(--hl-sm);
     border-radius: var(--radius-sm);
     li:last-of-type {border-bottom:none;};
    `}
`;
/**** ><> ↑ --------- Conditional styling based on props ->  */
