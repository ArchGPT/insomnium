import React, { SVGProps, memo } from 'react';
/**** ><> ↑ --------- Import statements ->  */
export const SvgIcnArrowRight = memo<SVGProps<SVGSVGElement>>(props => (
/**** ><> ↑ --------- Component declaration ->  */
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
/**** ><> ↑ --------- SVG attributes ->  */
  >
    <circle cx={6} cy={6} r={6} />
    <path fill="currentColor" d="M3 5v2h3v2l4-3-4-3v2z" />
/**** ><> ↑ --------- SVG contents ->  */
  </svg>
));
/**** ><> ↑ --------- End of SVG and component ->  */
