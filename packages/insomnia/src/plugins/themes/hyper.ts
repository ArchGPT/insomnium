export default {
  name: 'hyper',
  displayName: 'Hyper',
  theme: {
/**** ><> ↑ --------- Default export setup ->  */
    foreground: {
      default: '#ddd',
    },
/**** ><> ↑ --------- Theme foreground settings ->  */
    background: {
      default: '#000',
      success: '#87ee59',
      notice: '#f8d245',
      warning: '#f9ac2a',
      danger: '#ff505c',
      surprise: '#f24aff',
      info: '#23dce8',
    },
/**** ><> ↑ --------- Theme background settings ->  */
    rawCss: `
      .tooltip, .dropdown__menu {
        opacity: 0.95;
      }
    `,
/**** ><> ↑ --------- Raw CSS setup ->  */
    styles: {
      dialog: {
/**** ><> ↑ --------- Styles setup ->  */
        background: {
          default: '#111',
        },
      },
/**** ><> ↑ --------- Dialog settings ->  */
      transparentOverlay: {
        background: {
          default: 'rgba(0, 0, 0, 0.5)',
        },
      },
/**** ><> ↑ --------- Transparent overlay settings ->  */
      sidebar: {
        highlight: {
          default: '#aaa',
        },
      },
/**** ><> ↑ --------- Sidebar settings ->  */
      paneHeader: {
        background: {
          default: '#000',
          success: '#6ac04b',
          notice: '#ebc742',
          warning: '#ea9f29',
          danger: '#df4b56',
          surprise: '#ed46f9',
          info: '#20bec9',
        },
      },
    },
/**** ><> ↑ --------- Pane header settings ->  */
  },
};
/**** ><> ↑ --------- Export closure ->  */
