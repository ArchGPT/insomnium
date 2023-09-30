const sidebarBackground = {
  default: '#2C2C2C',
  success: '#7ecf2b',
  notice: '#f0e137',
  warning: '#ff9a1f',
  danger: '#ff5631',
  surprise: '#a896ff',
  info: '#46c1e6',
};
/**** ><> ↑ --------- Definition of sidebar background color codes ->  */

export default {
  name: 'legacy',
  displayName: 'Legacy',
  theme: {
    background: sidebarBackground,
    foreground: {
      default: '#eee',
    },
    styles: {
      transparentOverlay: {
        background: {
          default: 'rgba(30, 30, 30, 0.8)',
        },
        foreground: {
          default: '#ddd',
        },
      },
      dialog: {
        background: {
          default: '#fff',
        },
        foreground: {
          default: '#333',
        },
      },
/**** ><> ↑ --------- Definition of dialog style ->  */
      appHeader: {
        background: {
          default: '#2C2C2C',
        },
      },
/**** ><> ↑ --------- Definition of appHeader style ->  */
      sidebar: {
        background: sidebarBackground,
        foreground: {
          default: '#e0e0e0',
        },
        highlight: {
          default: '#999',
        },
      },
/**** ><> ↑ --------- Definition of sidebar style ->  */
      sidebarHeader: {
        background: {
          default: '#695eb8',
        },
        foreground: {
          default: '#fff',
        },
      },
/**** ><> ↑ --------- Definition of sidebarHeader style ->  */
      paneHeader: {
        foreground: {
          default: '#ccc',
        },
        background: {
          default: '#212121',
          success: '#75ba24',
          notice: '#d8c84d',
          warning: '#ec8702',
          danger: '#e15251',
          surprise: '#8776d5',
          info: '#20aed9',
        },
      },
/**** ><> ↑ --------- Definition of paneHeader style ->  */
      pane: {
        background: {
          ...sidebarBackground,
          default: '#292929',
        },
        foreground: {
          default: '#e0e0e0',
        },
/**** ><> ↑ --------- Definition of styles within theme ->  */
        highlight: {
/**** ><> ↑ --------- Definition of export default object ->  */
          default: '#999',
        },
      },
    },
  },
};
/**** ><> ↑ --------- Definition of pane style ->  */
