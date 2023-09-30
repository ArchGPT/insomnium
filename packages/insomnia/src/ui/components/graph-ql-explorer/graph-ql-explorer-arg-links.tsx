import { GraphQLArgument, GraphQLType } from 'graphql';
import React, { FC } from 'react';

/**** ><> ↑ --------- Imports */
import { GraphQLExplorerTypeLink } from './graph-ql-explorer-type-link';

/**** ><> ↑ --------- Component */
interface Props {
  args?: readonly GraphQLArgument[];
  onNavigate: (type: GraphQLType) => void;
}
/**** ><> ↑ --------- Props Interface */

export const GraphQLExplorerArgLinks: FC<Props> = ({
  args,
  onNavigate,
}) => <>
  {args ? args.map(a => (
    <div key={a.name} className="graphql-explorer__defs__arg">
      <span className="info">{a.name}</span>:{' '}
      <GraphQLExplorerTypeLink onNavigate={onNavigate} type={a.type} />
    </div>
  )) : null}
</>;
/**** ><> ↑ --------- Component Definition */
