import { Message } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 animate-fade-in",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className="w-8 h-8 bg-gradient-primary border border-primary/30">
                <AvatarFallback className="bg-transparent">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={cn(
                "max-w-[70%] px-4 py-3 rounded-2xl shadow-message transition-all duration-300",
                message.role === 'user'
                  ? "bg-gradient-primary text-primary-foreground ml-auto"
                  : "bg-card border border-card-border text-card-foreground"
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <div className="text-xs opacity-70 mt-2">
                {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {message.role === 'user' && (
              <Avatar className="w-8 h-8 bg-secondary border border-chat-border">
                <AvatarFallback className="bg-transparent">
                  <User className="w-4 h-4 text-foreground" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 animate-fade-in">
            <Avatar className="w-8 h-8 bg-gradient-primary border border-primary/30">
              <AvatarFallback className="bg-transparent">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
            
            <div className="bg-card border border-card-border rounded-2xl px-4 py-3 shadow-message">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-typing"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}