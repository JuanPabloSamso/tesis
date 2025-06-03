import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { getProducts } from '../api';
import ProductCard  from './ProductCard';
import SkeletonCard from './SkeletonCard';

export default function ProductList({ addToCart, search = '', category = '' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((all) => {
        let filtered = all;

        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(q)
          );
        }

        if (category) {
          filtered = filtered.filter(
            (p) =>
              (p.category_rel?.category || '').toLowerCase() ===
              category.toLowerCase()
          );
        }

        setProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, [search, category]);

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ pb: 6 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
            <SkeletonCard />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!products.length) {
    return (
      <Typography sx={{ py: 6, textAlign: 'center' }}>
        Sin resultados
      </Typography>
    );
  }

  return (
    <Grid container spacing={3} sx={{ pb: 6 }}>
      {products.map((p) => (
        <Grid key={p.ean} item xs={12} sm={6} md={4} lg={3}>
          <ProductCard product={p} add={addToCart} />
        </Grid>
      ))}
    </Grid>
  );
}
