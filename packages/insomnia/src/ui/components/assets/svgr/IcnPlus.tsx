import React, { SVGProps, memo } from 'react';
/**** ><> ↑ --------- Importing modules ->  */
export const SvgIcnPlus = memo<SVGProps<SVGSVGElement>>(props => (
/**** ><> ↑ --------- Exporting SvgIcnPlus component ->  */
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
/**** ><> ↑ --------- Setting up svg properties ->  */
  >
    <path d="M7.5 1a.25.25 0 0 1 .25.25v5h5a.25.25 0 0 1 .25.25v1a.25.25 0 0 1-.25.25h-5v5a.25.25 0 0 1-.25.25h-1a.25.25 0 0 1-.25-.25v-5h-5A.25.25 0 0 1 1 7.5v-1a.25.25 0 0 1 .25-.25h5v-5A.25.25 0 0 1 6.5 1h1Z" />
/**** ><> ↑ --------- Adding a path to the svg ->  */
  </svg>
));
/**** ><> ↑ --------- Closing svg and component ->  */
