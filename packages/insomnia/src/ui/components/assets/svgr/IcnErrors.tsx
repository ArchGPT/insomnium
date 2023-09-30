import React, { SVGProps, memo } from 'react';
/**** ><> ↑ --------- Import required modules and components from libraries ->  */
export const SvgIcnErrors = memo<SVGProps<SVGSVGElement>>(props => (
/**** ><> ↑ --------- Define and export the SvgIcnErrors component ->  */
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
/**** ><> ↑ --------- Define properties of the svg element ->  */
  >
    <circle opacity={0.9} cx={6} cy={6} r={6} />
/**** ><> ↑ --------- Create circle element within svg ->  */
    <path
      d="M8.099 3 9 3.901 6.901 6 9 8.099 8.099 9 6 6.901 3.901 9 3 8.099 5.098 6 3 3.901 3.901 3 6 5.098 8.099 3Z"
      fill="currentColor"
    />
/**** ><> ↑ --------- Create path element within svg ->  */
  </svg>
/**** ><> ↑ --------- Close svg element ->  */
));
/**** ><> ↑ --------- Close SvgIcnErrors function ->  */
