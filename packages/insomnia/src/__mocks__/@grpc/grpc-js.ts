import grpcJSOriginal from '@grpc/grpc-js';
import { jest } from '@jest/globals';
import { EventEmitter } from 'events';
/**** ><> ↑ --------- Module imports ->  */

const grpcJs = jest.requireActual('@grpc/grpc-js') as typeof grpcJSOriginal;

/**** ><> ↑ --------- Mock setup for gRPC library ->  */
const mockCallWrite = jest.fn();
const mockCallEnd = jest.fn();
const mockCallCancel = jest.fn();
/**** ><> ↑ --------- Declaration of mock functions for gRPC method calls ->  */

export const status = grpcJs.status;
/**** ><> ↑ --------- Export gRPC statuses ->  */

class MockCall extends EventEmitter {
  write(...args) {
    mockCallWrite(...args);
  }

  end(...args) {
    mockCallEnd(...args);
  }

  cancel(...args) {
    mockCallCancel(...args);
  }
}
/**** ><> ↑ --------- Mock gRPC Call class ->  */

let mockCall = new MockCall();

const makeMockCall = () => {
  mockCall = new MockCall();
};

const getMockCall = () => mockCall;

/**** ><> ↑ --------- Creation and management of mock gRPC calls ->  */
const mockConstructor = jest.fn();
const mockMakeUnaryRequest = jest.fn();
const mockMakeClientStreamRequest = jest.fn();
const mockMakeServerStreamRequest = jest.fn();
const mockMakeBidiStreamRequest = jest.fn();
const mockCreateInsecure = jest.fn();
const mockCreateSsl = jest.fn();
/**** ><> ↑ --------- Declaration of mock gRPC client methods ->  */

export const grpcMocks = {
  getMockCall,
  mockConstructor,
  mockMakeUnaryRequest,
  mockMakeClientStreamRequest,
  mockMakeServerStreamRequest,
  mockMakeBidiStreamRequest,
  mockCreateInsecure,
  mockCreateSsl,
  mockCallWrite,
  mockCallEnd,
  mockCallCancel,
};
/**** ><> ↑ --------- Export object containing gRPC mocks ->  */

class MockGrpcClient {
  constructor(...args) {
    mockConstructor(...args);
  }

  makeUnaryRequest(...args) {
    mockMakeUnaryRequest(...args);
    makeMockCall();
    return getMockCall();
  }

  makeClientStreamRequest(...args) {
    mockMakeClientStreamRequest(...args);
    makeMockCall();
    return getMockCall();
  }

  makeServerStreamRequest(...args) {
    mockMakeServerStreamRequest(...args);
    makeMockCall();
    return getMockCall();
  }

  makeBidiStreamRequest(...args) {
    mockMakeBidiStreamRequest(...args);
    makeMockCall();
    return getMockCall();
  }

}
/**** ><> ↑ --------- Mock gRPC Client class ->  */

export function makeGenericClientConstructor() {
  return MockGrpcClient;
}
/**** ><> ↑ --------- Export function to create mock gRPC client ->  */

export class Metadata {
  /**
   * Mock Metadata class to avoid TypeError: grpc.Metadata is not a constructor
   */
  constructor() {
    // Do nothing
  }
}
/**** ><> ↑ --------- Mock gRPC Metadata class ->  */

export const credentials = {
  createInsecure: mockCreateInsecure,
  createSsl: mockCreateSsl,
};
/**** ><> ↑ --------- Export object containing mock gRPC credentials ->  */
