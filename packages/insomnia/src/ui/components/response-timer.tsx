import React, { DOMAttributes, FunctionComponent, useEffect, useState } from 'react';

import { REQUEST_SETUP_TEARDOWN_COMPENSATION, REQUEST_TIME_TO_SHOW_COUNTER } from '../../common/constants';
/**** ><> ↑ --------- Import statements ->  */

interface Props {
  handleCancel: DOMAttributes<HTMLButtonElement>['onClick'];
}
/**** ><> ↑ --------- Props interface declaration ->  */

export const ResponseTimer: FunctionComponent<Props> = ({ handleCancel }) => {
  const [milliseconds, setMilliseconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const loadStartTime = Date.now();

    interval = setInterval(() => {
      setMilliseconds(Date.now() - loadStartTime - REQUEST_SETUP_TEARDOWN_COMPENSATION);
    }, 100);
    return () => {
      if (interval !== null) {
        setMilliseconds(0);
        clearInterval(interval);
      }
    };
  }, []);
/**** ><> ↑ --------- useEffect hook to start timer ->  */

  const seconds = milliseconds / 1000;
/**** ><> ↑ --------- Declaration of seconds constant ->  */
  return (
    <div className="overlay theme--transparent-overlay">
      <h2 style={{ fontVariantNumeric: 'tabular-nums' }}>
        {seconds >= REQUEST_TIME_TO_SHOW_COUNTER ? `${seconds.toFixed(1)} seconds` : 'Loading'}...
      </h2>
      <div className="pad">
        <i className="fa fa-refresh fa-spin" />
      </div>
      <div className="pad">
        <button
          className="btn btn--clicky"
          onClick={handleCancel}
        >
          Cancel Request
        </button>
      </div>
    </div>
  );
/**** ><> ↑ --------- ResponseTimer FunctionComponent declaration ->  */
/**** ><> ↑ --------- JSX return statement ->  */
};
