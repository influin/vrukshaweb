// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundPage = () => {
  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Description>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </Description>
      <HomeLink to="/">Go to Homepage</HomeLink>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 1rem 0;
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 500px;
  margin: 0 0 2rem;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 500;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export default NotFoundPage;