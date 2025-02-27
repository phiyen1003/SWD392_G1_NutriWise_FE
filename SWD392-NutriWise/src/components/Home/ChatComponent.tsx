import React, { useState } from "react";

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    try {
        const response = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages }),
        });
      
        const data = await response.json();
        console.log("Phản hồi từ server:", data); // Kiểm tra response
        setMessages([...newMessages, { role: "ai", content: data.reply }]);
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
      }
    }

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
      <div className="mb-4">
        {messages.map((m, index) => (
          <div
            key={index}
            className="mb-2 p-2 rounded"
            style={{ backgroundColor: m.role === "user" ? "#e2f7fe" : "#f0f0f0" }}
          >
            <strong>{m.role === "user" ? "Bạn: " : "AI: "}</strong>
            <span>{m.content}</span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Gửi
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
