import React, { FC, useEffect, useRef } from 'react';
/**** ><> ↑ --------- Import statements ->  */

interface Props {
  body: string;
  url: string;
  webpreferences: string;
}
/**** ><> ↑ --------- Props interface definition ->  */
export const ResponseWebView: FC<Props> = ({ webpreferences, body, url }) => {
  const webviewRef = useRef<Electron.WebviewTag>(null);

  useEffect(() => {
    const webview = webviewRef.current;
    const handleDOMReady = () => {
      if (webview) {
        webview.removeEventListener('dom-ready', handleDOMReady);
        const bodyWithBase = body.replace('<head>', `<head><base href="${url}">`);
        webview.loadURL(`data:text/html; charset=utf-8,${encodeURIComponent(bodyWithBase)}`);
      }
    };
    if (webview) {
      webview.addEventListener('dom-ready', handleDOMReady);
    }
/**** ><> ↑ --------- Event listener attachment for dom-ready event ->  */
    return () => {
      if (webview) {
        webview.removeEventListener('dom-ready', handleDOMReady);
      }
    };
/**** ><> ↑ --------- UseEffect hook definition ->  */
/**** ><> ↑ --------- Event listener clean up in return function ->  */
  }, [body, url]);
  return (
    <webview
      data-testid="ResponseWebView"
      ref={webviewRef}
      src="about:blank"
      // eslint-disable-next-line react/no-unknown-property
      webpreferences={webpreferences}
/**** ><> ↑ --------- React component definition ->  */
    />
  );
};
/**** ><> ↑ --------- Return JSX element webview ->  */
