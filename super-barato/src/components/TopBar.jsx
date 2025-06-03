import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../api';

export default function TopBar() {
  const navigate = useNavigate();

  /* estado para el menú */
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen  = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  /* categorías traídas del backend (caché en api.js) */
  const [cats, setCats] = useState([]);
  useEffect(() => {
    getCategories().then(setCats);
  }, []);

  /* click en una categoría */
  const goCategory = (cat) => {
    handleClose();
    navigate(`/category/${encodeURIComponent(cat)}`);
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        {/* icono menú + texto */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleOpen}
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={handleOpen}
        >
          Categorías
        </Typography>

        {/* resto de la barra: logo, búsqueda, etc. */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, ml: 4, fontWeight: 700, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Baratc
        </Typography>

        {/* … (botones Mi cuenta / carrito que ya tengas) */}
      </Toolbar>

      {/* menú desplegable */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted
      >
        {cats.map((cat) => (
          <MenuItem key={cat} onClick={() => goCategory(cat)}>
            {cat}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}
