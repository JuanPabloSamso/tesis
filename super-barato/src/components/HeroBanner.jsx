import { Box } from '@mui/material';

export default function HeroBanner() {
  return (
    <Box
      sx={{
        bgcolor: '#0096C7',
        height: { xs: 120, sm: 180, md: 250 },
        borderRadius: 1,
        mt: 2,
        mx: { xs: 1, sm: 2 },
        backgroundImage:
          'url(https://picsum.photos/1200/300?blur=1)', /* sólo placeholder */
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
