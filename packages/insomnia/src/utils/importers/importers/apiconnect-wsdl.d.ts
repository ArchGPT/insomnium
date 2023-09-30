// eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a temporary hold-me-over while we get the types into better condition
type UNKNOWN = any;
interface UNKNOWN_OBJ {
  [key: string]: UNKNOWN;
}
/**** ><> ↑ --------- Declaration of UNKNOWN type and related interface ->  */

type WSDL = UNKNOWN;
/**** ><> ↑ --------- Declaration of WSDL type ->  */

interface Service {
  service: string;
  filename: string;
}

interface ServiceData {
  services: Service[];
}
/**** ><> ↑ --------- Declaration of Service and ServiceData interfaces ->  */

interface WSDLEntry {
  serviceJSON: UNKNOWN;
  fullName: string;
  filename: string;
}
/**** ><> ↑ --------- Declaration of WSDLEntry interface ->  */

declare module 'apiconnect-wsdl' {
  export function getJsonForWSDL(
    location: string,
    /** Authorization header */
    auth?: string,
    options?: {
      selfContained?: boolean;
      config?: UNKNOWN;
      req?: UNKNOWN;
      flatten?: boolean;
      sanitizeWSDL?: boolean;
    }
  ): Promise<WSDL[]>;

  export function getWSDLServices(
    allWSDLs: WSDL[],
    options?: UNKNOWN_OBJ
  ): ServiceData;

  export function findWSDLForServiceName(
    allWSDLs: WSDL[],
    serviceName: string,
    serviceFilename?: string
  ): WSDLEntry;

  export interface Swagger {
    definitions: {
      Security?: UNKNOWN;
    };
    consumes: string[];
    produces: string[];
    info: {
      title: string;
    };
    ['x-ibm-configuration']: {
      assembly: {
        execute: {
          proxy: {
            ['target-url']: string;
          };
        }[];
      };
    };
    paths: UNKNOWN_OBJ;
  }

  export function getSwaggerForService(
    wsdlEntry: WSDLEntry,
    serviceName: string,
    wsdlId: string,
    createOptions?: UNKNOWN_OBJ
  ): Swagger;
}
/**** ><> ↑ --------- Declaration of 'apiconnect-wsdl' module and its related interfaces and functions ->  */
