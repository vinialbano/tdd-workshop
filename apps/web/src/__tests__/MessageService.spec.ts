import { beforeEach, describe, expect, it, vi } from "vitest";
import { MessageService } from "../services/MessageService";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("MessageService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("fetchMessages", () => {
    it("should fetch messages from the API", async () => {
      const mockMessages = [
        { id: 1, content: "Test message 1" },
        { id: 2, content: "Test message 2" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMessages),
      });

      const service = new MessageService("http://test-api");
      const messages = await service.fetchMessages();

      expect(mockFetch).toHaveBeenCalledWith("http://test-api/messages");
      expect(messages).toEqual(mockMessages);
    });

    it("should throw an error when the API request fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error",
      });

      const service = new MessageService("http://test-api");
      await expect(service.fetchMessages()).rejects.toThrow(
        "Failed to fetch messages: Internal Server Error",
      );
    });
  });

  describe("sendMessage", () => {
    it("should send a message to the API", async () => {
      const mockMessage = { id: 1, content: "Test message" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockMessage }),
      });

      const service = new MessageService("http://test-api");
      const result = await service.sendMessage("Test message");

      expect(mockFetch).toHaveBeenCalledWith("http://test-api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: "Test message" }),
      });
      expect(result).toEqual(mockMessage);
    });

    it("should throw an error when the API request fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Bad Request",
      });

      const service = new MessageService("http://test-api");
      await expect(service.sendMessage("Test message")).rejects.toThrow(
        "Failed to send message: Bad Request",
      );
    });
  });
});
