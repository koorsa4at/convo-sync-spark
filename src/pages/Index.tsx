import { useState, useEffect } from 'react';
import { Chat, Message, Model, AppState } from '@/types/chat';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createNewChat, createMessage, generateChatTitle, simulateAIResponse } from '@/utils/chatUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [appState, setAppState] = useLocalStorage<AppState>('convo-sync-state', {
    chats: [],
    currentChatId: null,
    activeModel: 'gpt-4',
    isLoading: false
  });

  // Инициализация: создаем первый чат если его нет
  useEffect(() => {
    if (appState.chats.length === 0) {
      const newChat = createNewChat();
      setAppState(prev => ({
        ...prev,
        chats: [newChat],
        currentChatId: newChat.id
      }));
    }
  }, []);

  const currentChat = appState.chats.find(chat => chat.id === appState.currentChatId) || null;

  const handleNewChat = () => {
    const newChat = createNewChat();
    setAppState(prev => ({
      ...prev,
      chats: [newChat, ...prev.chats],
      currentChatId: newChat.id
    }));
  };

  const handleSelectChat = (chatId: string) => {
    setAppState(prev => ({
      ...prev,
      currentChatId: chatId
    }));
  };

  const handleDeleteChat = (chatId: string) => {
    setAppState(prev => {
      const newChats = prev.chats.filter(chat => chat.id !== chatId);
      const newCurrentChatId = prev.currentChatId === chatId 
        ? (newChats.length > 0 ? newChats[0].id : null)
        : prev.currentChatId;
      
      return {
        ...prev,
        chats: newChats,
        currentChatId: newCurrentChatId
      };
    });
    
    toast({
      title: "Чат удален",
      description: "Чат успешно удален из истории"
    });
  };

  const handleSelectModel = (model: Model) => {
    setAppState(prev => ({
      ...prev,
      activeModel: model
    }));
    
    toast({
      title: "Модель изменена",
      description: `Выбрана модель: ${model}`
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChat) return;

    const userMessage = createMessage(content, 'user');
    
    // Добавляем сообщение пользователя и начинаем загрузку
    setAppState(prev => {
      const updatedChats = prev.chats.map(chat => {
        if (chat.id === currentChat.id) {
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, userMessage],
            title: chat.messages.length === 0 ? generateChatTitle(content) : chat.title,
            updatedAt: new Date()
          };
          return updatedChat;
        }
        return chat;
      });

      return {
        ...prev,
        chats: updatedChats,
        isLoading: true
      };
    });

    try {
      // Симуляция ответа от API
      const allMessages = [...currentChat.messages, userMessage];
      const response = await simulateAIResponse(allMessages, appState.activeModel);
      const assistantMessage = createMessage(response, 'assistant');

      // Добавляем ответ ассистента
      setAppState(prev => {
        const updatedChats = prev.chats.map(chat => {
          if (chat.id === currentChat.id) {
            return {
              ...chat,
              messages: [...chat.messages, userMessage, assistantMessage],
              updatedAt: new Date()
            };
          }
          return chat;
        });

        return {
          ...prev,
          chats: updatedChats,
          isLoading: false
        };
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      setAppState(prev => ({
        ...prev,
        isLoading: false
      }));

      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Попробуйте еще раз.",
        variant: "destructive"
      });
    }
  };

  const handleStopGeneration = () => {
    setAppState(prev => ({
      ...prev,
      isLoading: false
    }));
    
    toast({
      title: "Генерация остановлена",
      description: "Генерация ответа была прервана"
    });
  };

  return (
    <div className="h-screen flex bg-gradient-background">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <Sidebar
          chats={appState.chats}
          currentChatId={appState.currentChatId}
          activeModel={appState.activeModel}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onSelectModel={handleSelectModel}
        />
      </div>

      {/* Main Chat Area */}
      <ChatWindow
        currentChat={currentChat}
        onSendMessage={handleSendMessage}
        isLoading={appState.isLoading}
        onStopGeneration={handleStopGeneration}
      />
    </div>
  );
};

export default Index;
