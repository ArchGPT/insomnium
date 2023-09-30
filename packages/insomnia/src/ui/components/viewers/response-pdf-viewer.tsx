import React from 'react';
/**** ><> ↑ --------- Import Dependencies ->  */

interface Props {
  body: Buffer;
}
/**** ><> ↑ --------- Interface Declaration ->  */

export const ResponsePDFViewer = (props: Props) => {
  const url = (`data:application/pdf;base64,${props.body.toString('base64')}`);

  return (
    <webview
      data-testid="ResponsePDFView"
      src={url}
    />
  );
};
/**** ><> ↑ --------- Component Declaration ->  */
