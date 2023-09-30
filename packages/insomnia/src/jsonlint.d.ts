declare module 'jsonlint-mod-fixed' {
/**** ><> ↑ --------- Module declaration ->  */

    interface ParseErrorHash {
        expected?: string[];
        line?: number;
        loc?: {
            first_column: number;
            first_line: number;
            last_column: number;
            last_line: number;
        };
        message?: string;
        text?: string;
        token?: string | null;
    }
/**** ><> ↑ --------- Interface definition ->  */

    export function parse(input: string): string;
/**** ><> ↑ --------- Function Export ->  */
    export namespace parser {
        export function parseError(str: string, hash: ParseErrorHash): void;
    }
/**** ><> ↑ --------- Namespace and Function Export ->  */

}
/**** ><> ↑ --------- Module closure ->  */
