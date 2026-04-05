import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CookieConsent from '../CookieConsent';

describe('CookieConsent Component', () => {
  const mockOnShowPolicy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('does not render if consent is already in localStorage', async () => {
    localStorage.setItem('cookie_consent', 'accepted');
    render(<CookieConsent onShowPolicy={mockOnShowPolicy} />);
    
    // Should not be visible even after delay
    await new Promise(resolve => setTimeout(resolve, 1100));
    expect(screen.queryByText(/Cookie Consent/i)).not.toBeInTheDocument();
  });

  it('renders after a delay if no consent is in localStorage', async () => {
    render(<CookieConsent onShowPolicy={mockOnShowPolicy} />);
    
    // Should be visible after 1s delay
    await waitFor(() => {
      expect(screen.getByText(/Cookie Consent/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('calls onShowPolicy when policy link is clicked', async () => {
    const user = userEvent.setup();
    render(<CookieConsent onShowPolicy={mockOnShowPolicy} />);
    
    await waitFor(() => screen.getByText(/Cookie Policy/i));
    const policyBtn = screen.getByText(/Cookie Policy/i);
    await user.click(policyBtn);
    
    expect(mockOnShowPolicy).toHaveBeenCalled();
  });

  it('sets localStorage and hides when Accept All is clicked', async () => {
    const user = userEvent.setup();
    render(<CookieConsent onShowPolicy={mockOnShowPolicy} />);
    
    await waitFor(() => screen.getByText(/Accept All/i));
    const acceptBtn = screen.getByText(/Accept All/i);
    await user.click(acceptBtn);
    
    expect(localStorage.getItem('cookie_consent')).toBe('accepted');
    await waitFor(() => {
      expect(screen.queryByText(/Cookie Consent/i)).not.toBeInTheDocument();
    });
  });

  it('sets localStorage and hides when Decline is clicked', async () => {
    const user = userEvent.setup();
    render(<CookieConsent onShowPolicy={mockOnShowPolicy} />);
    
    await waitFor(() => screen.getByText(/Decline/i));
    const declineBtn = screen.getByText(/Decline/i);
    await user.click(declineBtn);
    
    expect(localStorage.getItem('cookie_consent')).toBe('declined');
    await waitFor(() => {
      expect(screen.queryByText(/Cookie Consent/i)).not.toBeInTheDocument();
    });
  });
});
