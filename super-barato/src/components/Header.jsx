import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  InputBase,
  Badge,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon           from '@mui/icons-material/Menu';
import SearchIcon         from '@mui/icons-material/Search';
import PersonIcon         from '@mui/icons-material/Person';
import ShoppingCartIcon   from '@mui/icons-material/ShoppingCart';
import { useNavigate }    from 'react-router-dom';
import logo from '../assets/logo.svg';

/* ——— estilos reutilizables ——— */
const SearchRoot = styled('div')(({ theme }) => ({
  flexBasis: '40%',
  display: 'flex',
  alignItems: 'center',
  background: '#fff',
  borderRadius: 32,
  border: '2px solid #e0e0e0',
  maxWidth: 650,
  [theme.breakpoints.down('sm')]: {
    flexBasis: '60%'
  }
}));

const SearchInput = styled(InputBase)({
  flex: 1,
  paddingLeft: 16
});

const CategoriesButton = styled(Button)({
  color: '#fff',
  textTransform: 'none',
  fontWeight: 600,
  marginLeft: 4,
  marginRight: 24
});

const AccountButton = styled(Button)({
  color: '#fff',
  textTransform: 'none',
  fontWeight: 500,
  marginLeft: 8,
  marginRight: 24
});

const CartButton = styled(Button)({
  background: '#2EC4B6',
  color: '#fff',
  borderRadius: 0,
  padding: '8px 20px',
  '&:hover': { background: '#27b1a5' }
});

export default function Header({ cartQty = 0 }) {
  const navigate = useNavigate();

  const onSearch = (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      navigate(q ? `/search/${encodeURIComponent(q)}` : '/');
    }
  };

  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar
        sx={{
          bgcolor: 'primary.main',
          minHeight: 64,
          px: { xs: 1.5, md: 3 }
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={logo}
          alt="Super Barato"
          sx={{ width: 110, mr: 2, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />

        {/* Categorías */}
        <IconButton sx={{ color: '#fff' }}>
          <MenuIcon />
        </IconButton>
        <CategoriesButton onClick={() => navigate('/categories')}>
          Categorías
        </CategoriesButton>

        {/* Espaciador para centrar el buscador */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Buscador centrado */}
        <SearchRoot>
          <SearchInput
            placeholder="Buscar..."
            onKeyDown={onSearch}
            inputProps={{ 'aria-label': 'search' }}
          />
          <IconButton>
            <SearchIcon sx={{ color: 'text.secondary' }} />
          </IconButton>
        </SearchRoot>

        {/* Otro espaciador simétrico */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Mi cuenta */}
        <AccountButton
          startIcon={<PersonIcon />}
          onClick={() => navigate('/account')}
        >
          Mi&nbsp;Cuenta
        </AccountButton>

        {/* Carrito */}
        <CartButton onClick={() => navigate('/cart')}>
          <Badge
            color="error"
            overlap="circular"
            badgeContent={cartQty}
            sx={{ mr: 1 }}
          >
            <ShoppingCartIcon />
          </Badge>
          MI&nbsp;CARRITO
        </CartButton>
      </Toolbar>
    </AppBar>
  );
}
