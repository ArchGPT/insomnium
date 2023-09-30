export default {
/**** ><> ↑ --------- Component export ->  */
  name: 'railscasts',
  displayName: 'Railscasts',
/**** ><> ↑ --------- Component metadata ->  */
  theme: {
    foreground: {
      default: '#ddd',
    },
/**** ><> ↑ --------- Default theme foreground ->  */
    background: {
      default: '#2b2b2b',
      success: '#a5c261',
      notice: '#ffc66d',
      warning: '#e48a37',
      danger: '#ee4b3b',
      surprise: '#b6b3eb',
      info: '#6d9cbe',
    },
/**** ><> ↑ --------- Default theme background ->  */
    styles: {
      paneHeader: {
        background: {
          default: '#2b2b2b',
          success: '#97b159',
          notice: '#efba66',
          warning: '#e48a37',
          danger: '#dc4939',
          surprise: '#a3a1d3',
          info: '#6d9cbe',
        },
      },
/**** ><> ↑ --------- Pane header styles ->  */
      dialog: {
        background: {
          default: '#323232',
        },
      },
/**** ><> ↑ --------- Dialog styles ->  */
      transparentOverlay: {
        background: {
          default: 'rgba(30, 30, 30, 0.8)',
        },
        foreground: {
          default: '#e1deda',
        },
      },
/**** ><> ↑ --------- Transparent overlay styles ->  */
    },
  },
};
/**** ><> ↑ --------- End of object ->  */
