import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {                
        "&:not($sizeLarge):not($sizeSmall)not($sizeGiant) $label": {
          fontSize: 16,
          fontFamily: 'proxima-nova'
        }
      },
      sizeLarge: {
        "& $label": {
          fontSize: 28,
          fontFamily: 'proxima-nova'
        }
      },
      sizeGiant: {
        "& $label": {
          fontSize: 44,
          fontFamily: 'proxima-nova',
          margin: '5%'
        }
      },
      sizeSmall: {
        "& $label": {
          fontSize: 12,
          fontFamily: 'proxima-nova',
          padding: '0px'
        }
      }
    }
  },
  palette: {
    lightorange : '#F8C463',
    primary: {
      light: '#F8C463',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },

  typography: {
    button: {
      textTransform: 'none'
    },
    menu : {
      fontSize: 22
    },
    chat : {
      fontSize: 16
    },
  },
});

export default theme