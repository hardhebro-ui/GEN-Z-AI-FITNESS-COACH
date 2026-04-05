import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MultiStepForm from '../MultiStepForm';

describe('MultiStepForm Component', () => {
  const mockOnCancel = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockOnShowTerms = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first step (Basic Info)', () => {
    render(<MultiStepForm onCancel={mockOnCancel} onSubmit={mockOnSubmit} onShowTerms={mockOnShowTerms} />);
    
    expect(screen.getByText(/Basics/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
  });

  it('calls onCancel when the cancel button is clicked', () => {
    render(<MultiStepForm onCancel={mockOnCancel} onSubmit={mockOnSubmit} onShowTerms={mockOnShowTerms} />);
    
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('proceeds to the next step when Continue is clicked after filling required fields', async () => {
    const user = userEvent.setup();
    render(<MultiStepForm onCancel={mockOnCancel} onSubmit={mockOnSubmit} onShowTerms={mockOnShowTerms} />);
    
    // Fill required fields for step 1
    await user.type(screen.getByLabelText(/Age/i), '25');
    await user.selectOptions(screen.getByLabelText(/Gender/i), 'Male');
    await user.type(screen.getByLabelText(/Height/i), '175');
    await user.type(screen.getByLabelText(/Weight/i), '70');
    
    const nextBtn = screen.getByText(/Next Step/i);
    expect(nextBtn).not.toBeDisabled();
    await user.click(nextBtn);
    
    // Should now show step 2 (Profile)
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  });
});
