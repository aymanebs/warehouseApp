import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import OnboardingScreen from '..';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));


jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

describe('OnboardingScreen', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<OnboardingScreen />);

  
    expect(getByText('Stock Manager')).toBeTruthy();

    expect(getByText('Effortless Inventory Management')).toBeTruthy();

    expect(getByText('Get Started')).toBeTruthy();
  });

  it('navigates to login screen when button is pressed', () => {
    const mockReplace = jest.fn();
    useRouter.mockReturnValue({ replace: mockReplace });

    const { getByText } = render(<OnboardingScreen />);

    fireEvent.press(getByText('Get Started'));

    expect(mockReplace).toHaveBeenCalledWith('/login');
  });
});