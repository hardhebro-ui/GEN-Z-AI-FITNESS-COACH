import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewPrompt from '../ReviewPrompt';

// Mock confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}));

// Mock firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
  doc: vi.fn(),
  runTransaction: vi.fn((db, callback) => callback({
    get: vi.fn().mockResolvedValue({ exists: () => false }),
    set: vi.fn()
  }))
}));

describe('ReviewPrompt Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(<ReviewPrompt isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.queryByText(/Rate the/i)).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    render(<ReviewPrompt isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByText(/Rate the/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Review/i)).toBeInTheDocument();
  });

  it('allows selecting a rating', async () => {
    const user = userEvent.setup();
    render(<ReviewPrompt isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    const stars = screen.getAllByRole('button').filter(btn => btn.querySelector('svg'));
    // The first 5 buttons are stars
    await user.click(stars[3]); // 4 stars
    
    const submitBtn = screen.getByText(/Submit Review/i);
    expect(submitBtn).not.toBeDisabled();
  });

  it('allows selecting tags', async () => {
    const user = userEvent.setup();
    render(<ReviewPrompt isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    const tagBtn = screen.getByText(/Great for beginners/i);
    await user.click(tagBtn);
    
    expect(tagBtn).toHaveClass('bg-neon');
  });

  it('handles submission correctly', async () => {
    const user = userEvent.setup();
    render(<ReviewPrompt isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    // Select rating
    const stars = screen.getAllByRole('button').filter(btn => btn.querySelector('svg'));
    await user.click(stars[4]); // 5 stars
    
    // Type review
    const textarea = screen.getByPlaceholderText(/Tell us what you think/i);
    await user.type(textarea, 'Amazing app!');
    
    // Submit
    const submitBtn = screen.getByText(/Submit Review/i);
    await user.click(submitBtn);
    
    expect(screen.getByText(/Respect!/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(5, 'Amazing app!', '');
    }, { timeout: 4000 });
  });
});
