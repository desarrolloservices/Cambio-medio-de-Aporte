// components/LoadingIndicator.tsx
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingIndicator = ({ message = 'Cargando datos...' }: { message?: string }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    width="100%"
    minHeight={150}
    py={4}
  >
    <CircularProgress color="primary" />
    <Typography variant="body2" mt={2}>
      {message}
    </Typography>
  </Box>
);

export default LoadingIndicator;
