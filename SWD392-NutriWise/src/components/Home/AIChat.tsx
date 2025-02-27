import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, TextField, IconButton, Typography, Paper, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";


interface Message {
  text: string;
  sender: "user" | "bot";
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNutritionQuestion = (question: string) => {
    // Chuẩn hóa câu hỏi: chuyển về chữ thường và bỏ dấu để xử lý tiếng Việt linh hoạt
    const lowerCaseQuestion = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. Lợi ích của việc ăn uống lành mạnh
    if (lowerCaseQuestion.includes("loi ich") && lowerCaseQuestion.includes("an uong lanh manh") ||
        lowerCaseQuestion.includes("benefit") && lowerCaseQuestion.includes("healthy eating")) {
        return "Ăn uống lành mạnh giúp bạn tràn đầy năng lượng, tăng cường miễn dịch và giảm nguy cơ mắc bệnh như tim mạch hay tiểu đường. Nó còn cải thiện tâm trạng và giữ vóc dáng cân đối.";
    }

    // 2. Khám phá những lợi ích sức khỏe từ việc ăn uống đúng cách
    if (lowerCaseQuestion.includes("loi ich suc khoe") && lowerCaseQuestion.includes("an uong dung cach") ||
        lowerCaseQuestion.includes("health benefit") && lowerCaseQuestion.includes("eat right")) {
        return "Ăn uống đúng cách mang lại nhiều lợi ích: tiêu hóa tốt hơn nhờ chất xơ, tim khỏe nhờ omega-3 từ cá, và trí nhớ sắc bén hơn nhờ chất chống oxy hóa. Đó là cách đầu tư cho sức khỏe lâu dài!";
    }

    // 3. Cách xây dựng thực đơn dinh dưỡng
    if (lowerCaseQuestion.includes("cach xay dung") && lowerCaseQuestion.includes("thuc don") ||
        lowerCaseQuestion.includes("how to build") && lowerCaseQuestion.includes("meal plan")) {
        return "Để xây dựng thực đơn dinh dưỡng, hãy xác định mục tiêu (tăng cân, giảm cân, hay duy trì), rồi chia khẩu phần hợp lý: protein từ thịt, cá; tinh bột từ gạo lứt, khoai; và nhiều rau xanh.";
    }

    // 4. Hướng dẫn chi tiết để xây dựng thực đơn dinh dưỡng phù hợp
    if (lowerCaseQuestion.includes("huong dan") && lowerCaseQuestion.includes("thuc don") ||
        lowerCaseQuestion.includes("guide") && lowerCaseQuestion.includes("nutrition plan")) {
        return "Bắt đầu bằng cách tính nhu cầu calo dựa trên tuổi, cân nặng, hoạt động. Chia nhỏ thành 3-5 bữa với 30% protein, 40% tinh bột, 30% chất béo tốt. Thử sáng: yến mạch; trưa: cơm gạo lứt, gà, rau; tối: salad.";
    }

    // 5. Những thực phẩm nên có trong chế độ ăn
    if (lowerCaseQuestion.includes("thuc pham nen co") && lowerCaseQuestion.includes("che do an") ||
        lowerCaseQuestion.includes("food should have") && lowerCaseQuestion.includes("diet")) {
        return "Chế độ ăn nên có rau xanh như cải bó xôi, cá hồi giàu omega-3, hạt óc chó, khoai lang và trái cây như táo, chuối – vừa ngon vừa bổ dưỡng!";
    }

    // 6. Tìm hiểu về những thực phẩm tốt cho sức khỏe
    if (lowerCaseQuestion.includes("tim hieu") && lowerCaseQuestion.includes("thuc pham tot") ||
        lowerCaseQuestion.includes("learn about") && lowerCaseQuestion.includes("healthy food")) {
        return "Thực phẩm tốt thường tự nhiên: bơ giàu chất béo tốt, sữa chua hỗ trợ tiêu hóa, quả mọng giàu chất chống oxy hóa. Thêm đậu lăng để có protein thực vật nữa nhé!";
    }

    // 7. Hỗ trợ tính chỉ số BMI, BMR cho người dùng
    if (lowerCaseQuestion.includes("bmi") || lowerCaseQuestion.includes("bmr") ||
        lowerCaseQuestion.includes("chi so co the") || lowerCaseQuestion.includes("nang luong co ban")) {
        return "Mình có thể tính BMI (chỉ số khối cơ thể) và BMR (năng lượng cơ bản) cho bạn. Hãy cho mình biết chiều cao, cân nặng, tuổi và giới tính nhé, mình sẽ tính ngay!";
    }

    // 8. Giới thiệu Cộng đồng
    if (lowerCaseQuestion.includes("cong dong") && lowerCaseQuestion.includes("suc khoe") ||
        lowerCaseQuestion.includes("community") && lowerCaseQuestion.includes("health")) {
        return "Có rất nhiều cộng đồng yêu sức khỏe để bạn tham gia, nơi mọi người chia sẻ mẹo ăn uống, tập luyện và động lực. Bạn muốn biết thêm về nhóm nào không?";
    }

    // 9. Kết nối với cộng đồng người yêu sức khỏe
    if (lowerCaseQuestion.includes("ket noi") && lowerCaseQuestion.includes("cong dong") ||
        lowerCaseQuestion.includes("connect") && lowerCaseQuestion.includes("health community")) {
        return "Kết nối với cộng đồng sức khỏe giúp bạn học hỏi thực đơn, thử thách như ‘30 ngày ăn sạch’, và có thêm bạn đồng hành. Bạn thích nhóm online hay gặp trực tiếp?";
    }

    // 10. Giới thiệu các nhóm Theo dõi sức khỏe
    if (lowerCaseQuestion.includes("nhom theo doi") && lowerCaseQuestion.includes("suc khoe") ||
        lowerCaseQuestion.includes("group") && lowerCaseQuestion.includes("health tracking")) {
        return "Các nhóm theo dõi sức khỏe thường dùng app để ghi calo, bước chân, hay tổ chức thi đua như đi bộ 10.000 bước/ngày. Rất thú vị để duy trì động lực đấy!";
    }

    // 11. Công cụ theo dõi chỉ số sức khỏe thông minh
    if (lowerCaseQuestion.includes("cong cu theo doi") && lowerCaseQuestion.includes("suc khoe") ||
        lowerCaseQuestion.includes("tool") && lowerCaseQuestion.includes("health tracking")) {
        return "Công cụ thông minh như vòng tay đếm bước, app tính calo (ví dụ: MyFitnessPal) giúp bạn theo dõi sức khỏe dễ dàng. Bạn muốn thử cái nào không?";
    }

    // Các câu hỏi dinh dưỡng cơ bản (từ phiên bản trước)
    if (lowerCaseQuestion.includes("calories") || lowerCaseQuestion.includes("calo") || lowerCaseQuestion.includes("nang luong")) {
        return "Calories là năng lượng từ thực phẩm. Nhu cầu calo tùy thuộc tuổi, giới tính, cân nặng và hoạt động, thường từ 1600-2400 calo/ngày cho nữ và 2000-3000 cho nam.";
    } 
    else if (lowerCaseQuestion.includes("protein") || lowerCaseQuestion.includes("chat dam") || lowerCaseQuestion.includes("đạm")) {
        return "Protein giúp xây dựng và sửa chữa cơ thể. Nguồn tốt: thịt nạc, cá, trứng, đậu. Người lớn cần khoảng 0,8g/kg trọng lượng cơ thể mỗi ngày.";
    } 
    else if (lowerCaseQuestion.includes("carbohydrates") || lowerCaseQuestion.includes("carbs") || lowerCaseQuestion.includes("tinh bot")) {
        return "Tinh bột là nguồn năng lượng chính. Chọn loại phức hợp như gạo lứt, khoai thay vì đường đơn, chiếm 45-65% calo mỗi ngày.";
    }
    else if (lowerCaseQuestion.includes("fat") || lowerCaseQuestion.includes("chat beo") || lowerCaseQuestion.includes("béo")) {
        return "Chất béo hỗ trợ hormone và hấp thụ chất. Ưu tiên chất béo tốt từ bơ, dầu ô liu, chiếm 20-35% calo/ngày.";
    }
    else if (lowerCaseQuestion.includes("fiber") || lowerCaseQuestion.includes("chat xo") || lowerCaseQuestion.includes("xơ")) {
        return "Chất xơ tốt cho tiêu hóa, đường huyết. Có trong rau, trái cây, ngũ cốc nguyên cám. Nên ăn 25-30g mỗi ngày.";
    }

    // Câu trả lời mặc định
    return "Mình sẵn sàng giúp bạn với các thắc mắc về dinh dưỡng. Bạn muốn hỏi về ăn uống, thực đơn, hay sức khỏe không? Hôm nay mình có thể hỗ trợ gì cho bạn?";
};

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setTimeout(() => {
      const botResponse: Message = { text: handleNutritionQuestion(input), sender: "bot" };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  }, [input]);

    return (
      <Paper
        elevation={4}
        sx={{
          position: "fixed",
          width: 400,
          height: 540,
          borderRadius: 4,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" sx={{ textAlign: "center", py: 1.5, bgcolor: "primary.main", color: "#fff" }}>
          NutriWise AI Chat
        </Typography>
        <Divider />
        <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "#f9f9f9" }}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", mb: 1 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    maxWidth: "75%",
                    bgcolor: msg.sender === "user" ? "primary.light" : "grey.200",
                    color: msg.sender === "user" ? "primary.contrastText" : "text.primary",
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
              </Box>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Divider />
        <Box sx={{ display: "flex", p: 1 }}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi về dinh dưỡng..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            variant="outlined"
            size="small"
            sx={{ bgcolor: "white", borderRadius: 2 }}
          />
          <IconButton color="primary" onClick={sendMessage} sx={{ ml: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    );
  };

export default AIChat;
