import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "../src/app/workflows/email/page"; // adjust path if needed
import { useSession } from "next-auth/react";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn();

describe("Page Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user email from session", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "test@example.com" } },
    });

    render(<Page />);

    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
  });

  it("shows alert if no file is uploaded", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "test@example.com" } },
    });

    window.alert = jest.fn();

    render(<Page />);
    fireEvent.click(screen.getByText("Send Emails"));

    expect(window.alert).toHaveBeenCalledWith("Please upload a CSV file.");
  });

  it("uploads file and sends email request successfully", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "test@example.com" } },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sent: 5 }),
    });

    render(<Page />);

    // Fill subject & body
    fireEvent.change(screen.getByLabelText("Enter Subject:"), {
      target: { value: "Hello" },
    });
    fireEvent.change(screen.getByLabelText("Enter Body:"), {
      target: { value: "This is a test" },
    });

    // Upload a file
    const file = new File(["email"], "test.csv", { type: "text/csv" });
    fireEvent.change(screen.getByLabelText(/Upload CSV/), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText("Send Emails"));

    await waitFor(() => {
      expect(screen.getByText("✅ Emails sent: 5")).toBeInTheDocument();
    });
  });

  it("shows error when API fails", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "test@example.com" } },
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Something went wrong" }),
    });

    render(<Page />);

    const file = new File(["email"], "test.csv", { type: "text/csv" });
    fireEvent.change(screen.getByLabelText(/Upload CSV/), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText("Send Emails"));

    await waitFor(() => {
      expect(
        screen.getByText("❌ Error: Something went wrong")
      ).toBeInTheDocument();
    });
  });
});
