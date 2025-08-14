import { Chat, Model } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MessageSquare, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  activeModel: Model;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onSelectModel: (model: Model) => void;
}

export function Sidebar({
  chats,
  currentChatId,
  activeModel,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onSelectModel
}: SidebarProps) {
  const modelOptions: { value: Model; label: string }[] = [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-4o', label: 'GPT-4o' }
  ];

  return (
    <div className="flex flex-col h-full bg-chat-sidebar border-r border-chat-border">
      {/* Header */}
      <div className="p-4 border-b border-chat-border">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h1 className="font-semibold text-foreground">ConvoSync</h1>
        </div>
        
        <Button 
          onClick={onNewChat}
          className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground transition-all duration-300 hover:shadow-glow"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Новый чат
        </Button>
      </div>

      {/* Model Selector */}
      <div className="p-4 border-b border-chat-border">
        <label className="text-sm font-medium text-foreground-muted mb-2 block">
          Модель
        </label>
        <Select value={activeModel} onValueChange={onSelectModel}>
          <SelectTrigger className="w-full bg-secondary border-chat-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-card-border">
            {modelOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="text-foreground hover:bg-secondary focus:bg-secondary"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-200",
                "hover:bg-secondary/50",
                currentChatId === chat.id ? "bg-secondary border border-primary/30" : ""
              )}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare className="w-4 h-4 text-foreground-muted flex-shrink-0" />
              <span className="flex-1 text-sm text-foreground truncate">
                {chat.title}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-foreground-muted hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-chat-border">
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <Settings className="w-4 h-4" />
          <span>Настройки</span>
        </div>
      </div>
    </div>
  );
}