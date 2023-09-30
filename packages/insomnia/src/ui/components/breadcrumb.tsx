import React, { FC, Fragment, ReactNode } from 'react';
import styled from 'styled-components';
/**** ><> ↑ --------- Import statements ->  */

export interface CrumbProps {
  id: string;
  node: ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}
/**** ><> ↑ --------- CrumbProps Interface definition ->  */

export interface BreadcrumbProps {
  crumbs: CrumbProps[];
  className?: string;
}
/**** ><> ↑ --------- BreadcrumbProps Interface definition ->  */

const StyledBreadcrumb = styled.ul`
  font-size: var(--font-size-md);
  color: var(--color-font);
  grid-area: breadcrumbs;
  display: flex;
  align-items: center;
  justify-content: center;

  a,
  a::before,
  li > ::before {
    color: var(--color-font) !important;
  }

  li {
    display: flex;
    flex-direction: row;

    a {
      font-weight: 400 !important;
      cursor: pointer;
      opacity: 0.5;
      &:hover {
        color: var(--color-font);
        opacity: 1;
        text-decoration: none;
      }
    }

    &::before {
      margin: 0 var(--padding-xs);
      font-weight: 300;
      opacity: 0.5;
      content: '/';
    }

    &:first-child::before {
      content: '';
    }
  }
`;
/**** ><> ↑ --------- StyledBreadcrumb styled component declaration ->  */

const Crumb: FC<CrumbProps> = ({ id, node, onClick }) => (
  <li key={id} data-testid={id}>
    {onClick ? <a href="#" onClick={onClick}>{node}</a> : node}
  </li>
);
/**** ><> ↑ --------- Crumb Functional Component declaration ->  */

export const Breadcrumb: FC<BreadcrumbProps> = ({ crumbs, className }) => (
  <Fragment>
    <StyledBreadcrumb className={className}>
      {crumbs.map(Crumb)}
    </StyledBreadcrumb>
  </Fragment>
);
/**** ><> ↑ --------- Breadcrumb Functional Component declaration ->  */
