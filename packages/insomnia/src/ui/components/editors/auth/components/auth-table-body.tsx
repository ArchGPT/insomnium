import React, { FC, ReactNode } from 'react';
/**** ><> ↑ --------- Importing React and Types */

export const AuthTableBody: FC<{children: ReactNode}> = ({ children }) => (
  <div className="pad">
    <table>
      <tbody>
        {children}
      </tbody>
    </table>
  </div>);
/**** ><> ↑ --------- Component Export */
