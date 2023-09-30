import { astFromValue, print } from 'graphql';
import React, { FC, memo } from 'react';
/**** ><> ↑ --------- Importing dependencies */

import { GraphQLFieldWithParentName } from './graph-ql-types';
/**** ><> ↑ --------- Importing local dependencies */

interface Props {
  field: GraphQLFieldWithParentName;
}
/**** ><> ↑ --------- Defining interface for Props */

export const GraphQLDefaultValue: FC<Props> = memo(({ field }) => {
  const fieldO: Record<string, any> = field;

  if ('defaultValue' in fieldO && fieldO.defaultValue !== undefined) {
    const ast = astFromValue(fieldO.defaultValue, fieldO.type);
    const strDefault = ast ? print(ast) : '';
    return <span className="success">{` = ${strDefault}`}</span>;
  } else {
    return null;
  }
});
/**** ><> ↑ --------- Defining GraphQLDefaultValue */

GraphQLDefaultValue.displayName = 'GraphQLDefaultValue';
/**** ><> ↑ --------- Setting display name for GraphQLDefaultValue */
