export default {
  name: 'material',
  displayName: 'Material',
/**** ><> ↑ --------- Module export and metadata ->  */
  theme: {
    background: {
      default: '#263238',
      success: '#80cbc4',
      notice: '#ffcb6b',
      warning: '#f77669',
      danger: '#ff5370',
      surprise: '#c792ea',
      info: '#82b1ff',
    },
/**** ><> ↑ --------- Theme background colors ->  */
    foreground: {
      default: '#dde1e1',
      success: '#fff',
      notice: '#fff',
      warning: '#fff',
      danger: '#fff',
      surprise: '#fff',
      info: '#fff',
    },
/**** ><> ↑ --------- Theme foreground colors ->  */
    highlight: {
      default: 'rgba(114, 145, 143, 1)',
      xxs: 'rgba(114, 145, 143, 0.05)',
      xs: 'rgba(114, 145, 143, 0.1)',
      sm: 'rgba(114, 145, 143, 0.15)',
      md: 'rgba(114, 145, 143, 0.2)',
      lg: 'rgba(114, 145, 143, 0.5)',
      xl: 'rgba(114, 145, 143, 0.8)',
    },
/**** ><> ↑ --------- Theme highlight colors and gradations ->  */
    rawCss: `
      .tooltip, .dropdown__menu {
        opacity: 0.95;
      }
    `,
/**** ><> ↑ --------- Raw CSS for specific elements ->  */
    styles: {
      link: {
        foreground: {
          default: '#68a9a2',
        },
/**** ><> ↑ --------- Styling for links ->  */
      },
      dialog: {
        background: {
          default: '#303c43',
        },
        foreground: {
          default: '#dde1e1',
        },
      },
/**** ><> ↑ --------- Styling for dialogs ->  */
      paneHeader: {
        background: {
          success: '#68a9a2',
          notice: '#e6b564',
          warning: '#e27164',
          danger: '#d64b66',
          surprise: '#b482d6',
          info: '#6c93d8',
        },
      },
/**** ><> ↑ --------- Styling for pane headers ->  */
      sidebarHeader: {
        highlight: {
          xxs: 'rgba(114, 145, 143, 0.05)',
          xs: 'rgba(114, 145, 143, 0.08)',
          sm: 'rgba(114, 145, 143, 0.1)',
          md: 'rgba(114, 145, 143, 0.2)',
          lg: 'rgba(114, 145, 143, 0.4)',
          xl: 'rgba(114, 145, 143, 0.5)',
        },
      },
/**** ><> ↑ --------- Styling for sidebar headers ->  */
      transparentOverlay: {
        background: {
          default: 'rgba(37, 49, 55, 0.9)',
        },
      },
/**** ><> ↑ --------- Styling for transparent overlays ->  */
    },
  },
};
/**** ><> ↑ --------- Closing of object and module ->  */
