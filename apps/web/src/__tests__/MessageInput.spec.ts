import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MessageInput } from "../components/MessageInput";

describe("MessageInput", () => {
  let messageInput: MessageInput;
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    // Create an input element and add it to the document
    inputElement = document.createElement("input");
    inputElement.id = "message-input";
    document.body.appendChild(inputElement);

    // Create a new instance of MessageInput
    messageInput = new MessageInput();
  });

  afterEach(() => {
    // Clean up the DOM
    document.body.removeChild(inputElement);
  });

  describe("value", () => {
    it("should return trimmed input value", () => {
      inputElement.value = "  test message  ";
      expect(messageInput.value).toBe("test message");
    });

    it("should return empty string for whitespace-only input", () => {
      inputElement.value = "   ";
      expect(messageInput.value).toBe("");
    });
  });

  describe("clear", () => {
    it("should clear the input value", () => {
      inputElement.value = "test message";
      messageInput.clear();
      expect(inputElement.value).toBe("");
    });
  });

  describe("focus", () => {
    it("should focus the input element", () => {
      const focusSpy = vi.spyOn(inputElement, "focus");
      messageInput.focus();
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe("disable/enable", () => {
    it("should disable the input", () => {
      messageInput.disable();
      expect(inputElement.disabled).toBe(true);
    });

    it("should enable the input", () => {
      inputElement.disabled = true;
      messageInput.enable();
      expect(inputElement.disabled).toBe(false);
    });
  });

  describe("onEnterPress", () => {
    it("should call callback when Enter key is pressed", () => {
      const callback = vi.fn();
      messageInput.onEnterPress(callback);

      inputElement.dispatchEvent(
        new KeyboardEvent("keypress", { key: "Enter" }),
      );

      expect(callback).toHaveBeenCalled();
    });

    it("should not call callback when other keys are pressed", () => {
      const callback = vi.fn();
      messageInput.onEnterPress(callback);

      inputElement.dispatchEvent(new KeyboardEvent("keypress", { key: "a" }));

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
