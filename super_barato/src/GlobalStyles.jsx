import { GlobalStyles as MUIGlobalStyles } from '@mui/material';

export default function Global() {
  return (
    <MUIGlobalStyles
      styles={{
        body: { backgroundColor: '#f5f7fa' },
        '.slick-dots li button:before': { color: '#0096C7' }
      }}
    />
  );
}
