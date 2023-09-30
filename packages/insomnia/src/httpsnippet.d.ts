// @TODO We should make a PR for improving the types of httpsnippet.
/**** ><> ↑ --------- Comment ->  */
declare module 'httpsnippet' {
/**** ><> ↑ --------- Module Declaration ->  */
  export interface HTTPSnippetClient {
    key: string;
    title: string;
    link: string;
    description: string;
  }
/**** ><> ↑ --------- Interface HTTPSnippetClient ->  */

  export interface HTTPSnippetTarget {
    key: string;
    title: string;
    extname: string;
    default: string;
    clients: HTTPSnippetClient[];
  }
/**** ><> ↑ --------- Interface HTTPSnippetTarget ->  */

  class HTTPSnippet {
    constructor(data: any);
    convert(target: string, options?: any): string | false;

    convert(target: string, client?: string, options?: any): string | false;

    static addTarget(target: HTTPSnippetTarget): void;

    static addTargetClient(target: string, client: HTTPSnippetClient): void;

    static extName(target: string): string;
    static availableTargets(): HTTPSnippetTarget[];
  }
/**** ><> ↑ --------- Class HTTPSnippet ->  */

  export default HTTPSnippet;
/**** ><> ↑ --------- Default export of HTTPSnippet ->  */
}
/**** ><> ↑ --------- End of Module Declaration ->  */
