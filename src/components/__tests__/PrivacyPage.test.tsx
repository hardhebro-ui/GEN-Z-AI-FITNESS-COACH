import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PrivacyPage from '../PrivacyPage';

describe('PrivacyPage Component', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders privacy policy title', () => {
    render(<PrivacyPage onBack={mockOnBack} />);
    expect(screen.getByText(/Privacy/i)).toBeInTheDocument();
    expect(screen.getByText(/Policy/i)).toBeInTheDocument();
  });

  it('renders data storage info', () => {
    render(<PrivacyPage onBack={mockOnBack} />);
    expect(screen.getByText(/Data Storage/i)).toBeInTheDocument();
    expect(screen.getByText(/LocalStorage/i)).toBeInTheDocument();
    expect(screen.getByText(/Firebase/i)).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<PrivacyPage onBack={mockOnBack} />);
    
    const backBtn = screen.getByText(/Back to App/i);
    await user.click(backBtn);
    
    expect(mockOnBack).toHaveBeenCalled();
  });
});
