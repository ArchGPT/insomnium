import React, { FC } from 'react';

import { KeyValueEditor } from '../../key-value-editor/key-value-editor';

/**** ><> ↑ --------- Import statements */
interface Props {
  onChange: (c: {
    name: string;
    value: string;
    description?: string;
    disabled?: boolean;
  }[]) => void;
  parameters: any[];
}
/**** ><> ↑ --------- Props interface definition */

export const FormEditor: FC<Props> = ({ parameters, onChange }) => (
  <div className="scrollable-container tall wide">
    <div className="scrollable">
      <KeyValueEditor
        allowFile
        allowMultiline
        namePlaceholder="name"
        valuePlaceholder="value"
        descriptionPlaceholder="description"
        onChange={onChange}
        pairs={parameters}
      />
    </div>
  </div>
);
/**** ><> ↑ --------- FormEditor functional component definition */
