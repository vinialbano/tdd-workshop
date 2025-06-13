import { createServer } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "./app.js";

class StubMessageRepository {
  public messages = [
    { id: 1, content: "Hello" },
    { id: 2, content: "World" },
  ];
  public createdMessage: unknown = null;
  async getMessages() {
    return this.messages;
  }
  async createMessage(content: string) {
    const newMessage = { id: 3, content };
    this.createdMessage = newMessage;
    return newMessage;
  }
}

describe("API Server", () => {
  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    const app = createApp(new StubMessageRepository());
    server = createServer(app);
    server.listen(4000);
  });

  afterAll(() => {
    server.close();
  });

  it("should return 200 OK for the root endpoint", async () => {
    const response = await fetch("http://localhost:4000");
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      message: "Welcome to the TDD workshop!",
    });
  });

  it("should return the list of existing messages", async () => {
    const response = await fetch("http://localhost:4000/messages");
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    type Message = { id: number; content: string };
    for (const message of data as Message[]) {
      expect(message).toMatchObject({
        id: expect.any(Number),
        content: expect.any(String),
      });
    }
  });

  it("should should create a new message", async () => {
    const response = await fetch("http://localhost:4000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: "Hello, world!" }),
    });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toMatchObject({
      message: "Message created successfully",
      data: {
        content: "Hello, world!",
        id: expect.any(Number),
      },
    });
  });

  it("should return 404 for non-existent endpoints", async () => {
    const response = await fetch("http://localhost:4000/non-existent");
    expect(response.status).toBe(404);
  });
});
