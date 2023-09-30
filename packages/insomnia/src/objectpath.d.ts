declare module 'objectpath' {
/**** ><> ↑ --------- Module declaration ->  */
    export function parse(str: string): string[];
/**** ><> ↑ --------- Export parse function ->  */

    export function stringify(
        arr: string | (string | number)[],
        quote?: '"' | "'",
        forceQuote?: boolean
    ): string;
/**** ><> ↑ --------- Export stringify function ->  */

    export function normalize(
        data: string,
        quote?: '"' | "'",
        forceQuote?: boolean
    ): string;
/**** ><> ↑ --------- Export normalize function ->  */
}
/**** ><> ↑ --------- Module closure ->  */
