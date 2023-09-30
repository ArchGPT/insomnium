import classnames from 'classnames';
import React, { FC, ReactNode, useCallback } from 'react';
/**** ><> ↑ --------- Import Statements ->  */

interface Props {
  href: string;
  title?: string;
  button?: boolean;
  onClick?: (...args: any[]) => any;
  className?: string;
  children?: ReactNode;
  noTheme?: boolean;
}
/**** ><> ↑ --------- Props Interface Definition ->  */

export const Link: FC<Props> = ({
  onClick,
  button,
  href,
  children,
  className,
  noTheme,
  ...other
}) => {
/**** ><> ↑ --------- Props Destructuring ->  */
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    event?.preventDefault();
    onClick?.(event); // Also call onClick that was passed to us if there was one
    window.main.openInBrowser(href);
  }, [onClick, href]);
/**** ><> ↑ --------- Click Event Handler Definition ->  */

  if (button) {
    return (
      <button onClick={handleClick} className={className} {...other}>
        {children}
      </button>
    );
  }
/**** ><> ↑ --------- Button Rendering Condition ->  */

  return (
    <a
      href={href}
      onClick={handleClick}
      className={classnames(className, {
        'theme--link': !noTheme,
      })}
      {...other}
    >
      {children}
    </a>
  );
};
/**** ><> ↑ --------- Anchor Element Rendering ->  */
