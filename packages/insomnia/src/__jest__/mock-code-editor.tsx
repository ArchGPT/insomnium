import React, { createRef, PureComponent } from 'react';
/**** ><> ↑ --------- Import statements ->  */

export class MockCodeEditor extends PureComponent<any> {
  ref = createRef<HTMLTextAreaElement>();

  setSelection() {}

  focus() {
    this.ref.current?.focus();
  }
/**** ><> ↑ --------- Methods ->  */

  render() {
    const { id, onChange, placeholder, defaultValue } = this.props;
    return <textarea
      data-testid="CodeEditor"
      ref={this.ref}
      id={id}
      onChange={event => onChange(event.currentTarget.value)}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />;
  }
}
/**** ><> ↑ --------- Component declaration ->  */
/**** ><> ↑ --------- Render method ->  */
