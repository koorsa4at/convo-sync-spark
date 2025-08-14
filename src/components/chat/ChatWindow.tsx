import { Chat } from '@/types/chat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { MessageSquare } from 'lucide-react';

interface ChatWindowProps {
  currentChat: Chat | null;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  onStopGeneration?: () => void;
}

export function ChatWindow({ currentChat, onSendMessage, isLoading, onStopGeneration }: ChatWindowProps) {
  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <MessageSquare className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Добро пожаловать в ConvoSync
          </h2>
          <p className="text-foreground-muted">
            Выберите существующий чат или создайте новый, чтобы начать общение с ИИ
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-chat-background">
      {/* Chat Header */}
      <div className="border-b border-chat-border bg-background-secondary/50 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-foreground truncate">
            {currentChat.title}
          </h2>
          <p className="text-sm text-foreground-muted">
            {currentChat.messages.length} сообщений
          </p>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={currentChat.messages} isLoading={isLoading} />

      {/* Input */}
      <MessageInput 
        onSendMessage={onSendMessage} 
        isLoading={isLoading}
        onStopGeneration={onStopGeneration}
      />
    </div>
  );
}