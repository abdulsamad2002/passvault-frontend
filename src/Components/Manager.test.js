import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import Manager from "./Manager";
import { toast } from "react-toastify";

// Mock dependencies
jest.mock("react-toastify", () => ({
  toast: {
    info: jest.fn(),
  },
  ToastContainer: () => <div>ToastContainer</div>,
}));

jest.mock("./Logo", () => () => <div>Logo</div>);
jest.mock("./List", () => ({ website, username, password, ciphertext, handleDelete }) => (
  <div data-testid="list-item">
    <span>{website}</span>
    <span>{username}</span>
    <span>{password || "encrypted"}</span>
    <span>{ciphertext}</span>
    <button onClick={() => handleDelete("test-id")}>Delete</button>
  </div>
));

// Mock crypto.subtle
const mockCrypto = {
  subtle: {
    importKey: jest.fn(),
    deriveKey: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  },
  getRandomValues: jest.fn((arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }),
};

global.crypto = mockCrypto;

// Mock fetch
global.fetch = jest.fn();

describe("Manager Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe("Initial Render", () => {
    test("renders all form inputs", async () => {
      fetch.mockResolvedValueOnce({
        json: async () => [],
      });

      render(<Manager />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Website")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Master Password")).toBeInTheDocument();
      });
    });

    test("shows 'Vault Empty' when no records", async () => {
      fetch.mockResolvedValueOnce({
        json: async () => [],
      });

      render(<Manager />);

      await waitFor(() => {
        expect(screen.getByText("Vault Empty")).toBeInTheDocument();
      });
    });

    test("fetches records on mount", async () => {
      const mockRecords = [
        {
          id: "1",
          website: "example.com",
          username: "user1",
          ciphertext: "encrypted",
          salt: "salt",
          iv: "iv",
        },
      ];

      fetch.mockResolvedValueOnce({
        json: async () => mockRecords,
      });

      render(<Manager />);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith("http://localhost:3000/");
      });
    });
  });

  describe("Visibility Toggle", () => {
    test("toggles password visibility", async () => {
      fetch.mockResolvedValueOnce({
        json: async () => [],
      });

      render(<Manager />);

      const passwordInput = screen.getByPlaceholderText("Password");
      expect(passwordInput).toHaveAttribute("type", "password");

      const visibilityButtons = screen.getAllByRole("button", { name: "" });
      fireEvent.click(visibilityButtons[0]);

      expect(passwordInput).toHaveAttribute("type", "text");
    });
  });

  describe("Form Submission", () => {
    test("encrypts and saves password on form submit", async () => {
      fetch.mockResolvedValueOnce({
        json: async () => [],
      });

      const mockEncrypted = new ArrayBuffer(8);
      mockCrypto.subtle.importKey.mockResolvedValue("keyMaterial");
      mockCrypto.subtle.deriveKey.mockResolvedValue("derivedKey");
      mockCrypto.subtle.encrypt.mockResolvedValue(mockEncrypted);

      render(<Manager />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Website")).toBeInTheDocument();
      });

      const websiteInput = screen.getByPlaceholderText("Website");
      const usernameInput = screen.getByPlaceholderText("Username");
      const passwordInput = screen.getByPlaceholderText("Password");
      const masterPasswordInput = screen.getByPlaceholderText("Master Password");

      await userEvent.type(websiteInput, "example.com");
      await userEvent.type(usernameInput, "testuser");
      await userEvent.type(passwordInput, "testpass123");
      await userEvent.type(masterPasswordInput, "master123");

      const saveButton = screen.getByText("Save");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockCrypto.subtle.importKey).toHaveBeenCalled();
        expect(mockCrypto.subtle.deriveKey).toHaveBeenCalled();
        expect(mockCrypto.subtle.encrypt).toHaveBeenCalled();
      });
    });

    test("requires all fields to be filled", async () => {
      fetch.mockResolvedValueOnce({
        json: async () => [],
      });

      render(<Manager />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Website")).toBeInTheDocument();
      });

      const saveButton = screen.getByText("Save");
      fireEvent.click(saveButton);

      // Form should not submit without required fields
      await waitFor(() => {
        expect(mockCrypto.subtle.encrypt).not.toHaveBeenCalled();
      });
    });
  });

  describe("Decryption", () => {
    test("decrypts passwords successfully", async () => {
      const mockRecords = [
        {
          id: "1",
          website: "example.com",
          username: "user1",
          ciphertext: btoa("encrypted"),
          salt: btoa("salt"),
          iv: btoa("iv"),
        },
      ];

      fetch.mockResolvedValueOnce({
        json: async () => mockRecords,
      });

      mockCrypto.subtle.importKey.mockResolvedValue("keyMaterial");
      mockCrypto.subtle.deriveKey.mockResolvedValue("derivedKey");
      mockCrypto.subtle.decrypt.mockResolvedValue(
        new TextEncoder().encode("decryptedPassword")
      );

      render(<Manager />);

      await waitFor(() => {
        expect(screen.getByText("Decrypt")).toBeInTheDocument();
      });

      const masterPasswordInput = screen.getByPlaceholderText("Master Password");
      await userEvent.type(masterPasswordInput, "master123");

      const decryptButton = screen.getByText("Decrypt");
      fireEvent.click(decryptButton);

      await waitFor(() => {
        expect(mockCrypto.subtle.decrypt).toHaveBeenCalled();
      });
    });

    test("shows error toast on decryption failure", async () => {
      const mockRecords = [
        {
          id: "1",
          website: "example.com",
          username: "user1",
          ciphertext: btoa("encrypted"),
          salt: btoa("salt"),
          iv: btoa("iv"),
        },
      ];

      fetch.mockResolvedValueOnce({
        json: async () => mockRecords,
      });

      mockCrypto.subtle.importKey.mockResolvedValue("keyMaterial");
      mockCrypto.subtle.deriveKey.mockResolvedValue("derivedKey");
      mockCrypto.subtle.decrypt.mockRejectedValue(new Error("Decryption failed"));

      render(<Manager />);

      await waitFor(() => {
        expect(screen.getByText("Decrypt")).toBeInTheDocument();
      });

      const masterPasswordInput = screen.getByPlaceholderText("Master Password");
      await userEvent.type(masterPasswordInput, "wrongpassword");

      const decryptButton = screen.getByText("Decrypt");
      fireEvent.click(decryptButton);

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(
          "Decryption failed! Possible wrong key or corrupted data",
          expect.any(Object)
        );
      });
    });
  });

  describe("Delete Functionality", () => {
    test("deletes a record", async () => {
      const mockRecords = [
        {
          id: "test-id",
          website: "example.com",
          username: "user1",
          ciphertext: "encrypted",
          salt: "salt",
          iv: "iv",
        },
      ];

      fetch.mockResolvedValueOnce({
        json: async () => mockRecords,
      });

      render(<Manager />);

      await waitFor(() => {
        expect(screen.getByTestId("list-item")).toBeInTheDocument();
      });

      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(
          "Deleted successfully!",
          expect.any(Object)
        );
      });
    });
  });

  describe("Data Persistence", () => {
    test("saves records to backend after delay", async () => {
      jest.useFakeTimers();

      fetch
        .mockResolvedValueOnce({
          json: async () => [],
        })
        .mockResolvedValueOnce({
          json: async () => ({}),
        });

      const mockEncrypted = new ArrayBuffer(8);
      mockCrypto.subtle.importKey.mockResolvedValue("keyMaterial");
      mockCrypto.subtle.deriveKey.mockResolvedValue("derivedKey");
      mockCrypto.subtle.encrypt.mockResolvedValue(mockEncrypted);

      render(<Manager />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Website")).toBeInTheDocument();
      });

      const websiteInput = screen.getByPlaceholderText("Website");
      const usernameInput = screen.getByPlaceholderText("Username");
      const passwordInput = screen.getByPlaceholderText("Password");
      const masterPasswordInput = screen.getByPlaceholderText("Master Password");

      await userEvent.type(websiteInput, "example.com");
      await userEvent.type(usernameInput, "testuser");
      await userEvent.type(passwordInput, "testpass123");
      await userEvent.type(masterPasswordInput, "master123");

      const saveButton = screen.getByText("Save");
      fireEvent.click(saveButton);

      act(() => {
        jest.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          "http://localhost:3000/",
          expect.objectContaining({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
        );
      });

      jest.useRealTimers();
    });
  });

  describe("Utility Functions", () => {
    test("base64 encoding and decoding works correctly", () => {
      const originalData = new Uint8Array([1, 2, 3, 4, 5]);
      const encoded = btoa(String.fromCharCode(...originalData));
      const decoded = atob(encoded);
      
      expect(decoded.length).toBe(originalData.length);
    });
  });
});