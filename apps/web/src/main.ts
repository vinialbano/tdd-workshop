import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Element #app not found');

app.innerHTML = `
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-6xl mx-auto px-4">
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

    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900">Welcome to the TDD Workshop</h1>
      <p class="mt-4 text-gray-600">This is a vanilla TypeScript + Vite + Tailwind CSS setup.</p>
    </main>
  </div>
`;
