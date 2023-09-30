import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
/**** ><> ↑ --------- Importing libraries */

import { GrpcSendButton } from '../grpc-send-button';
/**** ><> ↑ --------- Importing components */

describe('<GrpcSendButton />', () => {
  it('should render as disabled if no method is selected', () => {
    const { getByRole } = render(
      <GrpcSendButton
        running={false}
        handleStart={jest.fn()}
        handleCancel={jest.fn()}
        methodType={undefined}
      />,
    );
    const button = getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Send');
  });
/**** ><> ↑ --------- Test Case: Render as disabled */

  it('should render cancel button if running', () => {
    const handleCancel = jest.fn();
    const { getByRole } = render(
      <GrpcSendButton
        running={true}
        handleStart={jest.fn()}
        handleCancel={handleCancel}
        methodType={'unary'}
      />,
    );
    const button = getByRole('button');
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Cancel');
    fireEvent.click(button);
    expect(handleCancel).toHaveBeenCalled();
  });
/**** ><> ↑ --------- Test Case: Render cancel button */

  it('should render send button if unary RPC', () => {
    const handleSend = jest.fn();
    const { getByRole } = render(
      <GrpcSendButton
        running={false}
        handleStart={handleSend()}
        handleCancel={jest.fn()}
        methodType={'unary'}
      />,
    );
    const button = getByRole('button');
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Send');
    fireEvent.click(button);
    expect(handleSend).toHaveBeenCalled();
  });
/**** ><> ↑ --------- Test Case: Render send button */

  it.each(['bidi', 'server', 'client'])(
    'should render start button if streaming RPC: %s',
    type => {
      const handleSend = jest.fn();
      const { getByRole } = render(
        <GrpcSendButton
          running={false}
          handleStart={handleSend()}
          handleCancel={jest.fn()}
          methodType={type}
        />,
      );
      const button = getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent('Start');
      fireEvent.click(button);
      expect(handleSend).toHaveBeenCalled();
    },
  );
});
/**** ><> ↑ --------- Test Case: Render start button for different types */
