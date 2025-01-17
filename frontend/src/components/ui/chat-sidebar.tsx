import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { SendHorizonalIcon } from 'lucide-react';
import TypingAnimation from './typing-animation';

const ChatSidebar = ({
  onLlmResponse,
}: {
  onLlmResponse: (data: { prompt: string; response: Record<string, string> }) => void;
}) => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<{ user: string; bot: string | Record<string, string> }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
  
    setMessages((prev) => [...prev, { user: input, bot: 'Loading...' }]);
    setLoading(true);
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/query', {
        question: input,
      });
  
      const { results, sql_query } = response.data;
  
      // Display SQL query as part of the chat history
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? { ...msg, bot: `${sql_query}` }
            : msg
        )
      );
  
      // Pass only the results to the parent component
      if (results) {
        onLlmResponse({ prompt: input, response: results });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'An unexpected error occurred.';
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { ...msg, bot: `Error: ${errorMessage}` } : msg
        )
      );
    } finally {
      setInput('');
      setLoading(false);
    }
  };
  
  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <Sidebar side="right" style={{ width: '15%' }}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ChatBubbleIcon className="size-4"/>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold select-none">Chat</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent
      ref={contentRef}
      className="flex-1 overflow-y-auto p-4 text-sidebar-primary-background hide-scrollbar"
    >
      {messages.map((msg, index) => (
        <div key={index} className="mb-4">
          <div className="font-semibold mb-1 text-foreground">You:</div>
          <div className="p-2 rounded-lg bg-card text-card-foreground">{msg.user}</div>
          <div className="font-semibold mt-2 mb-1 text-foreground">LLM:</div>
          {typeof msg.bot === "string" ? (
            <div className="p-2 rounded-lg bg-card text-card-foreground">
              <TypingAnimation text={msg.bot} />
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-card text-card-foreground">
              {Object.entries(msg.bot as Record<string, any>).map(([key, value]) => (
                <div key={key} className="mb-1">
                  <span className="font-semibold">{key}:</span>{" "}
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </SidebarContent>
      <form onSubmit={handleSubmit} className="p-4 flex">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="w-full p-2 border rounded-lg text-sm bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          <SendHorizonalIcon
            className="size-9 ml-2 p-2 bg-sidebar-primary text-white rounded-lg"
          >
            Send
          </SendHorizonalIcon>
        </button>
      </form>
    </Sidebar>
  );
};

export default ChatSidebar;
