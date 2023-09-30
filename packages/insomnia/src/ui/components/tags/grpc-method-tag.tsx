import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import type { GrpcMethodType } from '../../../main/ipc/grpc';
import { GrpcMethodTypeName } from '../panes/grpc-request-pane';
import { Tooltip } from '../tooltip';

/**** ><> ↑ --------- Imports ->  */
interface Props {
  methodType: GrpcMethodType;
}
/**** ><> ↑ --------- Props interface ->  */

const StyledTag = styled.div`
  width: 1.5em;
  text-align: right;
`;
/**** ><> ↑ --------- StyledTag component ->  */
const GrpcMethodTypeAcronym = {
  unary: 'U',
  server: 'SS',
  client: 'CS',
  bidi: 'BD',
} as const;
/**** ><> ↑ --------- GrpcMethodTypeAcronym object ->  */

export const GrpcMethodTag: FunctionComponent<Props> = ({ methodType }) => (
  <Tooltip message={GrpcMethodTypeName[methodType]} position="left" delay={500}>
    <StyledTag>
      <em>{GrpcMethodTypeAcronym[methodType]}</em>
    </StyledTag>
  </Tooltip>
);
/**** ><> ↑ --------- GrpcMethodTag component ->  */
