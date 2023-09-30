declare module 'yaml-source-map' {
/**** ><> ↑ --------- Declaration of module 'yaml-source-map' ->  */
  interface Location {
    filename?: string;
    start: {
      line: number;
      col: number;
    };
    end: {
      line: number;
      col: number;
    };
  }
/**** ><> ↑ --------- Interface Location with properties ->  */

  export default class YAMLSourceMap {
    constructor();
    index(doc: YAML.Document.Parsed): object;
    lookup(path: string[], document: object): Location | undefined;
  }
/**** ><> ↑ --------- Export of the class YAMLSourceMap ->  */
}
/**** ><> ↑ --------- End of the module 'yaml-source-map' ->  */
