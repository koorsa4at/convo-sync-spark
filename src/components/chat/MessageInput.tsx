import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  onStopGeneration?: () => void;
}

export function MessageInput({ onSendMessage, isLoading, onStopGeneration }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-chat-border bg-background-secondary/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите сообщение..."
                className={cn(
                  "min-h-[60px] max-h-[200px] resize-none rounded-xl",
                  "bg-chat-input border-chat-border text-foreground placeholder:text-foreground-muted",
                  "pr-12 py-4 focus:ring-primary focus:border-primary transition-all duration-300",
                  "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                )}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex gap-2">
              {isLoading && onStopGeneration ? (
                <Button
                  type="button"
                  onClick={onStopGeneration}
                  size="icon"
                  className="h-12 w-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl transition-all duration-300"
                >
                  <Square className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!message.trim() || isLoading}
                  className={cn(
                    "h-12 w-12 rounded-xl transition-all duration-300",
                    message.trim() && !isLoading
                      ? "bg-gradient-primary hover:bg-primary-hover text-primary-foreground shadow-glow hover:shadow-lg"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
        
        <div className="flex items-center justify-between mt-3 text-xs text-foreground-muted">
          <span>Нажмите Enter для отправки, Shift+Enter для новой строки</span>
          <span>{message.length}/4000</span>
        </div>
      </div>
    </div>
  );
}