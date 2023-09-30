import React, { SVGProps, memo } from 'react';
export const SvgIcnPlay = memo<SVGProps<SVGSVGElement>>(props => (
/**** ><> ↑ --------- Importing relevant modules and defining the SVG component ->  */
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
/**** ><> ↑ --------- Initializing the SVG component with properties ->  */
  >
    <path fill="none" d="M0 0h14v14H0z" />
/**** ><> ↑ --------- Creating a path that does not fill any space ->  */
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.514 1.909A1 1 0 0 0 2 2.766v8.468a1 1 0 0 0 1.514.857l7.057-4.233a1 1 0 0 0 0-1.715L3.515 1.909Z"
      fill=""
    />
/**** ><> ↑ --------- Defining the primary path of the SVG ->  */
  </svg>
));
/**** ><> ↑ --------- Closing the SVG component and exporting it ->  */
