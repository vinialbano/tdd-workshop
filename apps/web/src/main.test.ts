import { describe, expect, it } from "vitest";

describe("Web Application", () => {
  it("should render the main content", async () => {
    // Create the app container
    const app = document.createElement("div");
    app.id = "app";
    document.body.appendChild(app);

    // Import the main file and wait for it to complete
    await import("./main.js");

    // Basic content check
    expect(app.innerHTML).toContain("TDD Workshop");
    expect(app.innerHTML).toContain("Welcome to the TDD Workshop");
  });
});
