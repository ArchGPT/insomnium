import React, { SVGProps, memo } from 'react';
/**** ><> ↑ --------- Import statements ->  */
export const SvgIcnTriangle = memo<SVGProps<SVGSVGElement>>(props => (
/**** ><> ↑ --------- Component declaration ->  */
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
/**** ><> ↑ --------- SVG element attributes ->  */
  >
    <path fill="none" d="M0 0h14v14H0z" />
    <path fillRule="evenodd" clipRule="evenodd" d="m12 5-5 5-5-5h10Z" fill="" />
/**** ><> ↑ --------- SVG path elements ->  */
  </svg>
));
/**** ><> ↑ --------- Closing tags and arrow function ->  */
