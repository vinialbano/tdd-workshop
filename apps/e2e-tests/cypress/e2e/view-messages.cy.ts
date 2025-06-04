describe("View Messages", () => {
  it("should display messages and allow scrolling to see all messages", () => {
    cy.visit("/");
    // Wait for the "Messages" text to appear
    cy.contains("Messages").should("be.visible");

    // Get all messages and verify they are visible after scrolling
    cy.get("div.message p").then(($messages) => {
      const totalMessages = $messages.length;
      expect(totalMessages).to.be.greaterThan(0);

      // Scroll through each message and verify it becomes visible
      $messages.each((_index, message) => {
        cy.wrap(message).scrollIntoView();
        cy.wrap(message).should("be.visible");
      });
    });
  });
});
