import { OpenAIStream } from '@/lib/openai-stream'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt, canvasData, functionMetadata } = await req.json()

    // Prepare additional context for the LLM based on the canvas data and function metadata
    let enhancedSystemPrompt = systemPrompt

    // If we have canvas data and function metadata, enhance the system prompt
    if (canvasData && functionMetadata) {
      enhancedSystemPrompt += `\n\nCanvas Data (available variables and values):\n${JSON.stringify(canvasData, null, 2)}\n\n`
      enhancedSystemPrompt += `Available Functions:\n${JSON.stringify(functionMetadata, null, 2)}\n\n`
      enhancedSystemPrompt += `When suggesting formulas, use the @function syntax with # to reference variables, like: @add #var1 #var2. Only use functions and variables that exist in the data provided.`
    }

    const response = await OpenAIStream({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: enhancedSystemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 800
    })

    // Create a text encoder and decoder
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    // Create a ReadableStream that processes the OpenAI response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            controller.enqueue(encoder.encode(content))
          }
        }
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 