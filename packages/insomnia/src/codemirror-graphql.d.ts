import { GraphQLInfoOptions } from 'codemirror-graphql/info';
/**** ><> ↑ --------- Import statements ->  */

declare module 'codemirror-graphql/jump' {
  type ModifiedGraphQLJumpOptions = Omit<GraphQLJumpOptions, 'onClick'> & {
    onClick: GraphQLInfoOptions['onClick'];
  };
}
/**** ><> ↑ --------- Module declaration and type modification ->  */
