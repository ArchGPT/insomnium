// Import
import { ActionFunction } from 'react-router-dom';

import { fetchImportContentFromURI, scanResources, ScanResult } from '../../common/import';
import { guard } from '../../utils/guard';

export interface ScanForResourcesActionResult extends ScanResult { }

export const scanForResourcesAction: ActionFunction = async ({ request }): Promise<ScanForResourcesActionResult> => {
  const formData = await request.formData();

  const source = formData.get('importFrom');
  guard(typeof source === 'string', 'Source is required.');
  guard(['file', 'uri', 'clipboard'].includes(source), 'Unsupported import type');

  let content = '';
  if (source === 'uri') {
    const uri = formData.get('uri');
    if (typeof uri !== 'string' || uri === '') {
      return {
        errors: ['URI is required'],
      };
    }

    content = await fetchImportContentFromURI({
      uri,
    });
  } else if (source === 'file') {
    const filePath = formData.get('filePath');
    if (typeof filePath !== 'string' || filePath === '') {
      return {
        errors: ['File is required'],
      };
    }
    const uri = `file://${filePath}`;

    content = await fetchImportContentFromURI({
      uri,
    });
  } else {
    content = window.clipboard.readText();
  }

  if (!content) {
    return {
      errors: ['No content to import'],
    };
  }

  const result = await scanResources({ content });

  return result;
};

export interface ImportResourcesActionResult {
  errors?: string[];
  done: boolean;
}
