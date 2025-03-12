'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import Graphs from './Graphs'

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
  lineData: any
  barData: any
  pieData: any
}

// Compact system prompt to reduce token usage
const SYSTEM_PROMPT = `You are a helpful AI assistant that can:

1. Generate example data in JSON format:
\`\`\`json
{
  "name": "Grid Name",
  "columns": [
    { "field": "fieldName", "header": "Header Name", "type": "string|number" }
  ],
  "rows": [
    { "fieldName": "value" }
  ]
}
\`\`\`

2. Create formulas using canvas data. Always wrap formulas in code blocks. Only return the final version of the formula:
\`\`\`formula
@function #variable1 #variable2
\`\`\`

For formulas:
- Explain what the formula does
- Include the formula in a code block
- Use @function with # for variables
- Include actual values in the final formula, not just variable names

3. Generate visualizations using the data provided. Use the following tool:
\`\`\`json
{
  "tools": [
    {
      "name": "react-chartjs-2",
      "description": "A tool to generate visualizations using natural language instructions.",
      "instructions": "Use the data provided to generate line, bar, and pie charts."
    }
  ],
  "instructions": "Fetch data from the API endpoint '/api/database-api?table={table_name}' and use 'react-chartjs-2' to generate visualizations. Always ensure the JSON is properly formatted with double-quoted property names and includes 'names' and 'values' arrays."
}
\`\`\`
`

export function AIChatSidebar({ onJsonReceived, getCanvasData, functionMetadata, onCreateFormula, lineData, barData, pieData }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState<{ names: string[], values: number[] } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleMessageCollapse = (index: number) => {
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, isCollapsed: !msg.isCollapsed } : msg
    ))
  }

  const renderMessage = (message: Message, index: number) => {
    // Check if the message contains JSON or formula
    const isJson = message.content.includes('```json')
    const isFormula = message.content.includes('```formula')
    // Only collapse JSON or formula responses from the assistant
    const shouldCollapse = (isJson || isFormula) && message.role === 'assistant'
    // Determine the label based on content type
    const contentLabel = isFormula ? "Formula Response" : isJson ? "JSON Response" : ""
    
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
              <span>{contentLabel}</span>
              {message.isCollapsed ? (
                <ChevronDown className="h-3 w-3 ml-2" />
              ) : (
                <ChevronUp className="h-3 w-3 ml-2" />
              )}
            </div>
          )}
          
          <div 
            className={cn(
              shouldCollapse ? "overflow-hidden transition-all duration-500 ease-in-out" : "",
              message.isCollapsed && shouldCollapse ? "max-h-6" : "max-h-[1000px]"
            )}
          >
            {message.isCollapsed && shouldCollapse ? (
              <div className="text-sm font-sans opacity-70">
                {isJson ? '{...}' : '{...}'} Click to expand
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

  const extractJsonAndFormula = (text: string) => {
    // Try to extract JSON
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                     text.match(/{[\s\S]*}/)
    
    if (jsonMatch) {
      try {
        let jsonString = jsonMatch[1] || jsonMatch[0]
        jsonString = jsonString.replace(/'/g, '"');
        const jsonData = JSON.parse(jsonString)
        onJsonReceived(jsonData)
      } catch (e) {
        console.error('Failed to parse JSON:', e)
      }
    }
    
    // Try to extract formula
    const formulaMatch = text.match(/```formula\n([\s\S]*?)\n```/) || 
                        text.match(/@([a-zA-Z0-9_]+)(\s+#[a-zA-Z0-9_]+)+/g)?.map(m => [m, m])[0]
    
    if (formulaMatch && onCreateFormula) {
      const formulaString = formulaMatch[1] || formulaMatch[0]
      
      // Extract variable names (anything that starts with #)
      const variables = Array.from(
        formulaString.matchAll(/#([a-zA-Z0-9_]+)/g), 
        match => match[1]
      )
      
      onCreateFormula(formulaString.trim(), variables)
    }

    // Try to extract chart instructions
    const chartMatch = text.match(/```json\n([\s\S]*?)\n```/)
    
    if (chartMatch) {
      try {
        const chartString = chartMatch[1]
        const chartData = JSON.parse(chartString)
        console.log("Chart Data:", chartData)
        setChartData(chartData)
      } catch (e) {
        console.error('Failed to parse chart data:', e)
      }
    }
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
      
      // Since we're sending function metadata and canvas data with every request,
      // we don't need to send conversation history - just the current user message
      // This significantly reduces token usage and prevents exponential growth
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [userMessage], // Only send the current message
          systemPrompt: SYSTEM_PROMPT,
          canvasData,
          functionMetadata,
          lineData,
          barData,
          pieData
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
        assistantMessage += chunk

        // Update the messages with the current chunk
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = assistantMessage
            lastMessage.isCollapsed = false
            return [...newMessages]
          } else {
            return [...newMessages, { 
              role: 'assistant', 
              content: assistantMessage,
              isCollapsed: false
            }]
          }
        })
      }

      // Stream is complete - now we can collapse the message if it's JSON or formula
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage?.role === 'assistant') {
          lastMessage.isCollapsed = lastMessage.content.includes('```json') || 
                                   lastMessage.content.includes('```formula')
        }
        return newMessages
      })

      // Process the complete response
      extractJsonAndFormula(assistantMessage)
      
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

      {chartData && (
        <div className="p-4 border-t mt-auto">
          <h2>Generated Charts</h2>
          <Graphs names={chartData.names} values={chartData.values} />
        </div>
      )}
    </Card>
  )
}