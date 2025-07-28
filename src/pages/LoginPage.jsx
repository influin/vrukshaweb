// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <LogoContainer>
          <LogoText>Vruksha</LogoText>
        </LogoContainer>
        
        <FormTitle>Welcome Back</FormTitle>
        <FormSubtitle>Sign in to your account</FormSubtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <PasswordToggle 
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? "Hide" : "Show"}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>
          
          <ForgotPasswordLink>
            <Link to="/forgot-password">Forgot Password?</Link>
          </ForgotPasswordLink>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner /> Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </SubmitButton>
        </Form>
        
        <Divider>
          <DividerText>OR</DividerText>
        </Divider>
        
        <SocialLoginButton type="button">
          <SocialIcon src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
          Continue with Google
        </SocialLoginButton>
        
        <SignupLink>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </SignupLink>
      </FormContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
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
  max-width: 450px;
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

const ForgotPasswordLink = styled.div`
  text-align: right;
  margin-top: -0.5rem;
  
  a {
    color: ${({ theme }) => theme.colors.primaryGreen};
    font-size: 0.85rem;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
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
  margin-top: 0.5rem;
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

const SignupLink = styled.p`
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

export default LoginPage;