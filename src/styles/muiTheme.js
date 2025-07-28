import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#53B175',
      contrastText: '#fff'
    },
    secondary: {
      main: '#F3603F',
      contrastText: '#fff'
    },
    background: {
      default: '#fff',
      paper: '#FCFCFC'
    },
    text: {
      primary: '#181725',
      secondary: '#7C7C7C'
    }
  },
  typography: {
    fontFamily: '"Lato", "Helvetica", "Arial", sans-serif'
  }
});