import { render, screen, fireEvent } from "@testing-library/react";
import AuthPage from "../src/app/auth/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn(),
}));

beforeAll(() => {
  window.alert = jest.fn();
});

describe("AuthPage", () => {
  it("renders login inputs and buttons initially", () => {
    render(<AuthPage />);
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Login" })
    ).toBeInTheDocument();

    // Google sign-in button
    expect(
      screen.getByRole("button", { name: "Sign in with Google" })
    ).toBeInTheDocument();
  });

  it("toggles to SignUp form when clicking 'Sign Up' button", () => {
    render(<AuthPage />);

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm Password")
    ).toBeInTheDocument();
  });

  it("toggles back to Login form from SignUp form", () => {
    render(<AuthPage />);

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("shows alert when passwords do not match on Sign Up", () => {
    render(<AuthPage />);

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
  });
});
