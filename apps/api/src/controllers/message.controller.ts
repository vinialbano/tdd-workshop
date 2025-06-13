import type { Request, Response } from "express";
import type { MessageRepository } from "./message.repository.js";

export class MessageController {
  constructor(private readonly messageRepository: MessageRepository) {}

  async getMessages(req: Request, res: Response) {
    try {
      const messages = await this.messageRepository.getMessages();
      res.json(messages);
    } catch (error) {
      req.log.error(error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  }

  async createMessage(req: Request, res: Response) {
    try {
      const { content } = req.body;
      if (
        !content ||
        typeof content !== "string" ||
        content.trim().length === 0
      ) {
        const error = "Message content is required";
        req.log.error(error);
        return res.status(400).json({ error });
      }

      const message = await this.messageRepository.createMessage(content);
      res.status(201).json({
        message: "Message created successfully",
        data: message,
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).json({ error: "Failed to create message" });
    }
  }
}
