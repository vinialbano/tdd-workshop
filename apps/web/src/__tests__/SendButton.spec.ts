import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SendButton } from "../components/SendButton";

describe("SendButton", () => {
  let sendButton: SendButton;
  let buttonElement: HTMLButtonElement;

  beforeEach(() => {
    // Create a button element and add it to the document
    buttonElement = document.createElement("button");
    buttonElement.id = "send-button";
    document.body.appendChild(buttonElement);

    // Create a new instance of SendButton
    sendButton = new SendButton();
  });

  afterEach(() => {
    // Clean up the DOM
    document.body.removeChild(buttonElement);
  });

  describe("onClick", () => {
    it("should register click callback", () => {
      const callback = vi.fn();
      sendButton.onClick(callback);

      buttonElement.click();

      expect(callback).toHaveBeenCalled();
    });
  });

  describe("setLoading", () => {
    it("should set loading state", () => {
      sendButton.setLoading();

      expect(buttonElement.textContent).toBe("Sending...");
      expect(buttonElement.disabled).toBe(true);
    });
  });

  describe("setReady", () => {
    it("should set ready state", () => {
      // First set to loading state
      buttonElement.textContent = "Sending...";
      buttonElement.disabled = true;

      // Then set to ready state
      sendButton.setReady();

      expect(buttonElement.textContent).toBe("Send");
      expect(buttonElement.disabled).toBe(false);
    });
  });
});
