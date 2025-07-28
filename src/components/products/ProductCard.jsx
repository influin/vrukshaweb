// src/components/products/ProductCard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ id, _id, title, imgUrl, price, qty, variationIndex = 0 }) => {
  // Use _id if provided, otherwise fall back to id
  const productId = _id || id || "";
  
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Debug the props
  useEffect(() => {
    console.log('ProductCard Props:', { id, title, imgUrl, price, qty, variationIndex });
  }, [id, title, imgUrl, price, qty, variationIndex]);

  // Ensure id is defined before using it
   
  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!productId) {
      console.error('Product ID is undefined');
      return;
    }
    
    setIsAdding(true);
    try {
      await addToCart(productId, variationIndex, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCardClick = (e) => {
    // Prevent default only if we're not clicking the add to cart button
    if (!e.defaultPrevented) {
      console.log('Card clicked, navigating to:', `/product/${productId}`);
      if (productId) {
        navigate(`/product/${productId}`);
      }
    }
  };

  return (
    <CardContainer 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImageContainer>
        <ProductImage src={imgUrl || 'https://via.placeholder.com/150'} alt={title} />
        <DiscountBadge>10% OFF</DiscountBadge>
        <WishlistButton>
          <FavoriteBorderIcon fontSize="small" />
        </WishlistButton>
      </ImageContainer>
      <ProductInfo>
        <ProductCategory>Organic</ProductCategory>
        <ProductTitle>{title}</ProductTitle>
        <ProductDetails>
          <ProductPrice>₹{price}</ProductPrice>
          <ProductQuantity>{qty}</ProductQuantity>
        </ProductDetails>
        <AddToCartButton 
          onClick={handleAddToCart} 
          disabled={isAdding || !productId}
          isHovered={isHovered}
        >
          <AddShoppingCartIcon fontSize="small" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </AddToCartButton>
      </ProductInfo>
    </CardContainer>
  );
};

// Keep the rest of the styled components as they are
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  text-decoration: none;
  color: inherit;
  position: relative;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const ImageContainer = styled.div`
  height: 180px;
  overflow: hidden;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: ${({ theme }) => theme.colors.orange};
  color: white;
  font-size: 0.7rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: 4px 8px;
  border-radius: 12px;
  z-index: 1;
`;

const WishlistButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 1;
  opacity: 0;
  transform: translateY(-5px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  
  ${CardContainer}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGreen};
    color: ${({ theme }) => theme.colors.primaryGreen};
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProductCategory = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primaryGreen};
  margin-bottom: 0.25rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ProductTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.5rem;
`;

const ProductDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const ProductPrice = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primaryGreen};
`;

const ProductQuantity = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  background-color: ${({ theme }) => theme.colors.lightGreen};
  padding: 2px 8px;
  border-radius: 4px;
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: ${({ theme, isHovered }) => 
    isHovered ? theme.colors.darkGreen : theme.colors.primaryGreen};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  width: 100%;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.darkGreen};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed;
  }
`;

export default ProductCard;