import React, { SVGProps, memo } from 'react';
/**** ><> ↑ --------- Import statements ->  */
export const SvgIcnDragGrip = memo<SVGProps<SVGSVGElement>>(props => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
/**** ><> ↑ --------- Function definition and initial svg setup ->  */
    <path fill="none" d="M0 0h14v14H0z" />
/**** ><> ↑ --------- First path element setup ->  */
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.5 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM11 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM6 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-1.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM6 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      fill=""
    />
/**** ><> ↑ --------- Second path element and its fill property ->  */
  </svg>
));
/**** ><> ↑ --------- Closing tags and end of function ->  */
