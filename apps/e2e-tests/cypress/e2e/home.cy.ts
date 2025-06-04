describe("Homepage", () => {
  it("should display the setup message", () => {
    cy.visit("/");
    cy.contains("This is a vanilla TypeScript + Vite + Tailwind CSS setup.");
  });
});
