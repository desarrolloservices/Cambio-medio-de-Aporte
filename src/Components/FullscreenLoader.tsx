// components/FullscreenLoader.tsx
import { Box, CircularProgress, Typography } from '@mui/material';

const FullscreenLoader = ({ message = "Cargando..." }: { message?: string }) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1300,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(2px)',
    }}
  >
    <CircularProgress color="primary" />
    <Typography variant="h6" mt={2}>
      {message}
    </Typography>
  </Box>
);

export default FullscreenLoader;
