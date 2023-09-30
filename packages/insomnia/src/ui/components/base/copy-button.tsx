import React, { FC, useCallback, useState } from 'react';
import { useInterval } from 'react-use';

import { Button, ButtonProps } from '../themed-button';
/**** ><> ↑ --------- Import statements ->  */

interface Props extends ButtonProps {
  confirmMessage?: string;
  content: string;
  title?: string;
}
/**** ><> ↑ --------- Props interface ->  */

export const CopyButton: FC<Props> = ({
  children,
  confirmMessage,
  content,
  title,
  ...buttonProps
}) => {
/**** ><> ↑ --------- Main CopyButton component ->  */
  const [showConfirmation, setshowConfirmation] = useState(false);
  const onClick = useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (content) {
      window.clipboard.writeText(content);
    }
    setshowConfirmation(true);
  }, [content]);
/**** ><> ↑ --------- State and onClick function ->  */

  useInterval(() => {
    setshowConfirmation(false);
  }, 2000);
/**** ><> ↑ --------- useInterval Hook ->  */

  const confirm = typeof confirmMessage === 'string' ? confirmMessage : 'Copied';
  return (
    <Button
      {...buttonProps}
      title={title}
      onClick={onClick}
    >
      {showConfirmation ? (
        <span>
          {confirm} <i className="fa fa-check-circle-o" />
        </span>
      ) : (
        children || 'Copy to Clipboard'
      )}
    </Button>
  );
};
/**** ><> ↑ --------- Confirm message handling and component return statement ->  */
