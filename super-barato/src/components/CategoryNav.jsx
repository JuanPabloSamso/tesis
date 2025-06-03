import { useEffect, useState } from 'react';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCategories } from '../api';

export default function CategoryNav() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();

  const [cats, setCats]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCats)
      .finally(() => setLoading(false));
  }, []);

  const current = pathname.startsWith('/category/')
    ? decodeURIComponent(pathname.split('/').pop())
    : '';

  const handleChange = (_e, value) => {
    navigate(value ? `/category/${encodeURIComponent(value)}` : '/');
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
      <Tabs
        value={current}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="secondary"
        textColor="secondary"
        sx={{ px: { xs: 1, sm: 3 } }}
      >
        <Tab value="" label="Inicio" />
        {loading ? (
          <CircularProgress size={22} sx={{ mx: 2 }} />
        ) : (
          cats.map((c) => <Tab key={c} value={c} label={c} />)
        )}
      </Tabs>
    </Box>
  );
}
