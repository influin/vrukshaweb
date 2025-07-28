// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { apiService } from '../api/apiService';
import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/categories/CategoryCard';
import SectionTitle from '../components/common/SectionTitle';
import useResponsive from '../hooks/useResponsive';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: !isMobile,
  };

  // Hero slider content
  const heroSlides = [
    {
      title: "Fresh Groceries Delivered to Your Doorstep",
      subtitle: "Shop from a wide range of fresh fruits, vegetables, and daily essentials",
      bgColor: "#53B175",
    },
    {
      title: "Organic Produce at Your Fingertips",
      subtitle: "Discover our selection of certified organic fruits and vegetables",
      bgColor: "#F3603F",
    },
    {
      title: "Special Offers This Week",
      subtitle: "Save up to 25% on selected items. Limited time only!",
      bgColor: "#0B2512",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories()
        ]);
        
        // Map the API response to the expected format
        const mappedProducts = productsData.map(product => ({
          id: product._id,
          name: product.name,
          images: product.images,
          category: product.category ? {
            id: product.category._id,
            name: product.category.name,
            icon: product.category.icon
          } : null,
          description: product.description,
          variations: product.variation || [], // Note: API returns 'variation' but components expect 'variations'
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }));
        
        const mappedCategories = categoriesData.map(category => ({
          id: category._id,
          name: category.name,
          icon: category.icon,
          parent: category.parent,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }));
        
        console.log('Mapped Products:', mappedProducts);
        console.log('Mapped Categories:', mappedCategories);
        
        setProducts(mappedProducts);
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Function to get product count for each category
  const getCategoryProductCount = (categoryId) => {
    if (!products || !categoryId) return 0;
    return products.filter(product => product.category && product.category.id === categoryId).length;
  };

  const handleCategoryViewAll = () => {
    // This would typically navigate to a categories page
    // For now, we'll just log it
    console.log('View all categories clicked');
  };

  const getCategoryGridColumns = () => {
    if (isDesktop) return 6;
    if (isTablet) return 4;
    return 3; // Mobile
  };

  const getProductGridColumns = () => {
    if (isDesktop) return 4;
    if (isTablet) return 3;
    return 2; // Mobile
  };

  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <PageContainer>
      <HeroSliderSection>
        <Slider {...sliderSettings}>
          {heroSlides.map((slide, index) => (
            <SlideItem key={index} bgColor={slide.bgColor}>
              <SlideContent>
                <HeroTitle>{slide.title}</HeroTitle>
                <HeroSubtitle>{slide.subtitle}</HeroSubtitle>
              </SlideContent>
            </SlideItem>
          ))}
        </Slider>
      </HeroSliderSection>

      <ContentSection>
        <SectionTitle 
          title="Categories" 
          viewAllLink 
          onViewAllClick={handleCategoryViewAll} 
        />
        <CategoriesGrid columns={getCategoryGridColumns()}>
          {categories.slice(0, 6).map((category) => {
            // Log each category for debugging
            console.log('Category being rendered:', category);
            return (
              <CategoryCard
                key={category.id}
                id={category.id}
                title={category.name}
                imgUrl={category.icon || 'https://via.placeholder.com/80'}
                itemCount={getCategoryProductCount(category.id)}
              />
            );
          })}
        </CategoriesGrid>

        <SectionTitle title="Featured Products" />
        <ProductsGrid columns={getProductGridColumns()}>
          {products.slice(0, 8).map((product) => {
            // Log each product for debugging
            console.log('Product being rendered:', product);
            console.log('Product ID:', product.id);
            console.log('Product Images:', product.images);
            console.log('Product Variations:', product.variations);
            
            return (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.name}
                imgUrl={product.images?.[0] || 'https://via.placeholder.com/150'}
                price={product.variations?.[0]?.price || 0}
                qty={product.variations?.[0]?.quantity || ''}
                variationIndex={0}
              />
            );
          })}
        </ProductsGrid>
      </ContentSection>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeroSliderSection = styled.section`
  .slick-dots {
    bottom: 20px;
    
    li button:before {
      color: white;
      opacity: 0.5;
    }
    
    li.slick-active button:before {
      color: white;
      opacity: 1;
    }
  }
  
  .slick-prev, .slick-next {
    z-index: 1;
    
    &:before {
      font-size: 24px;
    }
  }
  
  .slick-prev {
    left: 15px;
  }
  
  .slick-next {
    right: 15px;
  }
`;

const SlideItem = styled.div`
  background-color: ${props => props.bgColor || props.theme.colors.primary};
  color: white;
  padding: 4rem 1rem;
  text-align: center;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SlideContent = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.25rem;
  }
`;

const ContentSection = styled.section`
  max-width: ${({ theme }) => theme.breakpoints.desktop};
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: 1.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.error};
`;

export default HomePage;