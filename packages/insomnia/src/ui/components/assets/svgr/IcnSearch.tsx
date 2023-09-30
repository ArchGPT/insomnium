import React, { SVGProps, memo } from 'react';
/**** ><> ↑ --------- Import statements ->  */
export const SvgIcnSearch = memo<SVGProps<SVGSVGElement>>(props => (
/**** ><> ↑ --------- Exporting and defining SVG component ->  */
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
/**** ><> ↑ --------- Defining the SVG element attributes ->  */
  >
    <path fill="none" d="M0 0h14v14H0z" />
/**** ><> ↑ --------- Drawing a hidden path for overall SVG frame ->  */
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 6a5 5 0 1 0-2.035 4.027l3.151 3.15a.5.5 0 0 0 .707 0l.354-.354a.5.5 0 0 0 0-.707l-3.152-3.151.15-.212C10.695 7.963 11 7.017 11 6ZM2.5 6a3.5 3.5 0 1 1 6.024 2.424l-.054.046a.334.334 0 0 0-.048.056A3.5 3.5 0 0 1 2.5 6Z"
      fill=""
    />
/**** ><> ↑ --------- Defining the visible shape in the SVG ->  */
  </svg>
));
/**** ><> ↑ --------- Closing SVG and component definition ->  */
