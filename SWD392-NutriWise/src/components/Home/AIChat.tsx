import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, TextField, IconButton, Typography, Paper, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

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
    const lowerCaseQuestion = question.toLowerCase();
  
    if (lowerCaseQuestion.includes("calories")) {
      return "Calories are a measure of energy in food. The number of calories you need depends on factors like age, gender, weight, and activity level. A balanced diet typically ranges from 1600-2400 calories per day for women and 2000-3000 for men.";
    } 
    else if (lowerCaseQuestion.includes("protein")) {
      return "Protein is essential for building and repairing tissues. Good sources include lean meats, fish, eggs, dairy, legumes, and nuts. The recommended daily intake is about 0.8 grams per kilogram of body weight for adults.";
    } 
    else if (lowerCaseQuestion.includes("carbohydrates") || lowerCaseQuestion.includes("carbs")) {
      return "Carbohydrates are the body's main source of energy. Choose complex carbs like whole grains, fruits, and vegetables over simple carbs like sugar. They should make up 45-65% of your daily calorie intake.";
    }
    else if (lowerCaseQuestion.includes("fat")) {
      return "Fats are important for hormone production and nutrient absorption. Focus on healthy fats from sources like avocados, nuts, seeds, and olive oil. Fats should comprise 20-35% of your daily calories.";
    }
    else if (lowerCaseQuestion.includes("fiber")) {
      return "Fiber aids digestion and helps maintain healthy blood sugar levels. Good sources include whole grains, fruits, vegetables, and legumes. Aim for 25-30 grams of fiber per day.";
    }
    else if (lowerCaseQuestion.includes("vitamin")) {
      return "Vitamins are essential for various bodily functions. Eat a variety of fruits, vegetables, whole grains, and lean proteins to ensure you're getting a wide range of vitamins. Consider consulting a doctor about supplements if you have specific concerns.";
    }
    else if (lowerCaseQuestion.includes("mineral")) {
      return "Minerals like calcium, iron, and potassium are crucial for bodily functions. They're found in fruits, vegetables, whole grains, and lean meats. A balanced diet usually provides sufficient minerals for most people.";
    }
    else if (lowerCaseQuestion.includes("water") || lowerCaseQuestion.includes("hydration")) {
      return "Staying hydrated is crucial for overall health. Aim to drink about 8 glasses (64 ounces) of water per day, more if you're active or in hot weather. Water needs can vary based on individual factors.";
    }
    else if (lowerCaseQuestion.includes("meal plan") || lowerCaseQuestion.includes("diet plan")) {
      return "A balanced meal plan should include a variety of foods from all food groups. Start with plenty of fruits and vegetables, add whole grains, lean proteins, and healthy fats. Portion control is key. Consider consulting a nutritionist for a personalized plan.";
    }
    else if (lowerCaseQuestion.includes("weight loss")) {
      return "Healthy weight loss involves a balanced diet and regular exercise. Focus on creating a calorie deficit by eating nutrient-dense, low-calorie foods and increasing physical activity. Aim for a gradual loss of 1-2 pounds per week.";
    }
    else if (lowerCaseQuestion.includes("supplement")) {
      return "While a balanced diet should provide most nutrients, some people may benefit from supplements. Common ones include vitamin D, omega-3s, and multivitamins. Always consult with a healthcare provider before starting any supplement regimen.";
    }
    else if (lowerCaseQuestion.includes("vegetarian") || lowerCaseQuestion.includes("vegan")) {
      return "Vegetarian and vegan diets can be very healthy when well-planned. Focus on plant-based proteins like legumes, nuts, and seeds. Pay special attention to nutrients like B12, iron, and omega-3s, which are more common in animal products.";
    }
    else if (lowerCaseQuestion.includes("food allergy") || lowerCaseQuestion.includes("intolerance")) {
      return "Food allergies and intolerances require careful diet management. Common allergens include nuts, dairy, eggs, and wheat. If you suspect an allergy or intolerance, consult with a healthcare provider for proper diagnosis and management strategies.";
    }
    else if (lowerCaseQuestion.includes("antioxidant")) {
      return "Antioxidants help protect your cells against free radicals. They're found in many fruits and vegetables, especially berries, leafy greens, and colorful produce. Eating a variety of plant-based foods can ensure you get plenty of antioxidants.";
    }
    else if (lowerCaseQuestion.includes("probiotics") || lowerCaseQuestion.includes("gut health")) {
      return "Probiotics are beneficial bacteria that support gut health. They're found in fermented foods like yogurt, kefir, sauerkraut, and kimchi. A healthy gut microbiome can influence digestion, immunity, and even mental health.";
    }
    else if (lowerCaseQuestion.includes("intermittent fasting")) {
      return "Intermittent fasting involves cycling between periods of eating and fasting. It may have benefits for weight management and metabolic health. Common methods include the 16/8 method or the 5:2 diet. Always consult a healthcare provider before starting any new diet regimen.";
    }
    else if (lowerCaseQuestion.includes("keto") || lowerCaseQuestion.includes("ketogenic")) {
      return "The ketogenic diet is a high-fat, low-carb diet that aims to put your body in a state of ketosis. While it may have benefits for some conditions, it's a restrictive diet that should be undertaken with careful planning and medical supervision.";
    }
    else if (lowerCaseQuestion.includes("mediterranean diet")) {
      return "The Mediterranean diet emphasizes plant-based foods, healthy fats like olive oil, and moderate amounts of fish and poultry. It's associated with numerous health benefits, including reduced risk of heart disease and improved cognitive function.";
    }
  
    // Default response if no specific topic is matched
    return "I'm here to help with nutrition questions. You can ask about specific nutrients, meal planning, dietary restrictions, or general nutrition advice. How can I assist you today?";
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
    <Paper elevation={3} sx={{ width: "100%", maxWidth: 400, mx: "auto", p: 1, borderRadius: 2, boxShadow: 5 }}>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2, color: "primary.main" }}>
        NutriWise AI Chat
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height: 300, overflowY: "auto", p: 1, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 1 }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1,
                maxWidth: "80%",
                bgcolor: msg.sender === "user" ? "primary.light" : "background.paper",
                color: msg.sender === "user" ? "primary.contrastText" : "text.primary",
                whiteSpace: "pre-wrap",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about nutrition..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          variant="outlined"
          size="small"
        />
        <IconButton color="primary" onClick={sendMessage} sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default AIChat;
