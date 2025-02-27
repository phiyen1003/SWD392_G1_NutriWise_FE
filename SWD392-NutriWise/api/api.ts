import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function generateResponse(prompt: string) {
  try {
    const { text } = await generateText({
      model: openai.chat('gpt-3.5-turbo'), // ✅ Dùng .chat()
      prompt,
      temperature: 0.7, // ✅ Chuyển temperature vào đây
    });

    return text;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}
