import React, { SVGProps, memo } from 'react';
/**** ><> ↑ --------- Importing necessary modules from 'react' package ->  */
export const SvgIcnProhibited = memo<SVGProps<SVGSVGElement>>(props => (
/**** ><> ↑ --------- Declaration of the SvgIcnProhibited component ->  */
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
/**** ><> ↑ --------- Setting SVG attributes ->  */
  >
    <path fill="none" d="M0 0h14v14H0z" />
/**** ><> ↑ --------- Inclusion of first SVG path ->  */
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 0a7 7 0 1 1 0 14A7 7 0 0 1 7 0ZM1.5 7a5.5 5.5 0 0 0 8.823 4.383L2.617 3.677A5.476 5.476 0 0 0 1.5 7Zm2.177-4.383a5.5 5.5 0 0 1 7.706 7.706L3.677 2.617Z"
      fill=""
    />
/**** ><> ↑ --------- Inclusion of second SVG path with attributes ->  */
  </svg>
/**** ><> ↑ --------- Closing SVG element ->  */
));
/**** ><> ↑ --------- Closing statement for the SvgIcnProhibited component ->  */
