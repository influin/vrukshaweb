// src/components/profile/ProfileAddresses.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { apiService } from '../../api/apiService';

const ProfileAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
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
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserAddresses();
      setAddresses(response.data);
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

  const resetForm = () => {
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
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleEditAddress = (address) => {
    setAddressFormData({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault
    });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteUserAddress(addressId);
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      setSuccess('Address deleted successfully!');
      setLoading(false);
    } catch (err) {
      setError('Failed to delete address. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingAddressId) {
        // Update existing address
        const response = await apiService.updateUserAddress(editingAddressId, addressFormData);
        setAddresses(prev => prev.map(addr => 
          addr.id === editingAddressId ? response.data : addr
        ));
        setSuccess('Address updated successfully!');
      } else {
        // Add new address
        const response = await apiService.addUserAddress(addressFormData);
        setAddresses(prev => [...prev, response.data]);
        setSuccess('Address added successfully!');
      }
      resetForm();
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to save address. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>My Addresses</SectionTitle>
        {!showAddressForm && (
          <AddButton onClick={() => {
            resetForm();
            setShowAddressForm(true);
            setError('');
            setSuccess('');
          }}>
            + Add New Address
          </AddButton>
        )}
      </SectionHeader>
      
      {success && <SuccessMessage>{success}</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {showAddressForm ? (
        <AddressForm onSubmit={handleSubmit}>
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
            <CancelButton type="button" onClick={resetForm}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingAddressId ? 'Update Address' : 'Add Address'}
            </SubmitButton>
          </FormButtons>
        </AddressForm>
      ) : (
        <>
          {loading && <LoadingMessage>Loading addresses...</LoadingMessage>}
          
          {!loading && addresses.length === 0 && (
            <EmptyMessage>You don't have any saved addresses yet.</EmptyMessage>
          )}
          
          <AddressList>
            {addresses.map(address => (
              <AddressCard key={address.id}>
                {address.isDefault && <DefaultBadge>Default</DefaultBadge>}
                
                <AddressDetails>
                  <AddressName>{address.name}</AddressName>
                  <AddressText>
                    {address.addressLine1}, 
                    {address.addressLine2 && `${address.addressLine2}, `}
                    {address.city}, {address.state} - {address.pincode}
                  </AddressText>
                  <AddressPhone>Phone: {address.phone}</AddressPhone>
                </AddressDetails>
                
                <AddressActions>
                  <ActionButton onClick={() => handleEditAddress(address)}>
                    <EditIcon fontSize="small" />
                  </ActionButton>
                  <ActionButton 
                    onClick={() => handleDeleteAddress(address.id)}
                    className="delete"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </ActionButton>
                </AddressActions>
              </AddressCard>
            ))}
          </AddressList>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const AddButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}10`};
  }
`;

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AddressCard = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.small};
  }
`;

const DefaultBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.75rem;
  background-color: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.15rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const AddressDetails = styled.div`
  margin-bottom: 1rem;
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

const AddressActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &.delete:hover {
    color: ${({ theme }) => theme.colors.error};
    background-color: ${({ theme }) => `${theme.colors.error}10`};
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

const SuccessMessage = styled.div`
  padding: 0.75rem;
  background-color: ${({ theme }) => `${theme.colors.success}10`};
  color: ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background-color: ${({ theme }) => `${theme.colors.error}10`};
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: 1rem;
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

export default ProfileAddresses;