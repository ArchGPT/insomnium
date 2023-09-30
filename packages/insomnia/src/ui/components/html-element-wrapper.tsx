import React, { FC, useEffect, useRef } from 'react';
/**** ><> ↑ --------- Imports ->  */

interface Props {
  el: HTMLElement;
  onUnmount?: () => void;
}
/**** ><> ↑ --------- Props Interface ->  */

/**
 * This component provides an easy way to place a raw DOM node inside a React application.
 * This was created to facilitate the layer between UI plugins and the Insomnium application.
 */
/**** ><> ↑ --------- Component Description ->  */
export const HtmlElementWrapper: FC<Props> = ({ el, onUnmount }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      ref.current.appendChild(el);
    }
    return () => {
      onUnmount && onUnmount();
    };
  });
  return <div ref={ref} />;
};
/**** ><> ↑ --------- HtmlElementWrapper Component ->  */
