import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Message } from "../controllers/message.repository.js";
import db from "./db/knex.js";
import { KnexMessageRepository } from "./knex-message.repository.js";

vi.mock("./db/knex.js", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("KnexMessageRepository", () => {
  let repo: KnexMessageRepository;

  beforeEach(() => {
    repo = new KnexMessageRepository();
    vi.clearAllMocks();
  });

  it("fetches messages from the database", async () => {
    const fakeMessages: Message[] = [
      { id: 1, content: "Hello" },
      { id: 2, content: "World" },
    ];
    (db as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue(fakeMessages),
    });
    const result = await repo.getMessages();
    expect(result).toEqual(fakeMessages);
  });

  it("creates a new message in the database", async () => {
    const newMessage: Message = { id: 3, content: "New message" };
    (db as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([newMessage]),
    });
    const result = await repo.createMessage("New message");
    expect(result).toEqual(newMessage);
  });

  it("throws an error if getMessages fails", async () => {
    (db as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockRejectedValue(new Error("DB error")),
    });
    await expect(repo.getMessages()).rejects.toThrow(
      "Failed to fetch messages",
    );
  });

  it("throws an error if createMessage fails", async () => {
    (db as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      returning: vi.fn().mockRejectedValue(new Error("DB error")),
    });
    await expect(repo.createMessage("fail")).rejects.toThrow(
      "Failed to create message",
    );
  });
});
