// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../context/AuthContext';
import useResponsive from '../hooks/useResponsive';
import { apiService } from '../api/apiService';

// Profile sub-pages
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileAddresses from '../components/profile/ProfileAddresses';
import ProfileOrders from '../components/profile/ProfileOrders';
import ProfileOrderDetails from '../components/profile/ProfileOrderDetails';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { section, id } = useParams();
  const { isMobile } = useResponsive();
  const [activeSection, setActiveSection] = useState('info');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Set active section based on URL params
    if (section) {
      setActiveSection(section);
    }
  }, [user, navigate, section]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'info', label: 'Personal Information', icon: <PersonIcon /> },
    { id: 'addresses', label: 'Addresses', icon: <LocationOnIcon /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBagIcon /> },
  ];

  return (
    <PageContainer>
      <PageTitle>My Profile</PageTitle>

      <ProfileContainer>
        <ProfileSidebar>
          <ProfileMenu>
            {menuItems.map((item) => (
              <ProfileMenuItem
                key={item.id}
                active={activeSection === item.id}
                onClick={() => navigate(`/profile/${item.id}`)}
              >
                <MenuItemIcon>{item.icon}</MenuItemIcon>
                <MenuItemLabel>{item.label}</MenuItemLabel>
              </ProfileMenuItem>
            ))}

            <ProfileMenuItem onClick={handleLogout}>
              <MenuItemIcon>
                <ExitToAppIcon />
              </MenuItemIcon>
              <MenuItemLabel>Logout</MenuItemLabel>
            </ProfileMenuItem>
          </ProfileMenu>
        </ProfileSidebar>

        <ProfileContent>
          <Routes>
            <Route path="info" element={<ProfileInfo />} />
            <Route path="addresses" element={<ProfileAddresses />} />
            <Route path="orders" element={<ProfileOrders />} />
            <Route path="orders/:orderId" element={<ProfileOrderDetails />} />
            <Route path="*" element={<ProfileInfo />} />
          </Routes>
        </ProfileContent>
      </ProfileContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1.5rem;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const ProfileSidebar = styled.div`
  width: 100%;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  overflow: hidden;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 250px;
    position: sticky;
    top: 100px;
  }
`;

const ProfileMenu = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ active, theme }) => 
    active ? `${theme.colors.primary}10` : 'transparent'};
  border-left: 3px solid ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? `${theme.colors.primary}10` : theme.colors.background};
  }
`;

const MenuItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const MenuItemLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ProfileContent = styled.div`
  flex: 1;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: 1.5rem;
  min-height: 500px;
`;

export default ProfilePage;