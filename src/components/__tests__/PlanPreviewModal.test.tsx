import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PlanPreviewModal from '../PlanPreviewModal';
import { ExplorePlan } from '../../types';

describe('PlanPreviewModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnDownload = vi.fn();

  const mockPlan: ExplorePlan = {
    id: '1',
    title: 'Elite Strength Protocol',
    goal: 'Strength',
    level: 'Advanced',
    duration: '12 Weeks',
    location: 'Gym',
    dietType: 'High Protein',
    tags: ['strength', 'powerlifting'],
    rating: 4.9,
    downloads: 1250,
    createdAt: new Date(),
    preview: {
      summary: 'Test summary',
      calories: '2800'
    },
    planData: {
      personalizedSummary: 'Full summary here',
      workout: {
        weeklySplit: [
          { day: 'Monday', focus: 'Squats', dayPurpose: 'Strength', exercises: [] },
          { day: 'Tuesday', focus: 'Bench', dayPurpose: 'Strength', exercises: [] },
          { day: 'Wednesday', focus: 'Rest', dayPurpose: 'Recovery', exercises: [] },
          { day: 'Thursday', focus: 'Deadlift', dayPurpose: 'Strength', exercises: [] },
          { day: 'Friday', focus: 'Press', dayPurpose: 'Strength', exercises: [] }
        ]
      },
      diet: {
        dailyCalories: '2800',
        macros: { protein: '200g', carbs: '300g', fats: '80g' },
        weeklySchedule: [
          {
            day: 'Monday',
            meals: [
              { name: 'Breakfast', options: ['Oatmeal'], alternatives: 'Eggs' }
            ]
          }
        ]
      },
      safetyNotes: [],
      coachingTips: [],
      dietStrategyTips: []
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders plan details correctly', () => {
    render(<PlanPreviewModal plan={mockPlan} onClose={mockOnClose} onDownload={mockOnDownload} />);
    
    expect(screen.getByText(mockPlan.title)).toBeInTheDocument();
    expect(screen.getByText(/12 Weeks/i)).toBeInTheDocument();
    expect(screen.getByText(/Strength/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlanPreviewModal plan={mockPlan} onClose={mockOnClose} onDownload={mockOnDownload} />);
    
    const closeBtn = screen.getByRole('button', { name: '' }); // The X icon button
    // Since it doesn't have an aria-label, I'll find it by the SVG or just use the first button if I'm sure
    // Actually, I should probably add an aria-label to the close button in the component too.
    // For now, let's try to find it by the X icon or index.
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]); // The X button is the first one in the header
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onDownload when unlock button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlanPreviewModal plan={mockPlan} onClose={mockOnClose} onDownload={mockOnDownload} />);
    
    const downloadBtn = screen.getByText(/Unlock Full Protocol/i);
    await user.click(downloadBtn);
    
    expect(mockOnDownload).toHaveBeenCalled();
  });

  it('renders workout structure teaser', () => {
    render(<PlanPreviewModal plan={mockPlan} onClose={mockOnClose} onDownload={mockOnDownload} />);
    
    expect(screen.getByText(/Squats/i)).toBeInTheDocument();
    expect(screen.getByText(/Bench/i)).toBeInTheDocument();
    expect(screen.getByText(/\+ 1 More Days/i)).toBeInTheDocument();
  });

  it('renders diet strategy teaser', () => {
    render(<PlanPreviewModal plan={mockPlan} onClose={mockOnClose} onDownload={mockOnDownload} />);
    
    expect(screen.getByText('2800')).toBeInTheDocument();
    expect(screen.getByText('200g')).toBeInTheDocument();
    expect(screen.getByText('300g')).toBeInTheDocument();
  });

  it('renders unavailable message if planData is missing', () => {
    const planWithoutData = { ...mockPlan, planData: undefined };
    render(<PlanPreviewModal plan={planWithoutData} onClose={mockOnClose} onDownload={mockOnDownload} />);
    
    expect(screen.getByText(/Plan details are currently unavailable/i)).toBeInTheDocument();
  });
});
