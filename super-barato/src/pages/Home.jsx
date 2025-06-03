import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getProducts } from '../api';
import ProductsCarousel from '../components/ProductsCarousel';
import ProductCardHome from '../components/ProductCardHome';

export default function Home({ addToCart }) {
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    getProducts().then((data) => {
      setCatalog(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!catalog.length) {
    return (
      <Typography sx={{ py: 6, textAlign: 'center' }}>
        No hay productos disponibles por el momento.
      </Typography>
    );
  }

  /* Elegimos los primeros 20 como “destacados” para el carrusel */
  const featured = catalog.slice(0, 20);

  return (
    <>
      {/* Carrusel destacado */}
      <ProductsCarousel
        products={featured}
        addToCart={addToCart}
      />

      {/* Si quieres seguir mostrando la grilla completa,
          coloca otro componente debajo (o bórralo). */}
      {/* <Grid container spacing={3} sx={{ px: 4, pb: 6 }}>
        {catalog.map((p) => (
          <Grid key={p.ean} item xs={12} sm={6} md={4} lg={3}>
            <ProductCardHome product={p} addToCart={addToCart} />
          </Grid>
        ))}
      </Grid> */}
    </>
  );
}
