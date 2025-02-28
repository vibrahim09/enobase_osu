'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isCollapsed?: boolean
}

interface AIChatSidebarProps {
  onJsonReceived: (json: any) => void
  getCanvasData: () => any
  functionMetadata: any
  onCreateFormula: (formula: string, variables: string[]) => void
}

export function AIChatSidebar({ onJsonReceived, getCanvasData, functionMetadata, onCreateFormula }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const systemPrompt = `You are a helpful AI assistant that can perform two types of tasks:

1. Generate example data in JSON format. When users ask for data, respond with valid JSON that follows this exact structure, wrapped in code blocks:

\`\`\`json
{
  "name": "Descriptive Grid Name",
  "columns": [
    { "field": "fieldName", "header": "Header Name", "type": "string|number" }
  ],
  "rows": [
    { "fieldName": "value" }
  ]
}
\`\`\`

2. Help with calculations using canvas data. When users ask for calculations, analyze the canvas data to determine which variables are relevant, and suggest formulas using the available functions. 

For calculations, ALWAYS wrap your formula in a formula code block like this:

\`\`\`formula
@function #variable1 #variable2
\`\`\`

Your response should include:
- A clear explanation of what the formula does
- The formula itself in a code block as shown above
- Use the @function syntax with # to reference variables, like: @add #var1 #var2

IMPORTANT: Always wrap formulas in \`\`\`formula code blocks. This is required for the system to process them correctly.
`

  const toggleMessageCollapse = (index: number) => {
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, isCollapsed: !msg.isCollapsed } : msg
    ))
  }

  const renderMessage = (message: Message, index: number) => {
    // Check if the message contains JSON (has ```json code block)
    const isJson = message.content.includes('```json')
    // Only collapse JSON responses from the assistant
    const shouldCollapse = isJson && message.role === 'assistant'
    
    return (
      <div
        key={index}
        className={`flex ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        }`}
      >
        <div
          className={cn(
            'rounded-lg px-3 py-2 max-w-[85%]',
            message.role === 'user'
              ? 'bg-primary text-primary-foreground ml-4'
              : 'bg-muted mr-4',
            shouldCollapse && 'cursor-pointer hover:opacity-90'
          )}
          onClick={() => shouldCollapse && toggleMessageCollapse(index)}
        >
          {shouldCollapse && (
            <div className="flex items-center justify-between mb-1 text-xs text-muted-foreground">
              <span>JSON Response</span>
              {message.isCollapsed ? (
                <ChevronDown className="h-3 w-3 ml-2 transition-transform duration-1000" />
              ) : (
                <ChevronUp className="h-3 w-3 ml-2 transition-transform duration-1000" />
              )}
            </div>
          )}
          
          <div 
            className={cn(
              shouldCollapse ? "overflow-hidden transition-all duration-1000 ease-in-out" : "",
              message.isCollapsed && shouldCollapse ? "max-h-6" : "max-h-[1000px]"
            )}
          >
            {message.isCollapsed && shouldCollapse ? (
              <div className="text-sm font-sans opacity-70">
                {'{...}'} Click to expand
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm font-sans">
                {message.content}
              </pre>
            )}
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Get current canvas data for calculation requests
      const canvasData = getCanvasData()
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt,
          canvasData,
          functionMetadata
        })
      })

      if (!response.ok) throw new Error('Failed to fetch response')
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      let assistantMessage = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value)
        console.log('Received chunk:', chunk)
        assistantMessage += chunk

        // Update the messages with the current chunk - don't collapse while streaming
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = assistantMessage
            lastMessage.isCollapsed = false // Keep expanded while streaming
            return [...newMessages]
          } else {
            return [...newMessages, { 
              role: 'assistant', 
              content: assistantMessage,
              isCollapsed: false // Keep expanded while streaming
            }]
          }
        })
      }

      // Stream is complete - now we can collapse the message if it's JSON
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage?.role === 'assistant') {
          // Only collapse JSON responses
          lastMessage.isCollapsed = lastMessage.content.includes('```json')
        }
        return newMessages
      })

      // Try to extract JSON from the complete response
      try {
        const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/) || 
                         assistantMessage.match(/{[\s\S]*}/)
        
        if (jsonMatch) {
          const jsonString = jsonMatch[1] || jsonMatch[0]
          const jsonData = JSON.parse(jsonString)
          onJsonReceived(jsonData)
        }
        
        // Try to extract formula from the complete response
        // First, try to find a formula in a code block
        let formulaMatch = assistantMessage.match(/```formula\n([\s\S]*?)\n```/)
        
        // If no formula code block is found, try to find a formula pattern directly
        if (!formulaMatch) {
          // Look for @function patterns with # variables
          const formulaPattern = /@([a-zA-Z0-9_]+)(\s+#[a-zA-Z0-9_]+)+/g
          const matches = [...assistantMessage.matchAll(formulaPattern)]
          
          if (matches.length > 0) {
            // Create a RegExpMatchArray-like object with the formula
            const formula = matches[0][0].trim()
            formulaMatch = [formula, formula] as RegExpMatchArray
            console.log("Found formula without code block:", formula)
          }
        }
        
        if (formulaMatch && onCreateFormula) {
          const formulaString = formulaMatch[1].trim()
          
          // Extract variable names from the formula (anything that starts with #)
          const variableRegex = /#([a-zA-Z0-9_]+)/g
          const variables: string[] = []
          let match
          
          while ((match = variableRegex.exec(formulaString)) !== null) {
            variables.push(match[1])
          }
          
          // Call the handler to create the formula
          onCreateFormula(formulaString, variables)
        }
      } catch (e) {
        console.error('Failed to parse response:', e)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        isCollapsed: false
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-80 h-[calc(100vh-50px)] flex flex-col bg-background border-r rounded-md shadow-sm">
      <div className="p-4 border-b flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h2 className="font-semibold">AI Chat</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => renderMessage(message, i))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg px-3 py-2 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t mt-auto">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask for example data..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading} className="shrink-0">
            Send
          </Button>
        </form>
      </div>
    </Card>
  )
} 