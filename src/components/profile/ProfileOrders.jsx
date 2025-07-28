// src/components/profile/ProfileOrders.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '../../api/apiService';

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#4CAF50'; // Green
      case 'processing':
        return '#2196F3'; // Blue
      case 'shipped':
        return '#FF9800'; // Orange
      case 'cancelled':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container>
      <SectionTitle>My Orders</SectionTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingMessage>Loading orders...</LoadingMessage>
      ) : orders.length === 0 ? (
        <EmptyMessage>You haven't placed any orders yet.</EmptyMessage>
      ) : (
        <OrdersList>
          {orders.map(order => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderInfo>
                  <OrderId>Order #{order.id}</OrderId>
                  <OrderDate>Placed on {formatDate(order.createdAt)}</OrderDate>
                </OrderInfo>
                <OrderStatus color={getStatusColor(order.status)}>
                  {order.status}
                </OrderStatus>
              </OrderHeader>
              
              <OrderItems>
                {order.items.slice(0, 3).map(item => (
                  <OrderItem key={item.id}>
                    <OrderItemImage>
                      <img 
                        src={item.product.images?.[0] || 'https://via.placeholder.com/60'} 
                        alt={item.product.name} 
                      />
                    </OrderItemImage>
                    <OrderItemName>{item.product.name}</OrderItemName>
                    <OrderItemQuantity>x{item.quantity}</OrderItemQuantity>
                  </OrderItem>
                ))}
                
                {order.items.length > 3 && (
                  <MoreItems>+{order.items.length - 3} more items</MoreItems>
                )}
              </OrderItems>
              
              <OrderFooter>
                <OrderTotal>Total: ₹{order.total}</OrderTotal>
                <ViewDetailsButton to={`/profile/orders/${order.id}`}>
                  View Details
                </ViewDetailsButton>
              </OrderFooter>
            </OrderCard>
          ))}
        </OrdersList>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1.5rem;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const OrderCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OrderId = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
`;

const OrderDate = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const OrderStatus = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ color }) => color};
  background-color: ${({ color }) => `${color}10`};
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const OrderItems = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const OrderItemImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  background-color: #f9f9f9;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const OrderItemName = styled.div`
  flex: 1;
  font-size: 0.9rem;
`;

const OrderItemQuantity = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MoreItems = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  margin-top: 0.25rem;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`;

const OrderTotal = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ViewDetailsButton = styled(Link)`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}10`};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background-color: ${({ theme }) => `${theme.colors.error}10`};
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: 1rem;
`;

export default ProfileOrders;