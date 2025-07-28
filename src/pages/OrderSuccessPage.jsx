// src/pages/OrderSuccessPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { apiService } from '../api/apiService';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.getOrderDetails(orderId);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load order details. Please check your orders in your profile.');
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return <LoadingMessage>Loading order details...</LoadingMessage>;
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <ButtonsContainer>
            <StyledLink to="/profile/orders">View My Orders</StyledLink>
            <StyledLink to="/" primary>
              Continue Shopping
            </StyledLink>
          </ButtonsContainer>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SuccessCard>
        <IconContainer>
          <CheckCircleIcon style={{ fontSize: 64, color: '#4CAF50' }} />
        </IconContainer>
        
        <SuccessTitle>Order Placed Successfully!</SuccessTitle>
        
        <OrderInfo>
          <OrderInfoItem>
            <OrderInfoLabel>Order ID:</OrderInfoLabel>
            <OrderInfoValue>{orderId}</OrderInfoValue>
          </OrderInfoItem>
          
          {order && (
            <>
              <OrderInfoItem>
                <OrderInfoLabel>Order Date:</OrderInfoLabel>
                <OrderInfoValue>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </OrderInfoValue>
              </OrderInfoItem>
              
              <OrderInfoItem>
                <OrderInfoLabel>Total Amount:</OrderInfoLabel>
                <OrderInfoValue>₹{order.total}</OrderInfoValue>
              </OrderInfoItem>
              
              <OrderInfoItem>
                <OrderInfoLabel>Payment Method:</OrderInfoLabel>
                <OrderInfoValue>
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </OrderInfoValue>
              </OrderInfoItem>
              
              <OrderInfoItem>
                <OrderInfoLabel>Delivery Address:</OrderInfoLabel>
                <OrderInfoValue>
                  {order.address?.addressLine1}, 
                  {order.address?.addressLine2 && `${order.address.addressLine2}, `}
                  {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                </OrderInfoValue>
              </OrderInfoItem>
            </>
          )}
        </OrderInfo>
        
        <ThankYouMessage>
          Thank you for shopping with Vruksha! We'll send you an email confirmation shortly.
        </ThankYouMessage>
        
        <ButtonsContainer>
          <StyledLink to="/profile/orders">View My Orders</StyledLink>
          <StyledLink to="/" primary>
            Continue Shopping
          </StyledLink>
        </ButtonsContainer>
      </SuccessCard>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SuccessCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const IconContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1.5rem;
`;

const OrderInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
`;

const OrderInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    align-items: flex-start;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const OrderInfoLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 150px;
    margin-bottom: 0;
  }
`;

const OrderInfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  flex: 1;
`;

const ThankYouMessage = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    justify-content: center;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
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
  padding: 3rem 1rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => `${theme.colors.error}10`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: 1.5rem;
`;

export default OrderSuccessPage;