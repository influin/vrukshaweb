// src/styles/theme.js
export const theme = {
  colors: {
    primaryGreen: '#53B175',
    darkGreen: '#0B2512',
    lightGreen: '#E8F5E8',
    orange: '#F3603F',
    yellow: '#F8A44C',
    pink: '#F7A593',
    purple: '#D3B0E0',
    lightBlue: '#B7DFF5',
    textDark: '#181725',
    textGrey: '#7C7C7C',
    textLight: '#B1B1B1',
    borderGrey: '#E2E2E2',
    backgroundGrey: '#FCFCFC',
    text: {
      primary: '#181725',
      secondary: '#7C7C7C'
    }
  },
  breakpoints: {
    mobile: '650px',
    tablet: '1099px',
    desktop: '1100px'
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '28px',
    xxxxl: '32px'
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '19px'
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)'
  },
  devices: {
    mobile: `(max-width: 650px)`,
    tablet: `(min-width: 650px) and (max-width: 1099px)`,
    desktop: `(min-width: 1100px)`
  }
};