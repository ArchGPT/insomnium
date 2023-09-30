import React, { FC, HTMLAttributes, useEffect, useRef } from 'react';
/**** ><> ↑ --------- Import statements ->  */

interface Props extends HTMLAttributes<HTMLInputElement> {
  indeterminate: boolean;
  checked: boolean;
}
/**** ><> ↑ --------- Interface declaration ->  */

export const IndeterminateCheckbox: FC<Props> = ({ checked, indeterminate, ...otherProps }) => {
  const checkRef = useRef<HTMLInputElement>(null);
/**** ><> ↑ --------- Component declaration and props destructuring ->  */

  useEffect(() => {
    if (checkRef.current) {
      checkRef.current.checked = checked;
      checkRef.current.indeterminate = indeterminate;
    }
  }, [checked, indeterminate]);
/**** ><> ↑ --------- useEffect hook for setting checked and indeterminate properties ->  */

  return (
    <input
      type="checkbox"
      ref={checkRef}
      {...otherProps}
    />
  );
};
/**** ><> ↑ --------- Component return statement ->  */
