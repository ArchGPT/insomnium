import React, { SVGProps, memo } from 'react';
export const SvgIcnCheckmark = memo<SVGProps<SVGSVGElement>>(props => (
/**** ><> ↑ --------- Importing necessary modules and declaring component ->  */
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
/**** ><> ↑ --------- Defining the SVG component and its properties ->  */
    <path d="m11.753 2 1.244 1.23-8.375 8.473L1 8.081l1.237-1.238L4.614 9.22 11.753 2Z" />
  </svg>
));
/**** ><> ↑ --------- Defining the path inside the SVG component ->  */
