import type {
  Message,
  MessageRepository,
} from "../controllers/message.repository.js";
import { db } from "./db/knex.js";

export class KnexMessageRepository implements MessageRepository {
  async getMessages(): Promise<Message[]> {
    try {
      return await db("messages").select("id", "content").orderBy("id");
    } catch (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }

  async createMessage(content: string): Promise<Message> {
    try {
      const [newMessage] = await db("messages")
        .insert({ content })
        .returning(["id", "content"]);
      return newMessage;
    } catch (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }
  }
}
