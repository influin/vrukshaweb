// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { apiService } from '../api/apiService';
import { useCart } from '../context/CartContext';
import useResponsive from '../hooks/useResponsive';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { isMobile } = useResponsive();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getProductDetails(id);
        
        console.log('Raw API response:', data);
        console.log('Variation data from API:', data.variation);
        
        // Map the API response to the expected format
        const mappedProduct = {
          id: data._id,
          name: data.name,
          images: data.images,
          category: data.category ? {
            id: data.category._id,
            name: data.category.name,
            icon: data.category.icon
          } : null,
          description: data.description,
          variations: data.variation || [], // Note: API returns 'variation' but components expect 'variations'
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
        
        console.log('Mapped product variations:', mappedProduct.variations);
        
        setProduct(mappedProduct);
        // Reset selected variation when product changes
        setSelectedVariation(0);
        setQuantity(1);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);

  const handleVariationChange = (index) => {
    setSelectedVariation(index);
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, quantity + value);
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product.id, selectedVariation, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <LoadingMessage>Loading product details...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!product) {
    return <ErrorMessage>Product not found</ErrorMessage>;
  }

  const currentVariation = product.variations?.[selectedVariation] || {};

  return (
    <PageContainer>
      <BackLink to="/">
        <ArrowBackIcon fontSize="small" />
        Back to Products
      </BackLink>
      
      <ProductContainer>
        <ProductImageSection>
          <ProductImageContainer>
            <ProductImage 
              src={product.images?.[0] || 'https://via.placeholder.com/400'} 
              alt={product.name} 
            />
          </ProductImageContainer>
        </ProductImageSection>
        
        <ProductInfoSection>
          <ProductHeader>
            <ProductName>{product.name}</ProductName>
            
            {product.category && (
              <CategoryLink to={`/category/${product.category.id}`}>
                {product.category.name}
              </CategoryLink>
            )}
            
            <ProductPrice>₹{currentVariation.price || 0}</ProductPrice>
          </ProductHeader>
          
          {product.variations && product.variations.length > 0 ? (
            <VariationsContainer>
              <SectionLabel>Variations</SectionLabel>
              <VariationOptions>
                {console.log('Rendering variations:', product.variations)}
                {product.variations.map((variation, index) => (
                  <VariationOption 
                    key={index}
                    selected={index === selectedVariation}
                    onClick={() => handleVariationChange(index)}
                  >
                    {variation.weight || 'N/A'}
                  </VariationOption>
                ))}
              </VariationOptions>
            </VariationsContainer>
          ) : (
            <div>No variations available</div>
          )}
          
          <QuantityContainer>
            <SectionLabel>Quantity</SectionLabel>
            <QuantityControls>
              <QuantityButton 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <RemoveIcon fontSize="small" />
              </QuantityButton>
              <QuantityValue>{quantity}</QuantityValue>
              <QuantityButton onClick={() => handleQuantityChange(1)}>
                <AddIcon fontSize="small" />
              </QuantityButton>
            </QuantityControls>
          </QuantityContainer>
          
          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            <ShoppingCartIcon style={{ marginRight: '8px' }} />
            {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
          </AddToCartButton>
          
          {product.description && (
            <DescriptionContainer>
              <SectionLabel>Description</SectionLabel>
              <Description>{product.description}</Description>
            </DescriptionContainer>
          )}
        </ProductInfoSection>
      </ProductContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background-color: #fff;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  margin-bottom: 2rem;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryGreen};
    background-color: ${({ theme }) => theme.colors.lightGreen || '#E8F5E8'};
  }
`;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  background-color: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
  overflow: hidden;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

const ProductImageSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background-color: #f9f9f9;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 450px;
  }
`;

const ProductImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ProductInfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
`;

const ProductHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderGrey || '#E2E2E2'};
`;

const ProductName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CategoryLink = styled(Link)`
  display: inline-block;
  color: ${({ theme }) => theme.colors.text.secondary};
  background-color: ${({ theme }) => theme.colors.backgroundGrey || '#FCFCFC'};
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryGreen || '#53B175'};
    background-color: ${({ theme }) => theme.colors.lightGreen || '#E8F5E8'};
  }
`;

const ProductPrice = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryGreen || '#53B175'};
  margin-top: 0.5rem;
`;

const SectionLabel = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.75rem;
`;

const VariationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderGrey || '#E2E2E2'};
`;

const VariationOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const VariationOption = styled.button`
  padding: 0.75rem 1.25rem;
  border: 2px solid ${({ selected, theme }) => 
    selected ? theme.colors.primaryGreen || '#53B175' : theme.colors.borderGrey || '#E2E2E2'};
  background-color: ${({ selected, theme }) => 
    selected ? (theme.colors.lightGreen || '#E8F5E8') : 'white'};
  color: ${({ selected, theme }) => 
    selected ? theme.colors.primaryGreen || '#53B175' : theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${({ selected }) => selected ? '600' : '400'};
  transition: all 0.2s ease;
  box-shadow: ${({ selected, theme }) => 
    selected ? theme.shadows.small : 'none'};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryGreen || '#53B175'};
    transform: translateY(-2px);
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderGrey || '#E2E2E2'};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid ${({ theme }) => theme.colors.borderGrey || '#E2E2E2'};
  background-color: white;
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primaryGreen || '#53B175'};
    color: ${({ theme }) => theme.colors.primaryGreen || '#53B175'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const QuantityValue = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  min-width: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primaryGreen || '#53B175'};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.darkGreen || '#0B2512'};
    transform: translateY(-3px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.textLight || '#B1B1B1'};
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const DescriptionContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1.25rem;
  background-color: ${({ theme }) => theme.colors.backgroundGrey || '#FCFCFC'};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  margin: 2rem auto;
  max-width: 600px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.orange || '#F3603F'};
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  margin: 2rem auto;
  max-width: 600px;
`;

export default ProductDetailPage;