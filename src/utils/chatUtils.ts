import { Chat, Message, Model } from '@/types/chat';

export function generateChatId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createNewChat(): Chat {
  return {
    id: generateChatId(),
    title: 'Новый чат',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function createMessage(content: string, role: 'user' | 'assistant'): Message {
  return {
    id: generateMessageId(),
    content,
    role,
    timestamp: new Date()
  };
}

export function generateChatTitle(firstMessage: string): string {
  // Генерируем заголовок на основе первого сообщения
  const truncated = firstMessage.slice(0, 50);
  return truncated.length < firstMessage.length ? `${truncated}...` : truncated;
}

// Симуляция ответа ChatGPT (в реальном приложении здесь будет API запрос)
export async function simulateAIResponse(messages: Message[], model: Model): Promise<string> {
  // Имитируем задержку API
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Простые ответы для демонстрации
  const responses = [
    "Привет! Я ИИ-ассистент. Чем могу помочь?",
    "Это интересный вопрос. Дайте мне подумать...",
    "Я понимаю вашу точку зрения. Вот что я думаю по этому поводу:",
    "Спасибо за вопрос! Вот подробный ответ:",
    "Отличная тема для обсуждения. Рассмотрим это детальнее:",
    `Согласно модели ${model}, могу предложить следующее решение:`,
    "Это зависит от многих факторов. Давайте разберем по порядку:",
    "Интересная задача! Вот несколько вариантов решения:"
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Добавляем контекст последнего сообщения пользователя
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  if (lastUserMessage) {
    return `${randomResponse}\n\nОтносительно вашего сообщения "${lastUserMessage.content.slice(0, 30)}${lastUserMessage.content.length > 30 ? '...' : ''}" - это действительно важная тема, которая требует внимательного рассмотрения.`;
  }
  
  return randomResponse;
}