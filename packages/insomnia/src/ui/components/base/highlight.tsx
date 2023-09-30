import fuzzySort from 'fuzzysort';
import React, { FC } from 'react';

import { fuzzyMatch } from '../../../common/misc';
/**** ><> ↑ --------- Importing necessary modules and libraries ->  */

export interface HighlightProps {
  search: string;
  text: string;
  blankValue?: String;
}
/**** ><> ↑ --------- Declaring interface as props for the Highlight component ->  */

export const Highlight: FC<HighlightProps> = ({
  search,
  text,
  blankValue,
  ...otherProps
}) => {
/**** ><> ↑ --------- Declaring the Highlight component ->  */
  // Match loose here to make sure our highlighting always works
  const result = fuzzyMatch(search, text, {
    splitSpace: true,
    loose: true,
  });
/**** ><> ↑ --------- Perform fuzzy matching to highlight search text ->  */

  if (!result) {
    return <span {...otherProps}>{text || blankValue || ''}</span>;
  }
/**** ><> ↑ --------- No match found condition: return a span with normal text ->  */

  return (
    <span
      {...otherProps}
      dangerouslySetInnerHTML={{
      // @ts-expect-error -- TSCONVERSION
        __html: fuzzySort.highlight(
        // @ts-expect-error -- TSCONVERSION
          result,
          '<strong style="font-style: italic; text-decoration: underline;">',
          '</strong>'
        ),
      }}
    />
  );
};
/**** ><> ↑ --------- Match found condition: return a span with highlighted text ->  */
