import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MessageList } from "../components/MessageList";
import type { Message } from "../types/message";

describe("MessageList", () => {
  let messageList: MessageList;
  let container: HTMLDivElement;

  beforeEach(() => {
    // Create a container and add it to the document
    container = document.createElement("div");
    container.id = "messages-list";
    document.body.appendChild(container);

    // Create a new instance of MessageList
    messageList = new MessageList();
  });

  afterEach(() => {
    // Clean up the DOM
    document.body.removeChild(container);
  });

  describe("render", () => {
    it("should render a list of messages", () => {
      const messages: Message[] = [
        { id: 1, content: "Test message 1" },
        { id: 2, content: "Test message 2" },
      ];

      messageList.render(messages);

      const messageElements = container.querySelectorAll(".message");
      expect(messageElements).toHaveLength(2);
      expect(messageElements[0]?.textContent).toBe("Test message 1");
      expect(messageElements[1]?.textContent).toBe("Test message 2");
    });

    it("should scroll to bottom after rendering messages", () => {
      const messages: Message[] = [
        { id: 1, content: "Test message 1" },
        { id: 2, content: "Test message 2" },
      ];

      // Mock scrollHeight and scrollTop
      Object.defineProperty(container, "scrollHeight", { value: 1000 });
      Object.defineProperty(container, "scrollTop", {
        get: () => 0,
        set: (value) => {
          expect(value).toBe(1000); // Assert scroll to bottom
        },
      });

      messageList.render(messages);
    });
  });

  describe("appendMessage", () => {
    it("should append a single message to the list", () => {
      // First render some initial messages
      const initialMessages: Message[] = [{ id: 1, content: "Test message 1" }];
      messageList.render(initialMessages);

      // Then append a new message
      const newMessage: Message = { id: 2, content: "Test message 2" };
      messageList.appendMessage(newMessage);

      const messageElements = container.querySelectorAll(".message");
      expect(messageElements).toHaveLength(2);
      expect(messageElements[0]?.textContent).toBe("Test message 1");
      expect(messageElements[1]?.textContent).toBe("Test message 2");
    });

    it("should scroll to bottom after appending a message", () => {
      // Mock scrollHeight and scrollTop
      Object.defineProperty(container, "scrollHeight", { value: 1000 });
      Object.defineProperty(container, "scrollTop", {
        get: () => 0,
        set: (value) => {
          expect(value).toBe(1000); // Assert scroll to bottom
        },
      });

      const message: Message = { id: 1, content: "Test message" };
      messageList.appendMessage(message);
    });
  });

  describe("showError", () => {
    it("should display an error message", () => {
      messageList.showError();

      const errorElement = container.querySelector(".bg-red-100");
      expect(errorElement).toBeTruthy();
      expect(errorElement?.textContent).toContain("Failed to load messages");
    });
  });
});
