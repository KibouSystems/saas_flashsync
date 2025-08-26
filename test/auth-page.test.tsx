import { render, screen, fireEvent } from '@testing-library/react';
import AuthPage from '@/app/auth/page'; 
import { useRouter } from "next/navigation";


jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('AuthPage', () => {
  it('renders login inputs and buttons initially', () => {
    render(<AuthPage />);

    // Login form inputs
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    // Login buttons
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('toggles to SignUp form when clicking "Sign Up" button', () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Signup form inputs
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('toggles back to Login form from SignUp form', () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});