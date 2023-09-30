import React, { FunctionComponent } from 'react';

import { Editable } from './base/editable';
/**** ><> ↑ --------- Importing dependencies */

interface Props {
  onSubmit: (value?: string) => void;
  value: string;
}
/**** ><> ↑ --------- Declaring props interface */

export const UnitTestEditable: FunctionComponent<Props> = ({ onSubmit, value }) => {
  return <Editable singleClick onSubmit={onSubmit} value={value} />;
};
/**** ><> ↑ --------- Exporting the UnitTestEditable functional component */
