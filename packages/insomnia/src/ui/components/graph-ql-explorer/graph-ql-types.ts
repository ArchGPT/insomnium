import { SchemaReference } from 'codemirror-graphql/utils/SchemaReference';
import { GraphQLField } from 'graphql';
/**** ><> ↑ --------- Import statements */

type GraphQLFieldAny = GraphQLField<any, any>;
/**** ><> ↑ --------- Type definition */

// It is possible for args to be undefined, but the exported type has it as required, so we override it here
/**** ><> ↑ --------- Comment explaining the following type override */
export type GraphQLFieldWithOptionalArgs =
  & Omit<GraphQLFieldAny, 'args'>
  & Partial<Pick<GraphQLFieldAny, 'args'>>;
/**** ><> ↑ --------- Type override for optional arguments */

export interface GraphQLFieldWithParentName extends GraphQLFieldWithOptionalArgs {
  parentName?: string;
}
/**** ><> ↑ --------- Interface with optional parent name */

export type ActiveReference = SchemaReference;
/**** ><> ↑ --------- Type alias */
