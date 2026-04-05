import React from 'react';
import ExplorePlans from '../components/ExplorePlans';
import SEO from '../components/SEO';

interface ExplorePageProps {
  onBack: () => void;
  lastInputs: any;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ onBack, lastInputs }) => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <SEO 
        title="Explore AI Fitness Protocols | Fitin60ai.in Library"
        description="Browse our library of AI-generated workout and diet plans. Find the perfect protocol for muscle building, fat loss, or strength training."
        canonical="https://fitin60ai.in/explore-plans"
      />
      <ExplorePlans onBack={onBack} lastInputs={lastInputs} />
    </div>
  );
};

export default ExplorePage;
