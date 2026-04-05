import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '../Navbar';

describe('Navbar Component', () => {
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logo and navigation links', () => {
    render(<Navbar onNavigate={mockOnNavigate} currentState="landing" />);
    
    expect(screen.getAllByText(/fitin60/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore/i)).toBeInTheDocument();
  });

  it('calls onNavigate when links are clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar onNavigate={mockOnNavigate} currentState="landing" />);
    
    const exploreBtn = screen.getByText(/Explore/i);
    await user.click(exploreBtn);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('explore');
  });

  it('calls onNavigate with "form" when Start Now is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar onNavigate={mockOnNavigate} currentState="landing" />);
    
    const startNowBtns = screen.getAllByText(/Start Now/i);
    // Desktop version is usually the first one in this component's structure
    await user.click(startNowBtns[0]);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('form');
  });
});
