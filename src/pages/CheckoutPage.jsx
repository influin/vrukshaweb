// src/pages/CheckoutPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import useResponsive from '../hooks/useResponsive';
import { apiService } from '../api/apiService';

const CheckoutPage = () => {
  const { cart, loading: cartLoading, error: cartError } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // State for recurring orders
  const [isRecurring, setIsRecurring] = useState(false);
  const [deliveryDays, setDeliveryDays] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [addressFormData, setAddressFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    
    fetchAddresses();
  }, [user, navigate]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAddresses();
      setAddresses(response);
      
      // Select default address if available
      const defaultAddress = response.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      } else if (response.length > 0) {
        setSelectedAddressId(response[0]._id);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load addresses. Please try again.');
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await apiService.addAddress(addressFormData);
      setAddresses(prev => [...prev, response]);
      setSelectedAddressId(response._id);
      setShowAddressForm(false);
      setAddressFormData({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to add address. Please try again.');
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }
    
    // Validate recurring order data if enabled
    if (isRecurring) {
      if (deliveryDays.length === 0) {
        setError('Please select at least one delivery day');
        return;
      }
      if (!startDate) {
        setError('Please select a start date');
        return;
      }
      if (!endDate) {
        setError('Please select an end date');
        return;
      }
      
      if (new Date(endDate) <= new Date(startDate)) {
        setError('End date must be after start date');
        return;
      }
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Format dates as YYYY-MM-DD without time component
      // This is likely what your backend expects
      const formattedStartDate = startDate ? startDate : null;
      const formattedEndDate = endDate ? endDate : null;
      
      const orderData = {
        addressId: selectedAddressId,
        paymentMethod: paymentMethod,
        // Add recurring order data if enabled
        ...(isRecurring && {
          isRecurring: true,
          recurringDetails: {
            deliveryDays: deliveryDays,
            startDate: formattedStartDate,
            endDate: formattedEndDate
          }
        })
      };
      
      console.log('Sending order data:', JSON.stringify(orderData));
      const response = await apiService.placeOrder(orderData);
      console.log('Order response:', response);
      navigate(`/order-success/${response._id}`);
    } catch (err) {
      console.error('Order error:', err);
      setError(`Failed to place order: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading || loading) {
    return <LoadingMessage>Loading checkout...</LoadingMessage>;
  }

  if (cartError || error) {
    return <ErrorMessage>{cartError || error}</ErrorMessage>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <PageContainer>
        <EmptyMessage>Your cart is empty. Please add items to proceed with checkout.</EmptyMessage>
        <BackButton onClick={() => navigate('/')}>Continue Shopping</BackButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Checkout</PageTitle>
      
      <CheckoutContainer>
        <CheckoutMain>
          <Section>
            <SectionTitle>Delivery Address</SectionTitle>
            
            {addresses.length > 0 && (
              <AddressList>
                {addresses.map(address => (
                  <AddressCard 
                    key={address._id}
                    selected={selectedAddressId === address._id}
                    onClick={() => setSelectedAddressId(address._id)}
                  >
                    <RadioInput 
                      type="radio"
                      name="address"
                      checked={selectedAddressId === address._id}
                      onChange={() => setSelectedAddressId(address._id)}
                    />
                    <AddressDetails>
                      <AddressName>{address.name}</AddressName>
                      <AddressText>
                        {address.addressLine1}, 
                        {address.addressLine2 && `${address.addressLine2}, `}
                        {address.city}, {address.state} - {address.pincode}
                      </AddressText>
                      <AddressPhone>Phone: {address.phone}</AddressPhone>
                      {address.isDefault && <DefaultBadge>Default</DefaultBadge>}
                    </AddressDetails>
                  </AddressCard>
                ))}
              </AddressList>
            )}
            
            {showAddressForm ? (
              <AddressForm onSubmit={handleAddressSubmit}>
                <FormRow>
                  <FormGroup>
                    <FormLabel>Full Name</FormLabel>
                    <FormInput 
                      type="text" 
                      name="name" 
                      value={addressFormData.name} 
                      onChange={handleAddressChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Phone Number</FormLabel>
                    <FormInput 
                      type="tel" 
                      name="phone" 
                      value={addressFormData.phone} 
                      onChange={handleAddressChange}
                      required
                    />
                  </FormGroup>
                </FormRow>
                
                <FormGroup>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormInput 
                    type="text" 
                    name="addressLine1" 
                    value={addressFormData.addressLine1} 
                    onChange={handleAddressChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormInput 
                    type="text" 
                    name="addressLine2" 
                    value={addressFormData.addressLine2} 
                    onChange={handleAddressChange}
                  />
                </FormGroup>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>City</FormLabel>
                    <FormInput 
                      type="text" 
                      name="city" 
                      value={addressFormData.city} 
                      onChange={handleAddressChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>State</FormLabel>
                    <FormInput 
                      type="text" 
                      name="state" 
                      value={addressFormData.state} 
                      onChange={handleAddressChange}
                      required
                    />
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>Pincode</FormLabel>
                    <FormInput 
                      type="text" 
                      name="pincode" 
                      value={addressFormData.pincode} 
                      onChange={handleAddressChange}
                      required
                    />
                  </FormGroup>
                </FormRow>
                
                <FormCheckbox>
                  <input 
                    type="checkbox" 
                    name="isDefault" 
                    checked={addressFormData.isDefault} 
                    onChange={handleAddressChange}
                  />
                  <span>Set as default address</span>
                </FormCheckbox>
                
                <FormButtons>
                  <CancelButton type="button" onClick={() => setShowAddressForm(false)}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Address'}
                  </SubmitButton>
                </FormButtons>
              </AddressForm>
            ) : (
              <AddAddressButton onClick={() => setShowAddressForm(true)}>
                + Add New Address
              </AddAddressButton>
            )}
          </Section>
          
          <Section>
            <SectionTitle>Delivery Options</SectionTitle>
            
            <RecurringOrderToggle>
              <ToggleLabel>
                <input 
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <span>Set up recurring order</span>
              </ToggleLabel>
            </RecurringOrderToggle>
            
            {isRecurring && (
              <RecurringOrderOptions>
                <FormGroup>
                  <FormLabel>Select Delivery Days</FormLabel>
                  <DaysSelector>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <DayOption key={day}>
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          checked={deliveryDays.includes(day)}
                          onChange={() => {
                            if (deliveryDays.includes(day)) {
                              setDeliveryDays(deliveryDays.filter(d => d !== day));
                            } else {
                              setDeliveryDays([...deliveryDays, day]);
                            }
                          }}
                        />
                        <label htmlFor={`day-${day}`}>{day.substring(0, 3)}</label>
                      </DayOption>
                    ))}
                  </DaysSelector>
                </FormGroup>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>Start Date</FormLabel>
                    <FormInput
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required={isRecurring}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>End Date</FormLabel>
                    <FormInput
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      required={isRecurring}
                    />
                  </FormGroup>
                </FormRow>
              </RecurringOrderOptions>
            )}
          </Section>
          
          <Section>
            <SectionTitle>Payment Method</SectionTitle>
            
            <PaymentMethodList>
              <PaymentMethodCard 
                selected={paymentMethod === 'cod'}
                onClick={() => setPaymentMethod('cod')}
              >
                <RadioInput 
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <PaymentMethodDetails>
                  <PaymentMethodName>Cash on Delivery</PaymentMethodName>
                  <PaymentMethodDescription>
                    Pay when your order is delivered
                  </PaymentMethodDescription>
                </PaymentMethodDetails>
              </PaymentMethodCard>
              
              <PaymentMethodCard 
                selected={paymentMethod === 'online'}
                onClick={() => setPaymentMethod('online')}
                disabled
              >
                <RadioInput 
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  disabled
                />
                <PaymentMethodDetails>
                  <PaymentMethodName>Online Payment</PaymentMethodName>
                  <PaymentMethodDescription>
                    Coming soon
                  </PaymentMethodDescription>
                </PaymentMethodDetails>
              </PaymentMethodCard>
            </PaymentMethodList>
          </Section>
        </CheckoutMain>
        
        <OrderSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          
          <OrderItems>
            {cart.items && cart.items.map(item => (
              <OrderItem key={item._id}>
                <OrderItemImage>
                  <img 
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/60'} 
                    alt={item.product?.name || 'Product'} 
                  />
                </OrderItemImage>
                
                <OrderItemDetails>
                  <OrderItemName>{item.product?.name || 'Product'}</OrderItemName>
                  {item.variation && (
                    <OrderItemVariation>{item.variation.quantity}</OrderItemVariation>
                  )}
                  <OrderItemPrice>
                    ₹{item.variation?.price || 0} × {item.quantity || 0}
                  </OrderItemPrice>
                </OrderItemDetails>
                
                <OrderItemTotal>
                  ₹{(item.variation?.price || 0) * (item.quantity || 0)}
                </OrderItemTotal>
              </OrderItem>
            ))}
          </OrderItems>
          
          <SummaryDivider />
          
          <SummaryRow>
            <SummaryLabel>Subtotal</SummaryLabel>
            <SummaryValue>₹{cart.total || 0}</SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>Delivery</SummaryLabel>
            <SummaryValue>₹0</SummaryValue>
          </SummaryRow>
          
          <SummaryDivider />
          
          <SummaryRow total>
            <SummaryLabel>Total</SummaryLabel>
            <SummaryValue>₹{cart.total || 0}</SummaryValue>
          </SummaryRow>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <PlaceOrderButton 
            onClick={handlePlaceOrder}
            disabled={loading || !selectedAddressId || !cart.items || cart.items.length === 0}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </PlaceOrderButton>
        </OrderSummary>
      </CheckoutContainer>
    </PageContainer>
  );
};

// Styled Components
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

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const CheckoutMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1.25rem;
`;

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const AddressCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ selected, theme }) => 
    selected ? `${theme.colors.primary}10` : 'white'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const RadioInput = styled.input`
  margin-top: 0.25rem;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const AddressDetails = styled.div`
  flex: 1;
`;

const AddressName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const AddressText = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const AddressPhone = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const DefaultBadge = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  background-color: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.15rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-top: 0.5rem;
`;

const AddAddressButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}10`};
  }
`;

const AddressForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  
  input {
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const CancelButton = styled.button`
  flex: 1;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const SubmitButton = styled.button`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const PaymentMethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PaymentMethodCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid ${({ selected, theme, disabled }) => 
    disabled ? theme.colors.border : 
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ selected, theme, disabled }) => 
    disabled ? '#f9f9f9' : 
    selected ? `${theme.colors.primary}10` : 'white'};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.7 : 1};
  transition: all 0.2s ease;
  
  &:hover:not([disabled]) {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PaymentMethodDetails = styled.div`
  flex: 1;
`;

const PaymentMethodName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const PaymentMethodDescription = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const OrderSummary = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: 1.5rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 350px;
    position: sticky;
    top: 100px;
  }
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1.25rem;
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 0.75rem;
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
  font-size: 0.9rem;
  font-weight: 500;
`;

const OrderItemVariation = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const OrderItemPrice = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const OrderItemTotal = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  align-self: center;
`;

const SummaryDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 1rem 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: ${props => props.total ? '1.1rem' : '0.95rem'};
  font-weight: ${props => props.total ? '600' : '400'};
`;

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SummaryValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  margin-bottom: 1.5rem;
`;

const BackButton = styled.button`
  display: block;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 0.75rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => `${theme.colors.error}10`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin: 1rem 0;
`;

// Styled components for recurring orders
const RecurringOrderToggle = styled.div`
  margin-bottom: 16px;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  input {
    margin-right: 8px;
  }
  
  span {
    font-size: 16px;
  }
`;

const RecurringOrderOptions = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DaysSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const DayOption = styled.div`
  input {
    display: none;
  }
  
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
    border: 1px solid #ddd;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
  }
  
  input:checked + label {
    background-color: #53B175;
    color: white;
    border-color: #53B175;
  }
`;

export default CheckoutPage;