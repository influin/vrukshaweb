// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useResponsive from '../../hooks/useResponsive';

const Footer = () => {
  const { isMobile } = useResponsive();
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Vruksha</FooterTitle>
          <FooterText>
            Your one-stop shop for fresh, organic groceries and household essentials.
            We deliver quality products directly from farms to your doorstep.
          </FooterText>
          <ContactInfo>
            <ContactItem>Email: support@vruksha.com</ContactItem>
            <ContactItem>Phone: +1 (555) 123-4567</ContactItem>
          </ContactInfo>
        </FooterSection>

        {!isMobile && (
          <>
            <FooterSection>
              <FooterTitle>Quick Links</FooterTitle>
              <FooterLinks>
                <FooterLink>
                  <Link to="/">Home</Link>
                </FooterLink>
                <FooterLink>
                  <Link to="/">Shop</Link>
                </FooterLink>
                <FooterLink>
                  <Link to="/cart">Cart</Link>
                </FooterLink>
                <FooterLink>
                  <Link to="/profile">My Account</Link>
                </FooterLink>
              </FooterLinks>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Customer Service</FooterTitle>
              <FooterLinks>
                <FooterLink>
                  <Link to="/">Contact Us</Link>
                </FooterLink>
                <FooterLink>
                  <Link to="/">FAQ</Link>
                </FooterLink>
                <FooterLink>
                  <Link to="/">Shipping Policy</Link>
                </FooterLink>
                <FooterLink>
                  <Link to="/">Return Policy</Link>
                </FooterLink>
              </FooterLinks>
            </FooterSection>

            <FooterSection>
              <FooterTitle>About Us</FooterTitle>
              <FooterLinks>
                <FooterLink>
                  <Link to="/">Our Story</Link>
                </FooterLink>
                <FooterLink>
                  <Link to="/">Blog</Link>
                </FooterLink>
                <FooterLink>
                  <Link to="/">Sustainability</Link>
                </FooterLink>
                <FooterLink>
                  <Link to="/">Careers</Link>
                </FooterLink>
              </FooterLinks>
            </FooterSection>
          </>
        )}
      </FooterContent>
      
      <FooterBottom>
        <CopyrightText>
          © {currentYear} Vruksha Organic Foods. All rights reserved.
        </CopyrightText>
        <FooterBottomLinks>
          <FooterBottomLink>
            <Link to="/">Privacy Policy</Link>
          </FooterBottomLink>
          <FooterBottomLink>
            <Link to="/">Terms of Service</Link>
          </FooterBottomLink>
        </FooterBottomLinks>
      </FooterBottom>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.darkGreen};
  color: white;
  padding: 3rem 1rem 1rem;
  margin-top: 3rem;
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
  gap: 2rem;
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FooterTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.2rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryGreen};
`;

const FooterText = styled.p`
  margin: 0.5rem 0 1.5rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
`;

const ContactInfo = styled.div`
  margin-top: 1rem;
`;

const ContactItem = styled.p`
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.8rem;
  
  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryGreen};
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 3rem;
  padding-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const CopyrightText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
`;

const FooterBottomLinks = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-content: center;
  }
`;

const FooterBottomLink = styled.li`
  a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 0.85rem;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryGreen};
    }
  }
`;

export default Footer;