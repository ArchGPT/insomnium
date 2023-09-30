import React, { forwardRef, ForwardRefRenderFunction } from 'react';
/**** ><> ↑ --------- Imports dependencies ->  */

export const mockRenderWithProps = jest.fn();
/**** ><> ↑ --------- Defines and exports a mock function ->  */

export const MockComponentTestId = 'MockComponent';
/**** ><> ↑ --------- Exports a constant for component test id ->  */

const MockComponentWithRef: ForwardRefRenderFunction<any, any> = (props, ref) => {
  mockRenderWithProps(props);
  return <div ref={ref} data-testid={MockComponentTestId} />;
};
/**** ><> ↑ --------- Defines a mock component with a reference using ForwardRefRenderFunction ->  */

export const MockComponent = forwardRef(MockComponentWithRef);
/**** ><> ↑ --------- Exports the component after forwarding the ref ->  */
