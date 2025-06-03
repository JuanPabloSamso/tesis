import { useState } from 'react';
import { Box, Button, Container, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { quoteCart } from '../api';

export default function Cart({ cart }) {
  const [quote, setQuote] = useState(null);

  const handleQuote = () => {
    const items = cart.map((c) => ({ product_id: c.id, quantity: c.qty }));
    quoteCart(items).then(setQuote);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>Carrito</Typography>
      <Button variant="contained" onClick={handleQuote} disabled={!cart.length}>
        Cotizar en supermercados
      </Button>

      {quote && (
        <Box mt={4}>
          <Typography variant="h6">Resultados</Typography>
          <Table>
            <TableBody>
              {quote.markets.map((m) => (
                <TableRow key={m.supermarket}>
                  <TableCell>{m.supermarket}</TableCell>
                  <TableCell>
                    {m.total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                  </TableCell>
                  <TableCell>
                    {m.all_available ? '✔ Disponible' : '✖ Faltantes'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Container>
  );
}
