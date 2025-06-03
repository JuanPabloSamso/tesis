import { useState } from 'react';
import {
  Card, CardHeader, CardContent, CardActions,
  Button, Table, TableBody, TableRow, TableCell,
  Typography, Icon, Snackbar, Box
} from '@mui/material';

export default function ProductCard({ product, add }) {
  const [open, setOpen] = useState(false);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={<Typography variant="subtitle2">{product.name}</Typography>}
        subheader={product.ean ? `EAN: ${product.ean}` : null}
        sx={{ pb: 0 }}
      />

      <CardContent sx={{ flex: 1 }}>
        {/* Placeholder image */}
        <Box
          component="img"
          src={`https://picsum.photos/seed/${product.ean}/320/180`}
          sx={{ width: '100%', height: 120, objectFit: 'cover', mb: 1 }}
        />

        <Table size="small">
          <TableBody>
            {product.prices.map((p) => (
              <TableRow key={p.supermarket}>
                <TableCell>{p.supermarket}</TableCell>
                <TableCell>
                  {p.price.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS'
                  })}
                </TableCell>
                <TableCell align="right">
                  <Icon color="primary">check</Icon>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardActions>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            add(product);
            setOpen(true);
          }}
        >
          Agregar al carrito
        </Button>
        <Snackbar
          open={open}
          autoHideDuration={1800}
          onClose={() => setOpen(false)}
          message="Añadido al carrito"
        />
      </CardActions>
    </Card>
  );
}
