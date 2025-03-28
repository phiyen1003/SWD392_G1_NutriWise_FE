// // import React, { useState, useRef, useEffect, useCallback } from "react";
// // import { motion } from "framer-motion";
// // import { Send } from "lucide-react";
// // import axios from "axios";

// // interface Message {
// //   text: string;
// //   sender: "user" | "bot";
// // }

// // const AIChat: React.FC = () => {
// //   const [messages, setMessages] = useState<Message[]>([
// //     {
// //       text: "Chào bạn! Tôi là NutriWise AI, sử dụng mô hình OpenAI ChatGPT. Vui lòng hỏi bằng tiếng Anh để nhận câu trả lời chính xác (ví dụ: 'What are the benefits of healthy eating?'). Tôi có thể giúp gì cho bạn hôm nay?",
// //       sender: "bot",
// //     },
// //   ]);
// //   const [input, setInput] = useState<string>("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const messagesEndRef = useRef<HTMLDivElement>(null);

// //   // Lấy OpenAI API Key từ biến môi trường
// //   const API_KEY = import.meta.env.VITE_OPEN_API_KEY || "";

// //   useEffect(() => {
// //     const validateKey = async () => {
// //       if (!API_KEY) {
// //         setMessages((prev) => [
// //           ...prev,
// //           {
// //             text: "Cảnh báo: OpenAI API Key không được tìm thấy. Vui lòng kiểm tra file .env và đảm bảo biến VITE_OPEN_API_KEY đã được thiết lập.",
// //             sender: "bot",
// //           },
// //         ]);
// //         return;
// //       }
// //     };

// //     validateKey();
// //   }, [API_KEY]);

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   // Hàm gọi OpenAI API
// //   const callOpenAIAPI = async (userInput: string): Promise<string> => {
// //     if (!API_KEY) {
// //       return "Lỗi: OpenAI API Key không được tìm thấy.";
// //     }

// //     try {
// //       const response = await axios.post(
// //         "https://api.openai.com/v1/chat/completions",
// //         {
// //           model: "gpt-3.5-turbo", // Hoặc "gpt-4" nếu bạn có quyền truy cập
// //           messages: [
// //             {
// //               role: "system",
// //               content: "You are NutriWise AI, a helpful assistant for nutrition and health-related questions.",
// //             },
// //             {
// //               role: "user",
// //               content: userInput,
// //             },
// //           ],
// //           temperature: 0.7,
// //           max_tokens: 500,
// //         },
// //         {
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${API_KEY}`,
// //           },
// //         }
// //       );

// //       const data = response.data;
// //       if (data.choices && data.choices[0] && data.choices[0].message.content) {
// //         return data.choices[0].message.content.trim();
// //       } else {
// //         return "Mình không hiểu câu hỏi, bạn có thể hỏi lại không?";
// //       }
// //     } catch (err: any) {
// //       console.error("Error calling OpenAI API:", err.response?.data || err.message);
// //       return `Lỗi khi gọi API: ${err.response?.status ? `HTTP ${err.response.status}` : err.message}. Vui lòng thử lại sau!`;
// //     }
// //   };

// //   const sendMessage = useCallback(async () => {
// //     if (!input.trim()) return;

// //     const userMessage: Message = { text: input, sender: "user" };
// //     setMessages((prev) => [...prev, userMessage]);
// //     setInput("");
// //     setIsLoading(true);

// //     const botResponseText = await callOpenAIAPI(input);
// //     const botResponse: Message = { text: botResponseText, sender: "bot" };
// //     setMessages((prev) => [...prev, botResponse]);
// //     setIsLoading(false);
// //   }, [input]);

// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         flexDirection: "column",
// //         width: "100%",
// //         height: "100%",
// //         backgroundColor: "#FFFFFF",
// //         borderRadius: "20px",
// //         boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
// //         overflow: "hidden",
// //         border: "2px solid #DBEAFE",
// //       }}
// //     >
// //       <div
// //         style={{
// //           textAlign: "center",
// //           padding: "12px",
// //           backgroundColor: "#3B82F6",
// //           color: "#FFFFFF",
// //           fontSize: "16px",
// //           fontWeight: "600",
// //           borderBottom: "2px solid #DBEAFE",
// //         }}
// //       >
// //         NutriWise AI Chat (OpenAI ChatGPT)
// //       </div>

// //       <div
// //         style={{
// //           flex: 1,
// //           overflowY: "auto",
// //           padding: "20px",
// //           backgroundColor: "#F9FAFB",
// //           scrollbarWidth: "thin",
// //           scrollbarColor: "#3B82F6 #DBEAFE",
// //         }}
// //       >
// //         {messages.map((msg, index) => (
// //           <motion.div
// //             key={index}
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.3 }}
// //             style={{
// //               display: "flex",
// //               justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
// //               marginBottom: "12px",
// //             }}
// //           >
// //             <div
// //               style={{
// //                 padding: "12px 16px",
// //                 maxWidth: "80%",
// //                 backgroundColor: msg.sender === "user" ? "#3B82F6" : "#EFF6FF",
// //                 color: msg.sender === "user" ? "#FFFFFF" : "#1F2937",
// //                 borderRadius: "16px",
// //                 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
// //                 fontSize: "15px",
// //                 border: msg.sender === "user" ? "none" : "1px solid #DBEAFE",
// //               }}
// //             >
// //               {msg.text}
// //             </div>
// //           </motion.div>
// //         ))}
// //         {isLoading && (
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             style={{ textAlign: "center", color: "#3B82F6" }}
// //           >
// //             Đang xử lý...
// //           </motion.div>
// //         )}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       <div
// //         style={{
// //           display: "flex",
// //           padding: "12px",
// //           borderTop: "2px solid #DBEAFE",
// //           backgroundColor: "#FFFFFF",
// //           gap: "12px",
// //         }}
// //       >
// //         <input
// //           type="text"
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// //           placeholder="Hỏi bằng tiếng Anh (ví dụ: What are the benefits of healthy eating?)..."
// //           style={{
// //             flex: 1,
// //             padding: "10px 16px",
// //             border: "1px solid #D1D5DB",
// //             borderRadius: "12px",
// //             fontSize: "15px",
// //             outline: "none",
// //             backgroundColor: "#FFFFFF",
// //             transition: "border-color 0.3s, box-shadow 0.3s",
// //           }}
// //           onFocus={(e) => {
// //             e.currentTarget.style.borderColor = "#3B82F6";
// //             e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
// //           }}
// //           onBlur={(e) => {
// //             e.currentTarget.style.borderColor = "#D1D5DB";
// //             e.currentTarget.style.boxShadow = "none";
// //           }}
// //         />
// //         <button
// //           onClick={sendMessage}
// //           style={{
// //             padding: "10px 16px",
// //             backgroundColor: "#3B82F6",
// //             borderRadius: "12px",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             cursor: "pointer",
// //             transition: "background-color 0.3s, transform 0.2s",
// //           }}
// //           onMouseOver={(e) => {
// //             e.currentTarget.style.backgroundColor = "#2563EB";
// //             e.currentTarget.style.transform = "scale(1.05)";
// //           }}
// //           onMouseOut={(e) => {
// //             e.currentTarget.style.backgroundColor = "#3B82F6";
// //             e.currentTarget.style.transform = "scale(1)";
// //           }}
// //         >
// //           <Send style={{ height: "20px", width: "20px", color: "#FFFFFF" }} />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AIChat;

// // Note: Ensure you have set VITE_GOOGLE_GEMINI_API_KEY in your .env file
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import { ExternalLink, Send } from "lucide-react";
// import axios from "axios";

// interface Message {
//   text: string;
//   sender: "user" | "bot";
// }

// const AIChat: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       text: "Chào bạn! Tôi là NutriWise AI, sử dụng mô hình Google Gemini. Vui lòng hỏi bằng tiếng Anh để nhận câu trả lời chính xác (ví dụ: 'What are the benefits of healthy eating?'). Tôi có thể giúp gì cho bạn hôm nay?",
//       sender: "bot",
//     },
//   ]);
//   const [input, setInput] = useState<string>("");
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Lấy Google Gemini API Key từ biến môi trường
//   const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || "AIzaSyB_ZceXJzxFgugd74Pq9TOCrO-UexCPzPM";

//   useEffect(() => {
//     const validateKey = async () => {
//       if (!API_KEY) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             text: "Cảnh báo: Google Gemini API Key không được tìm thấy. Vui lòng kiểm tra file .env và đảm bảo biến VITE_GOOGLE_GEMINI_API_KEY đã được thiết lập.",
//             sender: "bot",
//           },
//         ]);
//         return;
//       }
//     };

//     validateKey();
//   }, [API_KEY]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Hàm gọi Google Gemini API
//   const callGeminiAPI = async (userInput: string): Promise<string> => {
//     if (!API_KEY) {
//       return "Lỗi: Google Gemini API Key không được tìm thấy.";
//     }

//     try {
//       const response = await axios.post(
//         "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
//         {
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `You are NutriWise AI, a helpful assistant for nutrition and health-related questions. Answer the following: ${userInput}`,
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "x-goog-api-key": API_KEY, // Gemini uses this header for the API key
//           },
//         }
//       );

//       const data = response.data;
//       if (data.candidates && data.candidates[0] && data.candidates[0].content.parts[0].text) {
//         return data.candidates[0].content.parts[0].text.trim();
//       } else {
//         return "Mình không hiểu câu hỏi, bạn có thể hỏi lại không?";
//       }
//     } catch (err: any) {
//       console.error("Error calling Gemini API:", err.response?.data || err.message);
//       return `Lỗi khi gọi API: ${err.response?.status ? `HTTP ${err.response.status}` : err.message}. Vui lòng thử lại sau!`;
//     }
//   };

//   const sendMessage = useCallback(async () => {
//     if (!input.trim()) return;

//     const userMessage: Message = { text: input, sender: "user" };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsLoading(true);

//     const botResponseText = await callGeminiAPI(input);
//     const botResponse: Message = { text: botResponseText, sender: "bot" };
//     setMessages((prev) => [...prev, botResponse]);
//     setIsLoading(false);
//   }, [input]);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         width: "100%",
//         height: "100%",
//         backgroundColor: "#FFFFFF",
//         borderRadius: "20px",
//         boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//         overflow: "hidden",
//         border: "2px solid #DBEAFE",
//       }}
//     >
//       <div
//         style={{
//           textAlign: "center",
//           padding: "12px",
//           backgroundColor: "#3B82F6",
//           color: "#FFFFFF",
//           fontSize: "16px",
//           fontWeight: "600",
//           borderBottom: "2px solid #DBEAFE",
//           display: 'flex',
//           gap: '50px'
//         }}
//       >
          
//         NutriWise AI Chat (Google Gemini)
//         <a
//         href="/nutriwise/chats"
//         target="_blank"
//         rel="noopener noreferrer"
//         style={{ color: "#FFFFFF" }}>
//           <ExternalLink size={20} />
//         </a>
//       </div>

//       <div
//         style={{
//           flex: 1,
//           overflowY: "auto",
//           padding: "20px",
//           backgroundColor: "#F9FAFB",
//           scrollbarWidth: "thin",
//           scrollbarColor: "#3B82F6 #DBEAFE",
//         }}
//       >
//         {messages.map((msg, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             style={{
//               display: "flex",
//               justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
//               marginBottom: "12px",
//             }}
//           >
//             <div
//               style={{
//                 padding: "12px 16px",
//                 maxWidth: "80%",
//                 backgroundColor: msg.sender === "user" ? "#3B82F6" : "#EFF6FF",
//                 color: msg.sender === "user" ? "#FFFFFF" : "#1F2937",
//                 borderRadius: "16px",
//                 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                 fontSize: "15px",
//                 border: msg.sender === "user" ? "none" : "1px solid #DBEAFE",
//               }}
//             >
//               {msg.text}
//             </div>
//           </motion.div>
//         ))}
//         {isLoading && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             style={{ textAlign: "center", color: "#3B82F6" }}
//           >
//             Đang xử lý...
//           </motion.div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <div
//         style={{
//           display: "flex",
//           padding: "12px",
//           borderTop: "2px solid #DBEAFE",
//           backgroundColor: "#FFFFFF",
//           gap: "12px",
//         }}
//       >
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Hỏi bằng tiếng Anh (ví dụ: What are the benefits of healthy eating?)..."
//           style={{
//             flex: 1,
//             padding: "10px 16px",
//             border: "1px solid #D1D5DB",
//             borderRadius: "12px",
//             fontSize: "15px",
//             outline: "none",
//             backgroundColor: "#FFFFFF",
//             transition: "border-color 0.3s, box-shadow 0.3s",
//           }}
//           onFocus={(e) => {
//             e.currentTarget.style.borderColor = "#3B82F6";
//             e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
//           }}
//           onBlur={(e) => {
//             e.currentTarget.style.borderColor = "#D1D5DB";
//             e.currentTarget.style.boxShadow = "none";
//           }}
//         />
//         <button
//           onClick={sendMessage}
//           style={{
//             padding: "10px 16px",
//             backgroundColor: "#3B82F6",
//             borderRadius: "12px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             transition: "background-color 0.3s, transform 0.2s",
//           }}
//           onMouseOver={(e) => {
//             e.currentTarget.style.backgroundColor = "#2563EB";
//             e.currentTarget.style.transform = "scale(1.05)";
//           }}
//           onMouseOut={(e) => {
//             e.currentTarget.style.backgroundColor = "#3B82F6";
//             e.currentTarget.style.transform = "scale(1)";
//           }}
//         >
//           <Send style={{ height: "20px", width: "20px", color: "#FFFFFF" }} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AIChat;

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Send } from "lucide-react";
import axios from "axios";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Chào bạn! Tôi là NutriWise AI, sử dụng mô hình OpenAI ChatGPT. Vui lòng hỏi bằng tiếng Anh để nhận câu trả lời chính xác (ví dụ: 'What are the benefits of healthy eating?'). Tôi có thể giúp gì cho bạn hôm nay?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy OpenAI API Key từ biến môi trường
  const API_KEY = import.meta.env.VITE_OPEN_API_KEY || "";

  useEffect(() => {
    const validateKey = async () => {
      if (!API_KEY) {
        setMessages((prev) => [
          ...prev,
          {
            text: "Cảnh báo: OpenAI API Key không được tìm thấy. Vui lòng kiểm tra file .env và đảm bảo biến VITE_OPEN_API_KEY đã được thiết lập.",
            sender: "bot",
          },
        ]);
        return;
      }
    };

    validateKey();
  }, [API_KEY]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hàm gọi OpenAI API
  const callOpenAIAPI = async (userInput: string): Promise<string> => {
    if (!API_KEY) {
      return "Lỗi: OpenAI API Key không được tìm thấy.";
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo", // Hoặc "gpt-4" nếu bạn có quyền truy cập
          messages: [
            {
              role: "system",
              content: "You are NutriWise AI, a helpful assistant for nutrition and health-related questions.",
            },
            {
              role: "user",
              content: userInput,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const data = response.data;
      if (data.choices && data.choices[0] && data.choices[0].message.content) {
        return data.choices[0].message.content.trim();
      } else {
        return "Mình không hiểu câu hỏi, bạn có thể hỏi lại không?";
      }
    } catch (err: any) {
      console.error("Error calling OpenAI API:", err.response?.data || err.message);
      return `Lỗi khi gọi API: ${err.response?.status ? `HTTP ${err.response.status}` : err.message}. Vui lòng thử lại sau!`;
    }
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const botResponseText = await callOpenAIAPI(input);
    const botResponse: Message = { text: botResponseText, sender: "bot" };
    setMessages((prev) => [...prev, botResponse]);
    setIsLoading(false);
  }, [input]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        border: "2px solid #DBEAFE",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "12px",
          backgroundColor: "#3B82F6",
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: "600",
          borderBottom: "2px solid #DBEAFE",
          display: "flex",
          gap: "50px",
        }}
      >
        NutriWise AI Chat (OpenAI ChatGPT)
        <a
          href="/nutriwise/chats"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#FFFFFF" }}
        >
          <ExternalLink size={20} />
        </a>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#F9FAFB",
          scrollbarWidth: "thin",
          scrollbarColor: "#3B82F6 #DBEAFE",
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
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                maxWidth: "80%",
                backgroundColor: msg.sender === "user" ? "#3B82F6" : "#EFF6FF",
                color: msg.sender === "user" ? "#FFFFFF" : "#1F2937",
                borderRadius: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                fontSize: "15px",
                border: msg.sender === "user" ? "none" : "1px solid #DBEAFE",
              }}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", color: "#3B82F6" }}
          >
            Đang xử lý...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          display: "flex",
          padding: "12px",
          borderTop: "2px solid #DBEAFE",
          backgroundColor: "#FFFFFF",
          gap: "12px",
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
            padding: "10px 16px",
            border: "1px solid #D1D5DB",
            borderRadius: "12px",
            fontSize: "15px",
            outline: "none",
            backgroundColor: "#FFFFFF",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3B82F6";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#D1D5DB";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 16px",
            backgroundColor: "#3B82F6",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.3s, transform 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#2563EB";
            e.currentTarget.style.transform = "scale(1.05)";
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