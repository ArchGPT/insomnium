export default {
  name: 'dark',
  displayName: 'Simple Dark',
  theme: {
    foreground: {
      default: '#ddd',
    },
/**** ><> ↑ --------- Foreground color properties ->  */
    background: {
      default: '#222',
      success: '#8fc860',
      notice: '#e5ca1e',
      warning: '#f9a230',
      danger: '#f06d6b',
      surprise: '#aca0f2',
      info: '#6eccec',
    },
/**** ><> ↑ --------- Background color properties ->  */
    styles: {
      paneHeader: {
        background: {
          success: '#77a855',
          notice: '#d1b81c',
          warning: '#d9892c',
          danger: '#d35855',
          surprise: '#8e84cb',
          info: '#62a6c3',
        },
      },
      dialog: {
        background: {
          default: '#2a2a2a',
        },
      },
    },
/**** ><> ↑ --------- Exporting a theme object with its properties ->  */
/**** ><> ↑ --------- Styles properties ->  */
  },
};
/**** ><> ↑ --------- Dialog style properties ->  */
