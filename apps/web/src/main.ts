import { Chat } from "./components/Chat";
import "./style.css";

// Only initialize if this is the main module and not in test mode
if (typeof window !== "undefined" && !import.meta.env?.TEST) {
  const chat = new Chat();
  chat.init().catch(console.error);
}
