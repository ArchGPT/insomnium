import { GraphQLList, GraphQLNonNull, GraphQLType } from 'graphql';
import React, { FC, Fragment, useCallback } from 'react';
/**** ><> ↑ --------- Import statements */

interface Props {
  onNavigate: (type: GraphQLType) => void;
  type: GraphQLType;
}
/**** ><> ↑ --------- Props Interface */

export const GraphQLExplorerTypeLink: FC<Props> = ({ type, onNavigate }) => {
  const _handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(type);
  }, [onNavigate, type]);
/**** ><> ↑ --------- Component declaration and callback definition */

  if (type instanceof GraphQLList) {
    return (
      <Fragment>
        [<GraphQLExplorerTypeLink onNavigate={onNavigate} type={type.ofType} />]
      </Fragment>
    );
  }
/**** ><> ↑ --------- Condition and return for GraphQLList */

  if (type instanceof GraphQLNonNull) {
    return (
      <Fragment>
        <GraphQLExplorerTypeLink onNavigate={onNavigate} type={type.ofType} />!
      </Fragment>
    );
  }
/**** ><> ↑ --------- Condition and return for GraphQLNonNull */

  return (
    <a href="#" onClick={_handleClick} className="notice">
      {type.name}
    </a>
  );
};
/**** ><> ↑ --------- Default return */
