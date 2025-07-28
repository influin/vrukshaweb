// src/pages/CartPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { CircularProgress } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import useResponsive from '../hooks/useResponsive';

const CartPage = () => {
  // Add this after the cart is destructured from useCart()
  const { cart, loading, error, updateQuantity, removeItem } = useCart();
  // Add this line to debug
  useEffect(() => {
    console.log('Cart data:', cart);
  }, [cart]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [processingItems, setProcessingItems] = useState({});
  const [animateRemove, setAnimateRemove] = useState(null);

  const handleQuantityChange = async (itemId, currentQty, change) => {
    const newQty = Math.max(1, currentQty + change);
    if (newQty === currentQty) return;
    
    setProcessingItems(prev => ({ ...prev, [itemId]: true }));
    try {
      await updateQuantity(itemId, newQty);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setProcessingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!itemId) {
      console.error('Cannot remove item: itemId is undefined');
      return;
    }
    
    console.log('Attempting to remove item:', itemId);
    setAnimateRemove(itemId);
    
    // Wait for animation to complete
    setTimeout(async () => {
      setProcessingItems(prev => ({ ...prev, [itemId]: true }));
      try {
        await removeItem(itemId);
        console.log('Item successfully removed:', itemId);
      } catch (error) {
        console.error('Failed to remove item:', error);
        // Reset animation if removal fails
        setAnimateRemove(null);
      } finally {
        setProcessingItems(prev => ({ ...prev, [itemId]: false }));
      }
    }, 300);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (loading && !cart.items.length) {
    return (
      <LoadingContainer>
        <CircularProgress size={40} style={{ color: '#53B175' }} />
        <LoadingMessage>Loading your cart...</LoadingMessage>
      </LoadingContainer>
    );
  }

  if (error && !cart.items.length) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <PageContainer>
        <EmptyCartContainer>
          <EmptyCartIconWrapper>
            <ShoppingCartIcon style={{ fontSize: 60, color: '#53B175', opacity: 0.7 }} />
          </EmptyCartIconWrapper>
          <EmptyCartTitle>Your cart is empty</EmptyCartTitle>
          <EmptyCartMessage>
            Looks like you haven't added any products to your cart yet.
          </EmptyCartMessage>
          <ShopNowButton to="/">
            <ShoppingBagOutlinedIcon style={{ marginRight: '8px' }} />
            Shop Now
          </ShopNowButton>
        </EmptyCartContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon fontSize="small" />
        </BackButton>
        <PageTitle>Your Cart</PageTitle>
        <CartItemCount>{cart.items.length} items</CartItemCount>
      </PageHeader>
      
      <CartContainer>
        <CartItemsContainer>
          {cart.items.map((item) => (
            <CartItem 
              key={item._id} 
              $isRemoving={animateRemove === item._id}
            >
              <CartItemImage>
                <img 
                  src={item.product.images?.[0] || 'https://via.placeholder.com/80'} 
                  alt={item.product.name} 
                />
              </CartItemImage>
              
              <CartItemDetails>
                <CartItemName to={`/product/${item.product.id}`}>
                  {item.product.name}
                </CartItemName>
                
                <CartItemVariation>
                  {item.variation.quantity}
                </CartItemVariation>
                
                <CartItemPrice>₹{item.variation.price}</CartItemPrice>
                
                <CartItemActions>
                  <QuantityControls>
                    <QuantityButton 
                      onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                      disabled={item.quantity <= 1 || processingItems[item._id]}
                    >
                      <RemoveIcon fontSize="small" />
                    </QuantityButton>
                    
                    <QuantityValue>
                      {processingItems[item._id] ? 
                        <CircularProgress size={16} style={{ color: '#53B175' }} /> : 
                        item.quantity
                      }
                    </QuantityValue>
                    
                    <QuantityButton 
                      onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                      disabled={processingItems[item._id]}
                    >
                      <AddIcon fontSize="small" />
                    </QuantityButton>
                  </QuantityControls>
                  
                  <RemoveButton 
                    onClick={() => handleRemoveItem(item._id)}
                    disabled={processingItems[item._id]}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </RemoveButton>
                </CartItemActions>
              </CartItemDetails>
              
              <ItemTotal>
                ₹{(item.variation.price * item.quantity).toFixed(2)}
              </ItemTotal>
            </CartItem>
          ))}
        </CartItemsContainer>
        
        <CartSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          
          <SummaryRow>
            <SummaryLabel>Subtotal</SummaryLabel>
            <SummaryValue>₹{cart.total.toFixed(2)}</SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>Delivery</SummaryLabel>
            <DeliveryValue>
              <LocalShippingOutlinedIcon style={{ fontSize: 16, marginRight: 4 }} />
              Free
            </DeliveryValue>
          </SummaryRow>
          
          <SummaryDivider />
          
          <SummaryRow total>
            <SummaryLabel>Total</SummaryLabel>
            <SummaryValue total>₹{cart.total.toFixed(2)}</SummaryValue>
          </SummaryRow>
          
          <CheckoutButton onClick={handleCheckout}>
            Proceed to Checkout
          </CheckoutButton>
          
          <ContinueShoppingLink to="/">
            <ArrowBackIosNewIcon style={{ fontSize: 12, marginRight: 4 }} />
            Continue Shopping
          </ContinueShoppingLink>
        </CartSummary>
      </CartContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  background-color: #FCFCFC;
  min-height: calc(100vh - 120px);
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #181725;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #181725;
  margin: 0 auto 0 1rem;
`;

const CartItemCount = styled.span`
  font-size: 0.9rem;
  color: #7C7C7C;
  font-weight: 500;
`;

const CartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const CartItemsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartItem = styled.div`
  display: flex;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  gap: 1rem;
  position: relative;
  transition: all 0.3s ease;
  transform: ${props => props.$isRemoving ? 'translateX(100%)' : 'translateX(0)'} scale(${props => props.$isRemoving ? '0.8' : '1'});
  opacity: ${props => props.$isRemoving ? '0' : '1'};
`;

const CartItemImage = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const CartItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CartItemName = styled(Link)`
  font-size: 1rem;
  font-weight: 600;
  color: #181725;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #53B175;
  }
`;

const CartItemVariation = styled.div`
  font-size: 0.85rem;
  color: #7C7C7C;
`;

const CartItemPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #53B175;
`;

const ItemTotal = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #181725;
`;

const CartItemActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #F3F5F7;
  border-radius: 8px;
  padding: 0.25rem;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  background-color: ${props => props.disabled ? '#F3F5F7' : 'white'};
  color: ${props => props.disabled ? '#B1B1B1' : '#181725'};
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  box-shadow: ${props => props.disabled ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  
  &:hover:not(:disabled) {
    background-color: #53B175;
    color: white;
  }
`;

const QuantityValue = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #7C7C7C;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    color: #F3603F;
    background-color: rgba(243, 96, 63, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CartSummary = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  
  @media (min-width: 768px) {
    width: 350px;
    position: sticky;
    top: 100px;
  }
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #181725;
  margin: 0 0 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed #E2E2E2;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: ${props => props.total ? '1.1rem' : '0.95rem'};
  font-weight: ${props => props.total ? '600' : '400'};
  padding: ${props => props.total ? '0.5rem 0' : '0'};
`;

const SummaryLabel = styled.span`
  color: #181725;
`;

const SummaryValue = styled.span`
  color: ${props => props.total ? '#53B175' : '#181725'};
  font-weight: ${props => props.total ? '700' : '500'};
  font-size: ${props => props.total ? '1.2rem' : 'inherit'};
`;

const DeliveryValue = styled.span`
  color: #53B175;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const SummaryDivider = styled.hr`
  border: none;
  border-top: 1px solid #E2E2E2;
  margin: 1rem 0;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background-color: #53B175;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(83, 177, 117, 0.3);
  
  &:hover {
    background-color: #429660;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(83, 177, 117, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(83, 177, 117, 0.3);
  }
`;

const ContinueShoppingLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 1rem;
  color: #53B175;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const EmptyCartIconWrapper = styled.div`
  background-color: rgba(83, 177, 117, 0.1);
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const EmptyCartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #181725;
  margin: 0 0 0.5rem;
`;

const EmptyCartMessage = styled.p`
  font-size: 1rem;
  color: #7C7C7C;
  margin: 0 0 1.5rem;
  max-width: 400px;
`;

const ShopNowButton = styled(Link)`
  background-color: #53B175;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 8px rgba(83, 177, 117, 0.3);
  
  &:hover {
    background-color: #429660;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(83, 177, 117, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(83, 177, 117, 0.3);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #7C7C7C;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.2rem;
  color: #F3603F;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin: 2rem auto;
  max-width: 600px;
`;

export default CartPage;