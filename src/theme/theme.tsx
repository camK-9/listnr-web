'use client';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '600', '700'] });

const themeOptions: ThemeOptions = {
palette: {
    mode: 'dark',
    primary: {
      main: '#7F56D9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06B6D4',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981',
    },
    error: {
      main: '#F43F5E',
    },
    background: {
      default: '#15151A',
      paper: '#23232E',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9CA3AF',
      disabled: '#6B7280',
    },
    action: {
      hover: '#F43F5E',
    },
  },
  typography: {
    fontFamily: jakarta.style.fontFamily,
    h1: {
      fontSize: '32px',
      fontWeight: 700,
      fontFamily: inter.style.fontFamily,
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      fontFamily: inter.style.fontFamily,
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '16px',
      fontWeight: 700,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
    },
    overline: {
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#23232E', 
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;