import React, { FC, Fragment } from 'react';

import { CodeEditor } from '../../codemirror/code-editor';

/**** ><> ↑ --------- Importing libraries/modules */
interface Props {
  onChange: (value: string) => void;
  content: string;
  contentType: string;
  uniquenessKey: string;
  className?: string;
}
/**** ><> ↑ --------- Interface for the component properties */

export const RawEditor: FC<Props> = ({
  className,
  content,
  contentType,
  onChange,
  uniquenessKey,
}) => (
  <Fragment>
    <CodeEditor
      id="raw-editor"
      showPrettifyButton
      uniquenessKey={uniquenessKey}
      defaultValue={content}
      className={className}
      enableNunjucks
      onChange={onChange}
      mode={contentType}
      placeholder="..."
    />
  </Fragment>
);
/**** ><> ↑ --------- RawEditor Component */
