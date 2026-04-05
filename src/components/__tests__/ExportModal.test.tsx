import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ExportModal from '../ExportModal';

// Mock html-to-image
vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,test')
}));

describe('ExportModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnUnlock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock navigator.share
    if (typeof navigator.share === 'undefined') {
      Object.defineProperty(navigator, 'share', {
        value: vi.fn().mockResolvedValue(undefined),
        configurable: true
      });
    }
  });

  it('does not render when isOpen is false', () => {
    render(<ExportModal isOpen={false} onClose={mockOnClose} onUnlock={mockOnUnlock} />);
    expect(screen.queryByText(/Unlock/i)).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    render(<ExportModal isOpen={true} onClose={mockOnClose} onUnlock={mockOnUnlock} />);
    expect(screen.getByText(/Unlock/i)).toBeInTheDocument();
    expect(screen.getByText(/Support Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Share to Unlock/i)).toBeInTheDocument();
  });

  it('switches tabs correctly', async () => {
    const user = userEvent.setup();
    render(<ExportModal isOpen={true} onClose={mockOnClose} onUnlock={mockOnUnlock} />);
    
    const shareTab = screen.getByText(/Share to Unlock/i);
    await user.click(shareTab);
    
    expect(screen.getByText(/Spread the/i)).toBeInTheDocument();
    
    const donateTab = screen.getByText(/Support Us/i);
    await user.click(donateTab);
    
    expect(screen.getByText(/Fuel the/i)).toBeInTheDocument();
  });

  it('handles donation amount selection', async () => {
    const user = userEvent.setup();
    render(<ExportModal isOpen={true} onClose={mockOnClose} onUnlock={mockOnUnlock} />);
    
    const fiftyBtn = screen.getByText(/₹50/i);
    await user.click(fiftyBtn);
    
    expect(screen.getByText(/Pay ₹50 via UPI/i)).toBeInTheDocument();
  });

  it('shows UPI QR code and handles verification', async () => {
    const user = userEvent.setup();
    render(<ExportModal isOpen={true} onClose={mockOnClose} onUnlock={mockOnUnlock} />);
    
    const payBtn = screen.getByText(/Pay ₹20 via UPI/i);
    await user.click(payBtn);
    
    expect(screen.getByText(/Scan QR/i)).toBeInTheDocument();
    
    const transactionInput = screen.getByPlaceholderText(/Enter last 4 digits/i);
    await user.type(transactionInput, '1234');
    
    const verifyBtn = screen.getByText(/Verify & Unlock PDF/i);
    await user.click(verifyBtn);
    
    expect(screen.getByText(/Verifying Transaction.../i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockOnUnlock).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('handles share verification', async () => {
    const user = userEvent.setup();
    render(<ExportModal isOpen={true} onClose={mockOnClose} onUnlock={mockOnUnlock} />);
    
    const shareTab = screen.getByText(/Share to Unlock/i);
    await user.click(shareTab);
    
    const nameInput = screen.getByPlaceholderText(/e.g. Alex/i);
    await user.type(nameInput, 'Test User');
    
    const shareBtn = screen.getByText(/Share/i);
    await user.click(shareBtn);
    
    const verifyBtn = screen.getByText(/Step 2: Verify & Unlock PDF/i);
    await user.click(verifyBtn);
    
    expect(screen.getByText(/Verifying Share Status.../i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockOnUnlock).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});
