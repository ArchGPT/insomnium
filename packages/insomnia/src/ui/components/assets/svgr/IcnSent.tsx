import React, { SVGProps, memo } from 'react';
/**** ><> ↑ --------- Importing modules ->  */
export const SvgIcnSent = memo<SVGProps<SVGSVGElement>>(props => (
/**** ><> ↑ --------- Exporting memoized `SvgIcnSent` component ->  */
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
/**** ><> ↑ --------- Setting up svg properties ->  */
  >
    <path
      d="M7.824 12V4.871l1.717 1.72 1.06-1.06L7.074 2 3.55 5.53l1.06 1.061 1.716-1.72V12h1.498Z"
      fill="#2978E5"
      opacity={0.8}
/**** ><> ↑ --------- Defining the path and its properties in the SVG ->  */
    />
  </svg>
/**** ><> ↑ --------- Ending svg element ->  */
));
/**** ><> ↑ --------- Ending the component ->  */
