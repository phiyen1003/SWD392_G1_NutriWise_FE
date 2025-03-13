import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import axios from "axios";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Chào bạn! Tôi là NutriWise AI, sử dụng mô hình từ Hugging Face. Vui lòng hỏi bằng tiếng Anh để nhận câu trả lời chính xác (ví dụ: 'What are the benefits of healthy eating?'). Tôi có thể giúp gì cho bạn hôm nay?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy API Token từ biến môi trường
  const API_TOKEN = import.meta.env.VITE_HUGGING_FACE_TOKEN || "";

  // Kiểm tra xem API_TOKEN có tồn tại không
  useEffect(() => {
    if (!API_TOKEN) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Cảnh báo: API Token của Hugging Face không được tìm thấy. Vui lòng kiểm tra file .env và đảm bảo biến VITE_HUGGING_FACE_TOKEN đã được thiết lập.",
          sender: "bot",
        },
      ]);
    }
  }, [API_TOKEN]);

  // Scroll to bottom khi messages thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hàm gọi API Hugging Face
  const callHuggingFaceAPI = async (question: string): Promise<string> => {
    if (!API_TOKEN) {
      return "Lỗi: API Token của Hugging Face không được tìm thấy.";
    }

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
        {
          inputs: question,
          parameters: {
            max_length: 100,
            temperature: 0.7,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Kiểm tra phản hồi từ API
      if (response.data && response.data[0] && response.data[0].generated_text) {
        return response.data[0].generated_text;
      } else {
        return "Mình không hiểu câu hỏi, bạn có thể hỏi lại không?";
      }
    } catch (err) {
      console.error("Error calling Hugging Face API:", err);
      return "Lỗi khi gọi API Hugging Face, vui lòng thử lại sau!";
    }
  };

  // Gửi tin nhắn
  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    // Gọi API Hugging Face để lấy phản hồi
    const botResponseText = await callHuggingFaceAPI(input);
    const botResponse: Message = { text: botResponseText, sender: "bot" };
    setMessages((prev) => [...prev, botResponse]);
  }, [input]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "20px", // Tăng độ cong của góc cho mềm mại hơn
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        border: "2px solid #DBEAFE", // Đồng bộ viền với HomePage
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "12px",
          backgroundColor: "#3B82F6", // Chuyển sang xanh dương
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: "600",
          borderBottom: "2px solid #DBEAFE", // Viền xanh dương nhạt
        }}
      >
        NutriWise AI Chat (Hugging Face)
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px", // Tăng padding để thoáng hơn
          backgroundColor: "#F9FAFB",
          scrollbarWidth: "thin", // Tùy chỉnh scrollbar
          scrollbarColor: "#3B82F6 #DBEAFE", // Màu scrollbar xanh dương
        }}
      >
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "12px", // Tăng khoảng cách giữa các tin nhắn
            }}
          >
            <div
              style={{
                padding: "12px 16px", // Tăng padding ngang để thoáng hơn
                maxWidth: "80%", // Tăng maxWidth để tin nhắn không quá hẹp
                backgroundColor: msg.sender === "user" ? "#3B82F6" : "#EFF6FF", // User: xanh dương, Bot: xanh nhạt
                color: msg.sender === "user" ? "#FFFFFF" : "#1F2937",
                borderRadius: "16px", // Tăng độ cong của tin nhắn
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                fontSize: "15px", // Tăng nhẹ kích thước chữ cho dễ đọc
                border: msg.sender === "user" ? "none" : "1px solid #DBEAFE", // Viền nhẹ cho tin nhắn của bot
              }}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          display: "flex",
          padding: "12px", // Tăng padding để thoáng hơn
          borderTop: "2px solid #DBEAFE", // Viền xanh dương nhạt
          backgroundColor: "#FFFFFF",
          gap: "12px", // Tăng khoảng cách giữa input và nút
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Hỏi bằng tiếng Anh (ví dụ: What are the benefits of healthy eating?)..."
          style={{
            flex: 1,
            padding: "10px 16px", // Tăng padding để input thoáng hơn
            border: "1px solid #D1D5DB",
            borderRadius: "12px", // Tăng độ cong của input
            fontSize: "15px", // Tăng nhẹ kích thước chữ
            outline: "none",
            backgroundColor: "#FFFFFF",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3B82F6"; // Xanh dương khi focus
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"; // Hiệu ứng bóng nhẹ
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#D1D5DB";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 16px", // Tăng padding cho nút gửi
            backgroundColor: "#3B82F6", // Chuyển sang xanh dương
            borderRadius: "12px", // Tăng độ cong của nút
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.3s, transform 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#2563EB"; // Xanh dương đậm khi hover
            e.currentTarget.style.transform = "scale(1.05)"; // Hiệu ứng phóng to nhẹ
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#3B82F6";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Send style={{ height: "20px", width: "20px", color: "#FFFFFF" }} />
        </button>
      </div>
    </div>
  );
};

export default AIChat;