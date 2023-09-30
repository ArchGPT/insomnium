export default {
  name: 'studio-colorful',
  displayName: 'Designer Dark',
  theme: {
/**** ><> ↑ --------- Component export and metadata ->  */
    foreground: {
      default: '#e6eff5',
    },
    background: {
      default: '#003052',
      success: '#69c790',
      notice: '#edcb02',
      warning: '#e89c42',
      danger: '#ef6e6e',
      surprise: '#bfa3f9',
      info: '#6ac7e6',
    },
/**** ><> ↑ --------- Theme color configuration: foreground and background ->  */
    highlight: {
      default: 'rgba(133, 157, 176)',
      xxs: 'rgba(133, 157, 176, 0.05)',
      xs: 'rgba(133, 157, 176, 0.1)',
      sm: 'rgba(133, 157, 176, 0.2)',
      md: 'rgba(133, 157, 176, 0.3)',
      lg: 'rgba(133, 157, 176, 0.5)',
      xl: 'rgba(133, 157, 176, 0.8)',
    },
/**** ><> ↑ --------- Theme color configuration: highlight ->  */
    styles: {
      appHeader: {
        foreground: {
          default: '#fff',
        },
      },
      link: {
        foreground: {
          default: '#68a9a2',
        },
      },
/**** ><> ↑ --------- Styling configuration for different components: appHeader, link ->  */
      sidebar: {
        foreground: {
          default: '#fff',
        },
        background: {
          default: '#003961',
        },
      },
/**** ><> ↑ --------- Styling configuration for sidebar ->  */
      dialog: {
        background: {
          default: '#004672',
        },
      },
      transparentOverlay: {
        background: {
          default: 'rgba(0,37,64,0.8)',
        },
      },
/**** ><> ↑ --------- Styling configuration for dialog and transparentOverlay ->  */
    },
  },
/**** ><> ↑ --------- Closing elements of styles and theme ->  */
};
/**** ><> ↑ --------- End of object ->  */
