import "./style.css";
import type { Message } from "./types/message";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Element #app not found");

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function fetchMessages(): Promise<Message[]> {
  const response = await fetch(`${API_URL}/messages`);
  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`);
  }
  return response.json();
}

async function sendMessage(content: string): Promise<void> {
  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
}

function scrollToBottom() {
  // Find the scrollable messages container
  const messagesContainer = document.querySelector(
    ".space-y-2.overflow-y-auto.h-full.p-4",
  );
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

async function renderMessages() {
  if (!app) return;

  try {
    const messages = await fetchMessages();
    const messagesHtml = messages
      .map(
        (message) => `
          <div class="flex justify-end mb-4">
            <div class="message bg-blue-500 text-white rounded-lg py-2 px-4 max-w-[70%] shadow-md">
              <p class="text-sm">${message.content}</p>
            </div>
          </div>
        `,
      )
      .join("");

    app.innerHTML = `
      <div class="min-h-screen bg-gray-100 flex flex-col">
        <nav class="bg-white shadow-lg">
          <div class="max-w-6xl mx-auto">
            <div class="flex justify-between">
              <div class="flex space-x-7">
                <div>
                  <a href="/" class="flex items-center py-4">
                    <span class="font-semibold text-gray-500 text-lg">TDD Workshop</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main class="flex-1 container mx-auto px-4 py-8">
          <div class="max-w-6xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
            <div class="bg-white rounded-lg shadow-lg p-2 h-[calc(100vh-17rem)]">
              <div class="space-y-2 overflow-y-auto h-full p-4">
                ${messagesHtml}
              </div>
            </div>

            <!-- Send Message Section -->
            <div class="bg-white rounded-lg shadow-lg p-4 mt-4">
              <div class="flex space-x-3">
                <input
                  type="text"
                  id="messageInput"
                  placeholder="Type your message here..."
                  class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                <button
                  id="sendButton"
                  class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching messages:", error);
    app.innerHTML = `
      <div class="min-h-screen bg-gray-100 flex flex-col">
        <nav class="bg-white shadow-lg">
          <div class="max-w-6xl mx-auto">
            <div class="flex justify-between">
              <div class="flex space-x-7">
                <div>
                  <a href="/" class="flex items-center py-4">
                    <span class="font-semibold text-gray-500 text-lg">TDD Workshop</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main class="flex-1 container mx-auto px-4 py-8">
          <div class="max-w-6xl mx-auto">
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Failed to load messages. Please try again later.</p>
            </div>

            <!-- Send Message Section -->
            <div class="bg-white rounded-lg shadow-lg p-4 mt-4">
              <div class="flex space-x-3">
                <input
                  type="text"
                  id="messageInput"
                  placeholder="Type your message here..."
                  class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                <button
                  id="sendButton"
                  class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  }
}

function setupEventListeners() {
  // Use event delegation - attach to document so it survives DOM updates
  document.addEventListener("click", async (e) => {
    if ((e.target as HTMLElement)?.id === "sendButton") {
      await handleSendMessage();
    }
  });

  document.addEventListener("keypress", async (e) => {
    if (e.key === "Enter" && (e.target as HTMLElement)?.id === "messageInput") {
      await handleSendMessage();
    }
  });
}

async function handleSendMessage() {
  const sendButton = document.getElementById("sendButton") as HTMLButtonElement;
  const messageInput = document.getElementById(
    "messageInput",
  ) as HTMLInputElement;

  if (!sendButton || !messageInput) return;

  const content = messageInput.value.trim();
  if (!content) return;

  try {
    // Disable button and input while sending
    sendButton.textContent = "Sending...";
    sendButton.disabled = true;
    messageInput.disabled = true;

    await sendMessage(content);

    // Clear input and refresh messages
    messageInput.value = "";
    await renderMessages();

    // Scroll to bottom to show the new message
    scrollToBottom();

    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send message. Please try again.");
  } finally {
    // Re-enable button and input (get fresh references in case DOM was updated)
    const currentSendButton = document.getElementById(
      "sendButton",
    ) as HTMLButtonElement;
    const currentMessageInput = document.getElementById(
      "messageInput",
    ) as HTMLInputElement;

    if (currentSendButton) {
      currentSendButton.textContent = "Send";
      currentSendButton.disabled = false;
    }
    if (currentMessageInput) {
      currentMessageInput.disabled = false;
      currentMessageInput.focus();
    }
  }
}

async function init() {
  await renderMessages();
  setupEventListeners();
}

init();
