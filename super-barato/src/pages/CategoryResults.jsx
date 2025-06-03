import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getProducts } from '../api';
import ProductsCarousel from '../components/ProductsCarousel';

export default function CategoryResults({ addToCart }) {
  const { category } = useParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    getProducts({ category })
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!products.length) {
    return (
      <Typography sx={{ py: 6, textAlign: 'center' }}>
        No se encontraron productos para “{category}”
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h5" sx={{ my: 3, textAlign: 'center' }}>
        {category}
      </Typography>
      <ProductsCarousel products={products} addToCart={addToCart} />
    </>
  );
}
