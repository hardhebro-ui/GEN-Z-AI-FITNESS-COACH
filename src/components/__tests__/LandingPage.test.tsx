import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LandingPage from '../LandingPage';

describe('LandingPage Component', () => {
  const mockOnStart = vi.fn();
  const mockOnExplore = vi.fn();
  const mockOnShowTerms = vi.fn();
  const mockOnShowPrivacy = vi.fn();
  const mockOnShowGuide = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders hero title and start button', () => {
    render(
      <LandingPage 
        onStart={mockOnStart} 
        onExplore={mockOnExplore} 
        onShowTerms={mockOnShowTerms} 
        onShowPrivacy={mockOnShowPrivacy} 
        onShowGuide={mockOnShowGuide}
      />
    );
    
    expect(screen.getAllByText(/fitin60/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Start Your Transformation/i)).toBeInTheDocument();
  });

  it('calls onStart when the main button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <LandingPage 
        onStart={mockOnStart} 
        onExplore={mockOnExplore} 
        onShowTerms={mockOnShowTerms} 
        onShowPrivacy={mockOnShowPrivacy} 
        onShowGuide={mockOnShowGuide}
      />
    );
    
    const startBtn = screen.getByText(/Start Your Transformation/i);
    await user.click(startBtn);
    
    expect(mockOnStart).toHaveBeenCalled();
  });

  it('calls onExplore when the explore button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <LandingPage 
        onStart={mockOnStart} 
        onExplore={mockOnExplore} 
        onShowTerms={mockOnShowTerms} 
        onShowPrivacy={mockOnShowPrivacy} 
        onShowGuide={mockOnShowGuide}
      />
    );
    
    const exploreBtn = screen.getByText(/Explore Protocols/i);
    await user.click(exploreBtn);
    
    expect(mockOnExplore).toHaveBeenCalled();
  });

  it('renders trust badges', () => {
    render(
      <LandingPage 
        onStart={mockOnStart} 
        onExplore={mockOnExplore} 
        onShowTerms={mockOnShowTerms} 
        onShowPrivacy={mockOnShowPrivacy} 
        onShowGuide={mockOnShowGuide}
      />
    );
    
    expect(screen.getAllByText(/No Data Stored/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AI-Generated Plan/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Not Medical Advice/i).length).toBeGreaterThan(0);
  });
});
