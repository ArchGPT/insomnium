import React, { SVGProps, memo } from 'react';
export const SvgIcnQuestion = memo<SVGProps<SVGSVGElement>>(props => (
/**** ><> ↑ --------- Importing React dependencies and setting up the exportable function for the SVG icon ->  */
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
/**** ><> ↑ --------- Setting up the SVG properties ->  */
  >
    <path fill="none" d="M0 0h14v14H0z" />
/**** ><> ↑ --------- Drawing the first empty path ->  */
    <path
      d="M8.003 9.5H6.25V11h1.753V9.5ZM8.5 5.5c0 .382-.31.782-.927.935-.076.019-.613.217-.613.217-.439.147-.694.561-.71.975V8.5h1.753s-.003-.5 0-.643C9.167 7.513 10 6.587 10 5.5 10 4.12 8.657 3 7 3S4 4.12 4 5.5h1.5c0-.486.617-1 1.5-1s1.5.514 1.5 1Z"
      fill=""
    />
/**** ><> ↑ --------- Drawing the second path which possibly describes the visual of the icon ->  */
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 0a7 7 0 1 1 0 14A7 7 0 0 1 7 0Zm0 1.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
      fill=""
    />
/**** ><> ↑ --------- Drawing the last path which possibly adds a border to the icon ->  */
  </svg>
));
/**** ><> ↑ --------- Closing SVG tag and the main function ->  */
