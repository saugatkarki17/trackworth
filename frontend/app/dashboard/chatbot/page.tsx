'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return; 

    const userMessage: { role: 'user' | 'assistant'; content: string } = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const res = await fetch('/api/llama', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">💬 Financial Chatbot</h1>
      <div className="h-80 overflow-y-scroll border rounded p-3 bg-gray-100 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <p><strong>{m.role === 'user' ? 'You' : 'Bot'}:</strong> {m.content}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border p-2 flex-grow rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about finance..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
}
