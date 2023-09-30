import React from 'react';

import { useAIContext } from '../context/app/ai-context';
/**** ><> ↑ --------- Import dependencies */

export const InsomniaAI = ({
  ...props
}: React.SVGProps<SVGSVGElement>) => {
/**** ><> ↑ --------- Function declaration with destructured props */
  const { generating: loading } = useAIContext();
/**** ><> ↑ --------- Use AI context hook */

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width="16"
      height="16"
      {...props}
    >
/**** ><> ↑ --------- Return SVG component with properties */
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.446-7.189L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zm-1.365 11.852L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      >
        {loading && (
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </path>
/**** ><> ↑ --------- Path element with animation */
    </svg>
  );
};
/**** ><> ↑ --------- End of function */
