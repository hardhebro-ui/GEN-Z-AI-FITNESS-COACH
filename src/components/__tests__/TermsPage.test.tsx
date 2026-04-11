import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TermsPage from '../../pages/TermsPage';

describe('TermsPage Component', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders terms and conditions title', () => {
    render(<TermsPage onBack={mockOnBack} />);
    expect(screen.getByText(/Terms &/i)).toBeInTheDocument();
    expect(screen.getByText(/Conditions/i)).toBeInTheDocument();
  });

  it('renders medical disclaimer', () => {
    render(<TermsPage onBack={mockOnBack} />);
    expect(screen.getByText(/Medical Disclaimer/i)).toBeInTheDocument();
    expect(screen.getByText(/fitin60.ai does not provide medical advice/i)).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<TermsPage onBack={mockOnBack} />);
    
    const backBtn = screen.getByText(/Back to App/i);
    await user.click(backBtn);
    
    expect(mockOnBack).toHaveBeenCalled();
  });
});
