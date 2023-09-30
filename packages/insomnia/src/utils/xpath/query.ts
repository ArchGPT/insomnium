import { DOMParser } from 'xmldom';
import xpath, { SelectedValue } from 'xpath';
/**** ><> ↑ --------- Import statements ->  */

/**
 * Query an XML blob with XPath
 */
/**** ><> ↑ --------- Function comment ->  */
export const queryXPath = (xml: string, query?: string) => {
  const dom = new DOMParser().parseFromString(xml);
  let selectedValues: SelectedValue[] = [];
/**** ><> ↑ --------- Function definition and initialization ->  */
  if (query === undefined) {
    throw new Error('Must pass an XPath query.');
  }
/**** ><> ↑ --------- Error handling for undefined query ->  */
  try {
    selectedValues = xpath.select(query, dom);
  } catch (err) {
    throw new Error(`Invalid XPath query: ${query}`);
  }
/**** ><> ↑ --------- XPath query execution and error handling ->  */
  // Functions return plain strings
  if (typeof selectedValues === 'string') {
    return [{ outer: selectedValues, inner: selectedValues }];
  }
/**** ><> ↑ --------- Return plain string if selectedValues is string ->  */

  return (selectedValues as Node[])
    .filter(sv => sv.nodeType === Node.ATTRIBUTE_NODE
      || sv.nodeType === Node.ELEMENT_NODE
      || sv.nodeType === Node.TEXT_NODE)
    .map(selectedValue => {
      const outer = selectedValue.toString().trim();
      if (selectedValue.nodeType === Node.ATTRIBUTE_NODE) {
        return { outer, inner: selectedValue.nodeValue };
      }
      if (selectedValue.nodeType === Node.ELEMENT_NODE) {
        return { outer, inner: selectedValue.childNodes.toString() };
      }
      if (selectedValue.nodeType === Node.TEXT_NODE) {
        return { outer, inner: selectedValue.toString().trim() };
      }
      return { outer, inner: null };
    });
/**** ><> ↑ --------- Processing selectedValues for different node types ->  */

};
/**** ><> ↑ --------- Function end ->  */
