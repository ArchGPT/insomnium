export default {
/**** ><> ↑ --------- Exporting a default object ->  */
  name: 'solarized-dark',
  displayName: 'Solarized Dark',
/**** ><> ↑ --------- Object properties 'name' and 'displayName' ->  */
  theme: {
    background: {
      default: '#002b36',
      success: '#859900',
      notice: '#b58900',
      warning: '#cb4b16',
      danger: '#dc322f',
      surprise: '#6c71c4',
      info: '#2aa198',
    },
    foreground: {
      default: '#839496',
    },
/**** ><> ↑ --------- Defining the 'foreground' object with color properties ->  */
    highlight: {
      default: 'rgb(142, 149, 146)',
      xxs: 'rgba(159, 167, 164, 0.05)',
      xs: 'rgba(159, 167, 164, 0.1)',
      sm: 'rgba(159, 167, 164, 0.2)',
      md: 'rgba(142, 149, 146, 0.3)',
      lg: 'rgba(142, 149, 146, 0.6)',
      xl: 'rgba(142, 149, 146, 0.8)',
    },
/**** ><> ↑ --------- Defining the 'highlight' object with color properties ->  */
    styles: {
      sidebar: {
        highlight: {
          default: 'rgb(88, 110, 117)',
        },
      },
/**** ><> ↑ --------- Defining the 'theme' object with various nested objects ->  */
    },
/**** ><> ↑ --------- Defining the 'styles' object ->  */
  },
};
/**** ><> ↑ --------- Closing the 'theme' object and default exported object ->  */
