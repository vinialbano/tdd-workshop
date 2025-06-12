import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Chat } from "../components/Chat";
import type { Message } from "../types/message";

// Mock the window.alert
const mockAlert = vi.fn();
window.alert = mockAlert;

describe("Chat", () => {
  let chat: Chat;

  // Create DOM elements
  beforeEach(() => {
    // Create required DOM elements
    const messagesList = document.createElement("div");
    messagesList.id = "messages-list";
    document.body.appendChild(messagesList);

    const messageInput = document.createElement("input");
    messageInput.id = "message-input";
    document.body.appendChild(messageInput);

    const sendButton = document.createElement("button");
    sendButton.id = "send-button";
    document.body.appendChild(sendButton);

    // Create chat instance
    chat = new Chat();
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  describe("init", () => {
    it("should load messages and set up event listeners", async () => {
      const mockMessages: Message[] = [
        { id: 1, content: "Test message 1" },
        { id: 2, content: "Test message 2" },
      ];

      // Mock fetch for initial messages load
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMessages),
      });

      await chat.init();

      // Verify messages were loaded
      const messageElements = document.querySelectorAll(".message");
      expect(messageElements).toHaveLength(2);
      expect(messageElements[0]?.textContent).toBe("Test message 1");
      expect(messageElements[1]?.textContent).toBe("Test message 2");
    });

    it("should handle error when loading messages fails", async () => {
      // Mock fetch to fail
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error",
      });

      await chat.init();

      // Verify error message is shown
      const errorElement = document.querySelector(".bg-red-100");
      expect(errorElement?.textContent).toContain("Failed to load messages");
    });
  });

  describe("message sending", () => {
    beforeEach(async () => {
      // Mock successful initial messages load
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });
      await chat.init();
    });

    it("should send message and append it to the list", async () => {
      const messageInput = document.getElementById(
        "message-input",
      ) as HTMLInputElement;
      const sendButton = document.getElementById(
        "send-button",
      ) as HTMLButtonElement;

      // Set up message input
      messageInput.value = "New test message";

      // Mock successful message send
      const newMessage: Message = { id: 1, content: "New test message" };
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: newMessage }),
      });

      // Trigger send
      sendButton.click();

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Verify UI state
      expect(messageInput.value).toBe("");
      expect(messageInput.disabled).toBe(false);
      expect(sendButton.textContent).toBe("Send");
      expect(sendButton.disabled).toBe(false);

      // Verify message was added
      const messageElements = document.querySelectorAll(".message");
      expect(messageElements).toHaveLength(1);
      expect(messageElements[0]?.textContent).toBe("New test message");
    });

    it("should handle send message failure", async () => {
      const messageInput = document.getElementById(
        "message-input",
      ) as HTMLInputElement;
      const sendButton = document.getElementById(
        "send-button",
      ) as HTMLButtonElement;

      // Set up message input
      messageInput.value = "Test message";

      // Mock failed message send
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error",
      });

      // Trigger send
      sendButton.click();

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Verify error handling
      expect(mockAlert).toHaveBeenCalledWith(
        "Failed to send message. Please try again.",
      );
      expect(messageInput.disabled).toBe(false);
      expect(sendButton.textContent).toBe("Send");
      expect(sendButton.disabled).toBe(false);
    });

    it("should not send empty messages", async () => {
      const messageInput = document.getElementById(
        "message-input",
      ) as HTMLInputElement;
      const sendButton = document.getElementById(
        "send-button",
      ) as HTMLButtonElement;

      // Set up empty message
      messageInput.value = "   ";

      // Mock fetch (should not be called)
      const fetchSpy = vi.fn();
      global.fetch = fetchSpy;

      // Trigger send
      sendButton.click();

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Verify no API call was made
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });
});
