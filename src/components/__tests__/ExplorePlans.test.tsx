import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ExplorePlans from '../ExplorePlans';
import * as exploreService from '../../services/exploreService';

// Mock the exploreService
vi.mock('../../services/exploreService', () => ({
  fetchExplorePlans: vi.fn(),
  fetchTrendingPlans: vi.fn(),
  incrementDownloadCount: vi.fn(),
  fetchPlanDetails: vi.fn(),
}));

// Mock the pdfService
vi.mock('../../services/pdfService', () => ({
  generateProgrammaticPDF: vi.fn(),
}));

describe('ExplorePlans Component', () => {
  const mockOnBack = vi.fn();
  const mockPlans = [
    {
      id: '1',
      title: 'Fat Loss Protocol',
      goal: 'Fat Loss',
      level: 'Beginner',
      duration: '4 Weeks',
      location: 'Gym',
      rating: 4.5,
      downloads: 100,
      preview: { summary: 'A great plan for fat loss', calories: '2000' },
      tags: ['Fat Loss', 'Gym']
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (exploreService.fetchExplorePlans as any).mockResolvedValue({ plans: mockPlans, lastDoc: { id: 'last' } });
    (exploreService.fetchTrendingPlans as any).mockResolvedValue(mockPlans);
  });

  it('renders the explore page and loads initial plans', async () => {
    render(<ExplorePlans onBack={mockOnBack} />);
    
    // Check for title - it's "Elite Protocols"
    expect(screen.getAllByText(/Protocols/i).length).toBeGreaterThan(0);
    
    await waitFor(() => {
      expect(screen.getByText('Fat Loss Protocol')).toBeInTheDocument();
    });
  });

  it('calls onBack when the back button is clicked', async () => {
    const user = userEvent.setup();
    render(<ExplorePlans onBack={mockOnBack} />);
    
    const backBtn = screen.getByLabelText(/Go back/i);
    await user.click(backBtn);
    
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('filters plans when a quick filter is clicked', async () => {
    const user = userEvent.setup();
    render(<ExplorePlans onBack={mockOnBack} />);
    
    // Wait for initial load
    await waitFor(() => expect(exploreService.fetchExplorePlans).toHaveBeenCalled());
    
    const fatLossFilter = screen.getAllByText('Fat Loss')[0]; // The filter button
    await user.click(fatLossFilter);
    
    // The component filters locally first, then might fetch more
    // But we can check if the service was called with correct filters if it triggers a reload
  });

  it('switches between grid and list view modes', async () => {
    const user = userEvent.setup();
    render(<ExplorePlans onBack={mockOnBack} />);
    
    const listModeBtn = screen.getByLabelText(/List view/i);
    const gridModeBtn = screen.getByLabelText(/Grid view/i);
    
    expect(gridModeBtn).toHaveClass('bg-neon'); // Default is grid
    
    await user.click(listModeBtn);
    expect(listModeBtn).toHaveClass('bg-neon');
    expect(gridModeBtn).not.toHaveClass('bg-neon');
  });

  it('opens plan preview when preview button is clicked', async () => {
    const user = userEvent.setup();
    (exploreService.fetchPlanDetails as any).mockResolvedValue({
      ...mockPlans[0],
      planData: { some: 'data' }
    });

    render(<ExplorePlans onBack={mockOnBack} />);
    
    await waitFor(() => {
      expect(screen.getByText('Fat Loss Protocol')).toBeInTheDocument();
    });

    const previewBtn = screen.getByText(/Preview/i);
    await user.click(previewBtn);

    await waitFor(() => {
      expect(exploreService.fetchPlanDetails).toHaveBeenCalledWith('1');
    });
  });

  it('updates search state when typing in search bar', async () => {
    const user = userEvent.setup();
    render(<ExplorePlans onBack={mockOnBack} />);
    
    const searchInput = screen.getByPlaceholderText(/Search by title, goal, or level/i);
    await user.type(searchInput, 'muscle');
    
    expect(searchInput).toHaveValue('muscle');
  });
});
