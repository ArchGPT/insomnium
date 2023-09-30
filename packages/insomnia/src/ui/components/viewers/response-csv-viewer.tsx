import Papa from 'papaparse';
import React, { FC, useEffect, useState } from 'react';
/**** ><> ↑ --------- Imports ->  */

interface Props {
  body: Buffer;
}
/**** ><> ↑ --------- Props interface ->  */

export const ResponseCSVViewer: FC<Props> = ({ body }) => {
  const [csv, setCSV] = useState<{ data: string[][] } | null>(null);
/**** ><> ↑ --------- Component declaration and state initialization ->  */

  useEffect(() => {
    Papa.parse<string[]>(body.toString('utf8'), {
      skipEmptyLines: true,
      complete: result => {
        setCSV(result);
      },
    });
  }, [body]);
/**** ><> ↑ --------- useEffect hook for parsing csv data ->  */

  return (
    <div className="pad-sm">
      {csv ?
        <table className="table--fancy table--striped table--compact selectable">
          <tbody>
            {csv.data.map((row, index) => (
            // eslint-disable-next-line react/no-array-index-key -- data structure is unknown, cannot compute a valid key
              <tr key={index}>
                {row.map(c => (
                  <td key={c}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        : 'Parsing CSV...'}
    </div>);
};
/**** ><> ↑ --------- Return JSX for display ->  */
