import React, { FC } from 'react';
import styled, { css } from 'styled-components';
/**** ><> ↑ --------- Import statements ->  */

export interface ListGroupItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  isSelected?: boolean;
  selectable?: boolean;
  indentLevel?: number;
}
/**** ><> ↑ --------- Interface declaration for ListGroupItemProps ->  */

const StyledListGroupItem = styled.li<ListGroupItemProps>`
  border-bottom: 1px solid var(--hl-xs);
  padding: var(--padding-sm) var(--padding-sm);

  ${({ selectable }) =>
    selectable &&
    css`
      &:hover {
        background-color: var(--hl-sm) !important;
      }
    `}

  ${({ isSelected }) =>
    isSelected &&
    css`
      background-color: var(--hl-xs) !important;
      font-weight: bold;
    `}

  ${({ indentLevel }) =>
    indentLevel &&
    css`
      padding-left: calc(var(--padding-sm) + var(--padding-md) * ${indentLevel});
    `};
`;
/**** ><> ↑ --------- Styled component declaration - StyledListGroupItem ->  */

export const ListGroupItem: FC<ListGroupItemProps> = props => <StyledListGroupItem {...props} />;
/**** ><> ↑ --------- Export of ListGroupItem ->  */
