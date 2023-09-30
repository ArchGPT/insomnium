import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { ListGroupItem } from './list-group-item';
import { UnitTestResultBadge } from './unit-test-result-badge';
import { UnitTestResultTimestamp } from './unit-test-result-timestamp';
/**** ><> ↑ --------- Imports ->  */

export interface UnitTestResultItemProps {
  item: {
    duration: string;
    err?: {
      message: string;
    };
    title: string;
  };
}
/**** ><> ↑ --------- Interface definition for props ->  */

const StyledResultListItem = styled(ListGroupItem)`
  && {
    > div:first-of-type {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
  
      > *:not(:first-child) {
        margin: var(--padding-xs) 0 var(--padding-xs) var(--padding-sm);
      }
    }
  
    code {
      background-color: var(--hl-xs);
      padding: var(--padding-sm) var(--padding-md) var(--padding-sm) var(--padding-md);
      color: var(--color-danger);
      display: block;
      margin: var(--padding-sm) 0 0 0;
    }
  
    p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-grow: 1;
    }
  }
`;
/**** ><> ↑ --------- Styled-component definition ->  */

export const UnitTestResultItem: FunctionComponent<UnitTestResultItemProps> = ({
  item: {
    err = {},
    title,
    duration,
  },
}) => {
  return (
    <StyledResultListItem>
      <div>
        <UnitTestResultBadge failed={Boolean(err.message)} />
        <p>{title}</p>
        <UnitTestResultTimestamp timeMs={duration} />
      </div>
      {err.message && <code>{err.message}</code>}
    </StyledResultListItem>
  );
};
/**** ><> ↑ --------- Main component definition ->  */
