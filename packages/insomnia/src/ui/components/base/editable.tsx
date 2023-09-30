import React, { FC, ReactElement, useCallback, useRef, useState } from 'react';

import { createKeybindingsHandler } from '../keydown-binder';
import { HighlightProps } from './highlight';

/**** ><> ↑ --------- Import statements and declarations ->  */
export const shouldSave = (oldValue: string, newValue: string | undefined, preventBlank = false) => {
  // Should not save if length = 0 and we want to prevent blank
  if (preventBlank && !newValue?.length) {
    return false;
  }

  // Should not save if old value and new value is the same
  if (oldValue === newValue) {
    return false;
  }

  // Should save
  return true;
};
/**** ><> ↑ --------- Utility function shouldSave ->  */

interface Props {
  blankValue?: string;
  className?: string;
  fallbackValue?: string;
  onEditStart?: () => void;
  onSubmit: (value: string) => void;
  preventBlank?: boolean;
  renderReadView?: (value: string | undefined, props: any) => ReactElement<HighlightProps>;
  singleClick?: boolean;
  value: string;
}
/**** ><> ↑ --------- Interface Props definition ->  */

export const Editable: FC<Props> = ({
  blankValue,
  className,
  fallbackValue,
  onEditStart,
  onSubmit,
  preventBlank,
  renderReadView,
  singleClick,
  value,
  ...childProps
}) => {
/**** ><> ↑ --------- Editable component declaration ->  */
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

/**** ><> ↑ --------- Editable component state and refs ->  */
  const handleEditStart = () => {
    setEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    if (onEditStart) {
      onEditStart();
    }
  };
/**** ><> ↑ --------- Editable component handleEditStart function ->  */

  const onSingleClick = () => singleClick && handleEditStart();

/**** ><> ↑ --------- Editable component onSingleClick function ->  */
  const handleEditEnd = useCallback(() => {
    if (shouldSave(value, inputRef.current?.value.trim(), preventBlank)) {
      // Don't run onSubmit for values that haven't been changed
      onSubmit(inputRef.current?.value.trim() || '');
    }

    // This timeout prevents the UI from showing the old value after submit.
    // It should give the UI enough time to redraw the new value.
    setTimeout(() => setEditing(false), 100);
  }, [onSubmit, preventBlank, value]);
/**** ><> ↑ --------- Editable component handleEditEnd function ->  */

  const handleKeyDown = createKeybindingsHandler({
    'Enter': handleEditEnd,
    'Escape': () => {
      if (inputRef.current) {
        // Set the input to the original value
        inputRef.current.value = value;

        handleEditEnd();
      }
    },
  });
/**** ><> ↑ --------- Editable component handleKeyDown function ->  */

  const initialValue = value || fallbackValue;
  if (editing) {
    return (
      <input
        {...childProps}
        className={`editable ${className || ''}`}
        type="text"
        ref={inputRef}
        defaultValue={initialValue}
        onBlur={handleEditEnd}
        onKeyDown={handleKeyDown}
      />
    );
  }
  const readViewProps = {
    className: `editable ${className} ${!initialValue && 'empty'}`,
    title: singleClick ? 'Click to edit' : 'Double click to edit',
    onClick: onSingleClick,
    onDoubleClick: handleEditStart,
    ...childProps,
  };
  return renderReadView ?
    renderReadView(initialValue, readViewProps)
    : <span {...readViewProps}>{initialValue || blankValue}</span>;

};
/**** ><> ↑ --------- Editable component rendering phase ->  */
