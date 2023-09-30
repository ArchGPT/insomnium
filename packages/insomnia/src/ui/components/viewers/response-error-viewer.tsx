import React, { FC, memo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { docsBase } from '../../../common/documentation';
import { RootLoaderData } from '../../routes/root';
import { Link } from '../base/link';
import { showModal } from '../modals/index';
import { SettingsModal } from '../modals/settings-modal';
/**** ><> ↑ --------- Importing dependencies ->  */
interface Props {
  error: string;
  url: string;
}
/**** ><> ↑ --------- Interface definition ->  */
export const ResponseErrorViewer: FC<Props> = memo(({ error }) => {
  let msg: React.ReactNode = null;
  const {
    settings,
  } = useRouteLoaderData('root') as RootLoaderData;
  const { editorFontSize } = settings;

  if (error?.toLowerCase().indexOf('certificate') !== -1) {
    msg = (
      <button className="btn btn--clicky" onClick={() => showModal(SettingsModal)}>
        Disable SSL Validation
      </button>
    );
  } else if (error?.toLowerCase().indexOf('getaddrinfo') !== -1) {
    msg = (
      <button className="btn btn--clicky" onClick={() => showModal(SettingsModal)}>
        Setup Network Proxy
      </button>
    );
  } else {
    msg = (
      <Link button className="btn btn--clicky" href={docsBase}>
        Documentation
      </Link>
    );
  }

  return (
/**** ><> ↑ --------- ResponseErrorViewer functional component definition and main logic ->  */
    <div>
      <pre
        className="selectable pad force-pre-wrap"
        style={{
          fontSize: `${editorFontSize}px`,
        }}
      >
        {error}
      </pre>
      <hr />
      <div className="text-center pad">
        <p className="faint pad-left pad-right">Here are some additional things that may help.</p>
        {msg}
          &nbsp;&nbsp;
        <Link
          button
          className="btn btn--clicky margin-top-sm"
          href="https://insomnia.rest/support"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
/**** ><> ↑ --------- Return JSX ->  */
});

ResponseErrorViewer.displayName = 'ResponseError';
/**** ><> ↑ --------- Setting displayName ->  */
