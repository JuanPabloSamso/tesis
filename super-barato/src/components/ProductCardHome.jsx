import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box
  } from '@mui/material';
  import noImage from '../assets/no-image.png';   // ← placeholder
  
  export default function ProductCardHome({ product, addToCart }) {
    const [brand, ...rest] = product.name.split(' ');
  
    const cheapest = product.prices.reduce(
      (m, p) => (Number(p.price) < Number(m.price) ? p : m),
      product.prices[0]
    );
  
    return (
      <Card sx={{ maxWidth: 260, m: '0 auto', display: 'flex', flexDirection: 'column' }}>
        {/* placeholder fijo */}
        <Box
          component="img"
          src={noImage}
          alt="Imagen no disponible"
          sx={{ width: '100%', objectFit: 'cover' }}
        />
  
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {brand.toUpperCase()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {rest.join(' ')}
          </Typography>
  
          <Typography variant="h6" sx={{ fontWeight: 700 }} color="primary">
            {Number(cheapest.price).toLocaleString('es-AR', {
              style: 'currency',
              currency: 'ARS'
            })}
          </Typography>
        </CardContent>
  
        <CardActions>
          <Button fullWidth variant="contained" color="secondary" onClick={() => addToCart(product)}>
            Agregar al carrito
          </Button>
        </CardActions>
      </Card>
    );
  }
  