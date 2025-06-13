import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MessageController } from "./message.controller.js";

class StubRepository {
  public messages = [
    { id: 1, content: "Hello" },
    { id: 2, content: "World" },
  ];
  public shouldThrow = false;
  public createShouldThrow = false;
  public createdMessage: unknown = null;

  async getMessages() {
    if (this.shouldThrow) throw new Error("DB error");
    return this.messages;
  }

  async createMessage(content: string) {
    if (this.createShouldThrow) throw new Error("DB error");
    const newMessage = { id: 3, content };
    this.createdMessage = newMessage;
    return newMessage;
  }
}

describe("Message Controller", () => {
  let controller: MessageController;
  let req: Partial<Request & { log?: { error: ReturnType<typeof vi.fn> } }>;
  let res: Partial<Response>;
  let repo: StubRepository;

  beforeEach(() => {
    repo = new StubRepository();
    controller = new MessageController(repo);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    req = { body: {}, log: { error: vi.fn() } as any };
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  it("should return a list of messages as an array", async () => {
    await controller.getMessages(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(repo.messages);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should handle db error and return 500", async () => {
    repo.shouldThrow = true;

    await controller.getMessages(req as Request, res as Response);

    expect(req.log?.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to fetch messages",
    });
  });

  it("should create a new message and return it", async () => {
    req.body = { content: "New message" };

    await controller.createMessage(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Message created successfully",
      data: { id: 3, content: "New message" },
    });
  });

  it("should return 400 if message content is missing", async () => {
    req.body = {};

    await controller.createMessage(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Message content is required",
    });
  });

  it("should return 400 if message content is empty string", async () => {
    req.body = { content: "   " };

    await controller.createMessage(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Message content is required",
    });
  });

  it("should handle db error on create and return 500", async () => {
    req.body = { content: "fail" };
    repo.createShouldThrow = true;

    await controller.createMessage(req as Request, res as Response);

    expect(req.log?.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to create message",
    });
  });
});
