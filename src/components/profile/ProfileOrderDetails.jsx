// src/components/profile/ProfileOrderDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { apiService } from '../../api/apiService';

const ProfileOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrderDetails(orderId);
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load order details. Please try again.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  if (loading) {
    return <LoadingMessage>Loading order details...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!order) {
    return <ErrorMessage>Order not found.</ErrorMessage>;
  }

  return (
    <Container>
      <Header>
        <BackLink to="/profile/orders">
          <ArrowBackIcon fontSize="small" />
          <span>Back to Orders</span>
        </BackLink>
        <OrderId>Order #{orderId}</OrderId>
      </Header>

      <OrderStatusBar>
        <OrderStatusInfo>
          <OrderDate>Placed on {formatDate(order.createdAt)}</OrderDate>
          <OrderStatus color={getStatusColor(order.status)}>
            {order.status}
          </OrderStatus>
        </OrderStatusInfo>
        
        {order.estimatedDelivery && (
          <EstimatedDelivery>
            Estimated Delivery: {formatDate(order.estimatedDelivery)}
          </EstimatedDelivery>
        )}
      </OrderStatusBar>

      <Section>
        <SectionTitle>Items</SectionTitle>
        <OrderItems>
          {order.items.map(item => (
            <OrderItem key={item.id}>
              <OrderItemImage>
                <img 
                  src={item.product.images?.[0] || 'https://via.placeholder.com/60'} 
                  alt={item.product.name} 
                />
              </OrderItemImage>
              
              <OrderItemDetails>
                <OrderItemName>{item.product.name}</OrderItemName>
                <OrderItemVariation>{item.variation.quantity}</OrderItemVariation>
                <OrderItemPrice>
                  ₹{item.variation.price} × {item.quantity}
                </OrderItemPrice>
              </OrderItemDetails>
              
              <OrderItemTotal>
                ₹{item.variation.price * item.quantity}
              </OrderItemTotal>
            </OrderItem>
          ))}
        </OrderItems>
      </Section>

      <TwoColumnSection>
        <Section>
          <SectionTitle>Shipping Address</SectionTitle>
          <AddressCard>
            <AddressName>{order.address?.name}</AddressName>
            <AddressText>
              {order.address?.addressLine1}, 
              {order.address?.addressLine2 && `${order.address.addressLine2}, `}
              {order.address?.city}, {order.address?.state} - {order.address?.pincode}
            </AddressText>
            <AddressPhone>Phone: {order.address?.phone}</AddressPhone>
          </AddressCard>
        </Section>

        <Section>
          <SectionTitle>Payment Information</SectionTitle>
          <PaymentCard>
            <PaymentMethod>
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </PaymentMethod>
            <PaymentStatus>
              {order.paymentStatus || 'Pending'}
            </PaymentStatus>
          </PaymentCard>
        </Section>
      </TwoColumnSection>

      <Section>
        <SectionTitle>Order Summary</SectionTitle>
        <OrderSummary>
          <SummaryRow>
            <SummaryLabel>Subtotal</SummaryLabel>
            <SummaryValue>₹{order.subtotal || order.total}</SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>Shipping</SummaryLabel>
            <SummaryValue>₹{order.shippingCost || 0}</SummaryValue>
          </SummaryRow>
          
          {order.discount > 0 && (
            <SummaryRow>
              <SummaryLabel>Discount</SummaryLabel>
              <SummaryValue>-₹{order.discount}</SummaryValue>
            </SummaryRow>
          )}
          
          <SummaryDivider />
          
          <SummaryRow total>
            <SummaryLabel>Total</SummaryLabel>
            <SummaryValue>₹{order.total}</SummaryValue>
          </SummaryRow>
        </OrderSummary>
      </Section>

      {order.status === 'Delivered' && (
        <ActionButtons>
          <ActionButton primary>
            Download Invoice
          </ActionButton>
          <ActionButton>
            Need Help?
          </ActionButton>
        </ActionButtons>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-size: 0.9rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const OrderId = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const OrderStatusBar = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const OrderStatusInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const OrderDate = styled.div`
  font-size: 0.9rem;
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

const EstimatedDelivery = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

const Section = styled.section`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1rem;
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const OrderItemImage = styled.div`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  background-color: #f9f9f9;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const OrderItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OrderItemName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
`;

const OrderItemVariation = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const OrderItemPrice = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const OrderItemTotal = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  align-self: center;
`;

const TwoColumnSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    
    > ${Section} {
      flex: 1;
    }
  }
`;

const AddressCard = styled.div`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 1rem;
`;

const AddressName = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const AddressText = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const AddressPhone = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const PaymentCard = styled.div`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 1rem;
`;

const PaymentMethod = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const PaymentStatus = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const OrderSummary = styled.div`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: ${props => props.total ? '1.1rem' : '0.95rem'};
  font-weight: ${props => props.total ? '600' : '400'};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SummaryValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SummaryDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 1rem 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${({ primary, theme }) => 
    primary ? theme.colors.primary : 'transparent'};
  color: ${({ primary, theme }) => 
    primary ? 'white' : theme.colors.primary};
  border: 1px solid ${({ primary, theme }) => 
    primary ? 'transparent' : theme.colors.primary};
  
  &:hover {
    background-color: ${({ primary, theme }) => 
      primary ? theme.colors.primaryDark : `${theme.colors.primary}10`};
  }
`;

const LoadingMessage = styled.div`
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

export default ProfileOrderDetails;