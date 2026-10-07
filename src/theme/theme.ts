import { createTheme } from '@mui/material/styles';

import { fonts, tokens } from './tokens';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: tokens.gold, contrastText: tokens.bg },
    success: { main: tokens.green },
    error: { main: tokens.red },
    info: { main: tokens.blue },
    background: { default: tokens.bg, paper: tokens.surface },
    text: { primary: tokens.text, secondary: tokens.text2, disabled: tokens.text3 },
    divider: tokens.border,
  },
  shape: { borderRadius: tokens.radius },
  typography: {
    fontFamily: fonts.body,
    h1: { fontFamily: fonts.serif },
    h2: { fontFamily: fonts.serif },
    h3: { fontFamily: fonts.serif },
    h4: { fontFamily: fonts.serif },
    h5: { fontFamily: fonts.serif },
    h6: { fontFamily: fonts.serif },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: tokens.bg, color: tokens.text },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none', border: `1px solid ${tokens.border}` } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: tokens.surface2 },
        notchedOutline: { borderColor: tokens.border },
        // iOS zooms the page when focusing an input under 16px.
        input: { fontSize: 16 },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontSize: 16 } },
    },
  },
});
