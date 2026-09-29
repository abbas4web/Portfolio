import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders name heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Shaikh Abbas/i);
  expect(headingElement).toBeInTheDocument();
});
