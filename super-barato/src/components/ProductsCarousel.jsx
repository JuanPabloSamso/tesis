// src/components/ProductsCarousel.jsx
import Slider from 'react-slick';
import ResultCard from './ResultCard';
import { Box } from '@mui/material';

export default function ProductsCarousel({ products, addToCart }) {
  /* mostramos hasta 20 resultados, 4 por slide en desktop */
  const data = products.slice(0, 20);

  const settings = {
    dots: true,
    infinite: false,
    speed: 400,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 900,  settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 600,  settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Slider {...settings}>
        {data.map((p) => (
          <ResultCard key={p.ean} product={p} add={addToCart} />
        ))}
      </Slider>
    </Box>
  );
}
