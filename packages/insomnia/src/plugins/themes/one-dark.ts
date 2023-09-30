export default {
  name: 'one-dark',
  displayName: 'One Dark',
  theme: {
/**** ><> ↑ --------- Export and theme name ->  */
    background: {
      default: '#272c35',
      success: '#98c379',
      notice: '#e3a96c',
      warning: '#d19a66',
      danger: '#e06c75',
      surprise: '#c678dd',
      info: '#56b6c2',
    },
/**** ><> ↑ --------- Background colors configuration ->  */
    foreground: {
      default: '#bbb',
      success: '#fff',
      notice: '#fff',
      warning: '#fff',
      danger: '#fff',
      surprise: '#fff',
      info: '#fff',
    },
/**** ><> ↑ --------- Foreground colors configuration ->  */
    highlight: {
      default: 'rgba(114, 121, 133, 1)',
      xxs: 'rgba(114, 121, 133, 0.05)',
      xs: 'rgba(114, 121, 133, 0.1)',
      sm: 'rgba(114, 121, 133, 0.2)',
      md: 'rgba(114, 121, 133, 0.4)',
      lg: 'rgba(114, 121, 133, 0.6)',
      xl: 'rgba(114, 121, 133, 0.8)',
    },
/**** ><> ↑ --------- Highlight configuration ->  */
    styles: {
      appHeader: {
        background: {
          default: '#20252c',
        },
      },
      sidebar: {
        background: {
          default: '#20252c',
        },
      },
      dialog: {
        background: {
          default: '#303640',
        },
      },
      paneHeader: {
        background: {
          success: '#8ab46d',
          notice: '#d19a66',
          warning: '#d19a66',
          danger: '#d86a6f',
          surprise: '#c678dd',
          info: '#51acb7',
        },
      },
      transparentOverlay: {
        background: {
          default: 'rgba(30, 33, 40, 0.8)',
        },
      },
    },
/**** ><> ↑ --------- Application styles and colors ->  */
  },
};
/**** ><> ↑ --------- End of theme configuration ->  */
