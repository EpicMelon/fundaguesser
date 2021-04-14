import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
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
    fontSize: 22,
    fontFamily: 'proxima-nova'
  },
});

export default theme