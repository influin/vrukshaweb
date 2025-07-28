// src/components/profile/ProfileInfo.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../api/apiService';

const ProfileInfo = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    isBusiness: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        isBusiness: user.isBusiness || false
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <SectionTitle>Personal Information</SectionTitle>
      
      {success && <SuccessMessage>{success}</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Full Name</FormLabel>
          {isEditing ? (
            <FormInput 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              required
            />
          ) : (
            <FormValue>{formData.name}</FormValue>
          )}
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Email Address</FormLabel>
          {isEditing ? (
            <FormInput 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              required
              disabled
            />
          ) : (
            <FormValue>{formData.email}</FormValue>
          )}
          <FormHint>Email cannot be changed</FormHint>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Phone Number</FormLabel>
          {isEditing ? (
            <FormInput 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange}
              required
            />
          ) : (
            <FormValue>{formData.phone}</FormValue>
          )}
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Account Type</FormLabel>
          {isEditing ? (
            <FormCheckbox>
              <input 
                type="checkbox" 
                name="isBusiness" 
                checked={formData.isBusiness} 
                onChange={handleChange}
              />
              <span>Business Account</span>
            </FormCheckbox>
          ) : (
            <FormValue>
              {formData.isBusiness ? 'Business Account' : 'Personal Account'}
            </FormValue>
          )}
        </FormGroup>
        
        <FormActions>
          {isEditing ? (
            <>
              <CancelButton type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </SubmitButton>
            </>
          ) : (
            <EditButton type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </EditButton>
          )}
        </FormActions>
      </Form>
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
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
  width: 100%;
  max-width: 400px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }
`;

const FormValue = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 0.25rem 0;
`;

const FormHint = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

const FormCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  
  input {
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const EditButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.75rem 1.5rem;
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

export default ProfileInfo;