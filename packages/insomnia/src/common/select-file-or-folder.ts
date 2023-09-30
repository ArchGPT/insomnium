interface Options {
  itemTypes?: ('file' | 'directory')[];
  extensions?: string[];
}

interface FileSelection {
  filePath: string;
  canceled: boolean;
}

/**** ><> ↑ --------- Interface definitions for Options and FileSelection. ->  */
export const selectFileOrFolder = async ({ itemTypes, extensions }: Options) => {
  // If no types are selected then default to just files and not directories
  const types = itemTypes || ['file'];
  let title = 'Select ';

  if (types.includes('file')) {
    title += ' File';

    if (types.length > 2) {
      title += ' or';
    }
  }

  if (types.includes('directory')) {
    title += ' Directory';
  }
/**** ><> ↑ --------- Definition and implementation of the selectFileOrFolder function starts, including default logic for itemTypes. ->  */

  const { canceled, filePaths } = await window.dialog.showOpenDialog({
    title,
    buttonLabel: 'Select',
    properties: types.map(type => {
      switch (type) {
        case 'file':
          return 'openFile';

        case 'directory':
          return 'openDirectory';

        default:
          throw new Error(`unrecognized item type: "${type}"`);
      }
    }),
/**** ><> ↑ --------- An async function call to open a dialog for file or directory selection with switch logic for types. ->  */
    filters: [{
      extensions: (extensions?.length ? extensions : ['*']),
      name: '',
    }],
/**** ><> ↑ --------- Setting and passing filters to the dialog ->  */
  });

  const fileSelection: FileSelection = {
    filePath: filePaths[0],
    canceled,
  };
  return fileSelection;
};
/**** ><> ↑ --------- Setting up the file selection object and returning it ->  */
