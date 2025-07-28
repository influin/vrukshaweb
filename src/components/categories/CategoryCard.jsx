// src/components/categories/CategoryCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const CategoryCard = ({ id, title, imgUrl, itemCount }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Ensure id is defined before using it
  const categoryId = id || "";

  return (
    <CardContainer 
      to={categoryId ? `/category/${categoryId}` : '#'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      isHovered={isHovered}
      as={Link} // Add this line to ensure proper rendering
    >
      <ImageContainer isHovered={isHovered}>
        <CategoryImage src={imgUrl || 'https://via.placeholder.com/80'} alt={title} />
      </ImageContainer>
      <CategoryTitle>{title}</CategoryTitle>
      <ItemCount>{itemCount || 0} items</ItemCount>
      <ViewButton isHovered={isHovered}>View All</ViewButton>
    </CardContainer>
  );
};

const CardContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: 1.5rem 1rem;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: ${({ theme }) => theme.colors.primaryGreen};
    transform: scaleX(${({ isHovered }) => (isHovered ? 1 : 0)});
    transform-origin: bottom left;
    transition: transform 0.3s ease;
  }
`;

const ImageContainer = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  background-color: ${({ theme, isHovered }) => 
    isHovered ? theme.colors.primaryGreen : theme.colors.lightGreen};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  transform: ${({ isHovered }) => (isHovered ? 'scale(1.1)' : 'scale(1)')};
  box-shadow: ${({ isHovered, theme }) => 
    isHovered ? '0 5px 15px rgba(83, 177, 117, 0.3)' : theme.shadows.small};
`;

const CategoryImage = styled.img`
  width: 70%;
  height: 70%;
  object-fit: contain;
`;

const CategoryTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ItemCount = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textGrey};
  margin-bottom: 0.75rem;
`;

const ViewButton = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.primaryGreen};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  opacity: ${({ isHovered }) => (isHovered ? 1 : 0)};
  transform: ${({ isHovered }) => (isHovered ? 'translateY(0)' : 'translateY(10px)')};
  transition: all 0.3s ease;
`;

export default CategoryCard;