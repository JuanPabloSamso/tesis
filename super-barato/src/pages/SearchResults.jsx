import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { searchProducts }   from '../api';
import ResultCard   from '../components/ResultCard';
import SkeletonCard from '../components/SkeletonCard';
import { useParams } from 'react-router-dom';

export default function SearchResults({ addToCart }) {
  const { q } = useParams();          // texto de la ruta /search/:q
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  /* Cada vez que cambia q, vuelve a consultar */
  useEffect(() => {
    let alive = true;
    setLoading(true);

    searchProducts(q).then((data) => {
      if (!alive) return;
      console.log(`[searchResults] "${q}" → ${data.length} productos`, data);
      setResults(Array.isArray(data) ? data : []);
      setLoading(false);
    });

    return () => (alive = false);
  }, [q]);

  /* Loading */
  if (loading) {
    return (
      <Grid container spacing={3} sx={{ py: 4 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
            <SkeletonCard />
          </Grid>
        ))}
      </Grid>
    );
  }

  /* Sin resultados */
  if (!results.length) {
    return (
      <Typography sx={{ py: 6, textAlign: 'center' }}>
        No se encontraron resultados para “{q}”
      </Typography>
    );
  }

  /* Grilla de resultados */
  return (
    <Grid container spacing={3} sx={{ pb: 6 }}>
      {results.map((p) => (
        <Grid key={p.ean} item xs={12} sm={6} md={4} lg={3}>
          <ResultCard product={p} add={addToCart} />
        </Grid>
      ))}
    </Grid>
  );
}
