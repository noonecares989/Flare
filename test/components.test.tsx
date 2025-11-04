import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test Button</Button>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toHaveClass('custom-class');
  });
});