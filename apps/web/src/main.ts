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
        `
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
            <div class="bg-white rounded-lg shadow-lg p-2 h-[calc(100vh-12rem)]">
              <div class="space-y-2 overflow-y-auto h-full p-4">
                ${messagesHtml}
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
          </div>
        </main>
      </div>
    `;
  }
}

renderMessages();
