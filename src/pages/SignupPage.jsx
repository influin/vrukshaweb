// src/pages/SignupPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await signup(name, email, password, phone, isBusiness);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!name || !email) {
        setError('Please fill in all required fields in this step');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
    setError('');
  };

  return (
    <PageContainer>
      <FormContainer>
        <LogoContainer>
          <LogoText>Vruksha</LogoText>
        </LogoContainer>
        
        <FormTitle>Create Account</FormTitle>
        <FormSubtitle>Join our community today</FormSubtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <StepIndicator>
          <StepDot active={step === 1} completed={step > 1} />
          <StepConnector completed={step > 1} />
          <StepDot active={step === 2} completed={false} />
        </StepIndicator>
        
        <Form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <FormGroup>
                <Label htmlFor="name">Full Name*</Label>
                <InputWrapper>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                  <InputIcon className="material-icons">person</InputIcon>
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email*</Label>
                <InputWrapper>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <InputIcon className="material-icons">email</InputIcon>
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="phone">Phone Number</Label>
                <InputWrapper>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  <InputIcon className="material-icons">phone</InputIcon>
                </InputWrapper>
              </FormGroup>
              
              <ButtonGroup>
                <NextButton type="button" onClick={nextStep}>
                  Next Step
                </NextButton>
              </ButtonGroup>
            </>
          ) : (
            <>
              <FormGroup>
                <Label htmlFor="password">Password*</Label>
                <InputWrapper>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                  <PasswordToggle 
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </PasswordToggle>
                </InputWrapper>
                <PasswordStrength strength={password.length > 8 ? 'strong' : password.length > 5 ? 'medium' : 'weak'}>
                  <StrengthBar strength={password.length > 8 ? 'strong' : password.length > 5 ? 'medium' : 'weak'} />
                  <StrengthText>
                    {password.length === 0 ? 'Password strength' :
                     password.length > 8 ? 'Strong' :
                     password.length > 5 ? 'Medium' : 'Weak'}
                  </StrengthText>
                </PasswordStrength>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password*</Label>
                <InputWrapper>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                  <PasswordToggle 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </PasswordToggle>
                </InputWrapper>
                {confirmPassword && password !== confirmPassword && (
                  <PasswordMismatch>Passwords do not match</PasswordMismatch>
                )}
              </FormGroup>
              
              <CheckboxGroup>
                <Checkbox
                  id="isBusiness"
                  type="checkbox"
                  checked={isBusiness}
                  onChange={(e) => setIsBusiness(e.target.checked)}
                />
                <CheckboxLabel htmlFor="isBusiness">
                  Register as a business account
                </CheckboxLabel>
              </CheckboxGroup>
              
              <ButtonGroup>
                <BackButton type="button" onClick={prevStep}>
                  Back
                </BackButton>
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner /> Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </SubmitButton>
              </ButtonGroup>
            </>
          )}
        </Form>
        
        <Divider>
          <DividerText>OR</DividerText>
        </Divider>
        
        <SocialLoginButton type="button">
          <SocialIcon src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
          Continue with Google
        </SocialLoginButton>
        
        <LoginLink>
          Already have an account? <Link to="/login">Login</Link>
        </LoginLink>
      </FormContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundGrey};
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const LogoText = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryGreen};
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  margin: 1rem 0;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const FormTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
  text-align: center;
`;

const FormSubtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const StepDot = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: ${({ active, completed, theme }) => 
    active ? theme.colors.primaryGreen : 
    completed ? theme.colors.lightGreen : 
    theme.colors.borderGrey};
  border: 2px solid ${({ active, completed, theme }) => 
    active || completed ? theme.colors.primaryGreen : 
    theme.colors.borderGrey};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  
  &::after {
    content: ${({ completed }) => completed ? '"✓"' : '""'};
  }
`;

const StepConnector = styled.div`
  height: 2px;
  width: 4rem;
  background-color: ${({ completed, theme }) => 
    completed ? theme.colors.primaryGreen : theme.colors.borderGrey};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  padding-right: ${props => props.type === 'password' ? '4rem' : '2.5rem'};
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryGreen};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primaryGreen}33`};
  }
`;

const InputIcon = styled.span`
  position: absolute;
  right: 1rem;
  color: ${({ theme }) => theme.colors.textGrey};
  font-size: 1.25rem;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primaryGreen};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
`;

const StrengthBar = styled.div`
  height: 4px;
  background-color: ${({ strength, theme }) => 
    strength === 'strong' ? theme.colors.primaryGreen :
    strength === 'medium' ? theme.colors.yellow :
    theme.colors.orange};
  width: ${({ strength }) => 
    strength === 'strong' ? '100%' :
    strength === 'medium' ? '66%' : '33%'};
  border-radius: 2px;
  margin-bottom: 0.25rem;
`;

const StrengthText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textGrey};
`;

const PasswordMismatch = styled.div`
  color: ${({ theme }) => theme.colors.orange};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primaryGreen};
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const NextButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primaryGreen};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.darkGreen};
    transform: translateY(-2px);
  }
`;

const BackButton = styled.button`
  background-color: white;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundGrey};
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primaryGreen};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.darkGreen};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed;
    transform: none;
  }
`;

const Spinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderGrey};
  }
`;

const DividerText = styled.span`
  padding: 0 1rem;
  color: ${({ theme }) => theme.colors.textGrey};
  font-size: 0.85rem;
`;

const SocialLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundGrey};
  }
`;

const SocialIcon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => `${theme.colors.orange}15`};
  color: ${({ theme }) => theme.colors.orange};
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '⚠️';
    margin-right: 0.5rem;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  a {
    color: ${({ theme }) => theme.colors.primaryGreen};
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default SignupPage;