// src/components/common/SectionTitle.jsx
import styled from 'styled-components';

const SectionTitle = ({ title, viewAllLink, onViewAllClick }) => {
  return (
    <TitleContainer>
      <Title>{title}</Title>
      {viewAllLink && (
        <ViewAllButton onClick={onViewAllClick}>
          View All
        </ViewAllButton>
      )}
    </TitleContainer>
  );
};

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export default SectionTitle;