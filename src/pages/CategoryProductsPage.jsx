// src/pages/CategoryProductsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { apiService } from '../api/apiService';
import ProductCard from '../components/products/ProductCard';
import useResponsive from '../hooks/useResponsive';

const CategoryProductsPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isMobile, isTablet, isDesktop } = useResponsive();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getProductsByCategory(id);
        setProducts(data);
        
        // Set category name if available in the first product
        if (data.length > 0 && data[0].category) {
          setCategory(data[0].category);
        }
      } catch (error) {
        console.error('Error fetching category products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryProducts();
  }, [id]);

  const getProductGridColumns = () => {
    if (isDesktop) return 4;
    if (isTablet) return 3;
    return 2; // Mobile
  };

  if (loading) {
    return <LoadingMessage>Loading products...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <PageContainer>
      <BackLink to="/">
        <ArrowBackIcon fontSize="small" />
        Back to Home
      </BackLink>
      
      <CategoryHeader>
        <CategoryTitle>
          {category ? category.name : 'Category Products'}
        </CategoryTitle>
        <ProductCount>{products.length} Products</ProductCount>
      </CategoryHeader>
      
      {products.length === 0 ? (
        <EmptyState>
          <EmptyMessage>No products found in this category.</EmptyMessage>
          <Link to="/">Return to Home</Link>
        </EmptyState>
      ) : (
        <ProductsGrid columns={getProductGridColumns()}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name}
              imgUrl={product.images?.[0] || 'https://via.placeholder.com/150'}
              price={product.variations?.[0]?.price || 0}
              qty={product.variations?.[0]?.quantity || ''}
              variationIndex={0}
            />
          ))}
        </ProductsGrid>
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CategoryHeader = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem;
`;

const ProductCount = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  
  a {
    display: inline-block;
    margin-top: 1rem;
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const EmptyMessage = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.error};
`;

export default CategoryProductsPage;