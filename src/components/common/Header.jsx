// src/components/common/Header.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import useResponsive from '../../hooks/useResponsive';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer>
          <Link to="/">
            <Logo>
              <LogoText>Vruksha</LogoText>
              <LogoTagline>Organic & Fresh</LogoTagline>
            </Logo>
          </Link>
        </LogoContainer>

        {isMobile ? (
          <MobileMenuButton onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </MobileMenuButton>
        ) : (
          <NavContainer>
            <NavLinks>
              <NavItem>
                <Link to="/">Home</Link>
              </NavItem>
              <NavItem>
                <Link to="/">Shop</Link>
              </NavItem>
              <NavItem>
                <Link to="/cart">
                  <CartIconWrapper>
                    <ShoppingCartIcon />
                    {cart.items.length > 0 && (
                      <CartBadge>{cart.items.length}</CartBadge>
                    )}
                  </CartIconWrapper>
                  <CartText>Cart</CartText>
                </Link>
              </NavItem>
              {user ? (
                <>
                  <NavItem>
                    <Link to="/profile">
                      <ProfileIconWrapper>
                        <PersonIcon />
                        <ProfileText>Account</ProfileText>
                      </ProfileIconWrapper>
                    </Link>
                  </NavItem>
                  <NavItem>
                    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                  </NavItem>
                </>
              ) : (
                <>
                  <NavItem>
                    <Link to="/login">Login</Link>
                  </NavItem>
                  <NavItem>
                    <Link to="/signup">Sign Up</Link>
                  </NavItem>
                </>
              )}
            </NavLinks>
          </NavContainer>
        )}

        {isMobile && mobileMenuOpen && (
          <MobileMenu>
            <MobileNavLinks>
              <MobileNavItem>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </MobileNavItem>
              <MobileNavItem>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  Shop
                </Link>
              </MobileNavItem>
              <MobileNavItem>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                  Cart {cart.items.length > 0 && `(${cart.items.length})`}
                </Link>
              </MobileNavItem>
              {user ? (
                <>
                  <MobileNavItem>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      Profile
                    </Link>
                  </MobileNavItem>
                  <MobileNavItem>
                    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                  </MobileNavItem>
                </>
              ) : (
                <>
                  <MobileNavItem>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </MobileNavItem>
                  <MobileNavItem>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </MobileNavItem>
                </>
              )}
            </MobileNavLinks>
          </MobileMenu>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background-color: white;
  color: ${({ theme }) => theme.colors.textDark};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderGrey};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: 0 auto;
  position: relative;
`;

const LogoContainer = styled.div`
  flex: 1;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoText = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryGreen};
`;

const LogoTagline = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textGrey};
`;

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-left: 1.5rem;
  
  a {
    color: ${({ theme }) => theme.colors.textDark};
    text-decoration: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryGreen};
    }
  }
`;

const CartIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 5px;
`;

const ProfileIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CartText = styled.span`
  margin-left: 4px;
`;

const ProfileText = styled.span`
  margin-left: 4px;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${({ theme }) => theme.colors.primaryGreen};
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textDark};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryGreen};
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textDark};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border-top: 1px solid ${({ theme }) => theme.colors.borderGrey};
`;

const MobileNavLinks = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MobileNavItem = styled.li`
  margin: 1rem 0;
  
  a {
    color: ${({ theme }) => theme.colors.textDark};
    text-decoration: none;
    font-weight: 500;
    display: block;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryGreen};
    }
  }
`;

export default Header;