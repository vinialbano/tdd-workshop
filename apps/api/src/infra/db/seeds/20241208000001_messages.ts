import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("messages").del();

  // Inserts seed entries
  await knex("messages").insert([
    { content: "Hello, welcome to the TDD Workshop!" },
    { content: "This is a test message" },
    { content: "Feel free to explore the application" },
    { content: "Learning Test-Driven Development is fun!" },
    { content: "Remember to write tests first" },
    { content: "Red, Green, Refactor - the TDD cycle" },
    { content: "Testing helps catch bugs early" },
    { content: "Good tests make good documentation" },
    { content: "Confidence in your code comes from tests" },
    { content: "TDD helps with better design decisions" },
    { content: "Automated tests save time in the long run" },
    { content: "Test coverage is important but not everything" },
    { content: "Unit tests should be fast and isolated" },
    { content: "Integration tests verify components work together" },
    { content: "End-to-end tests validate the whole system" },
    { content: "Mocking helps isolate test subjects" },
    { content: "Test doubles can be stubs, spies, or mocks" },
    { content: "Behavior-driven development extends TDD" },
    { content: "Continuous integration runs tests automatically" },
    { content: "Happy testing!" },
  ]);
}
