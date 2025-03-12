import { OpenAIStream } from '@/lib/openai-stream'
import {Pool} from 'pg';
 


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'northwind',
  password: 'postgres',
  port: 5432,
});

//export const runtime = 'edge'


export async function POST(req: Request) {
  try {
    const { messages, systemPrompt, canvasData, functionMetadata,lineData,barData,pieData } = await req.json()
    const dbQuery = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    const dbResult = await pool.query(dbQuery);
    console.log("Result:", dbResult);
    const dbData = dbResult.rows.map(row => row.table_name);


    // Prepare additional context for the LLM based on the canvas data and function metadata
    let enhancedSystemPrompt = systemPrompt

    // If we have canvas data and function metadata, enhance the system prompt
    if (canvasData && functionMetadata) {
      enhancedSystemPrompt += `\n\nCanvas Data (available variables and values):\n${JSON.stringify(canvasData, null, 2)}\n\n`
      enhancedSystemPrompt += `Available Functions:\n${JSON.stringify(functionMetadata, null, 2)}\n\n`
      enhancedSystemPrompt += `Database Data:\n${JSON.stringify(dbData, null, 2)}\n\n`
      enhancedSystemPrompt += `Line Chart Data:\n${JSON.stringify(lineData, null, 2)}\n\n`
      enhancedSystemPrompt += `Bar Chart Data:\n${JSON.stringify(barData, null, 2)}\n\n` 
      enhancedSystemPrompt += `Pie Chart Data:\n${JSON.stringify(pieData, null, 2)}\n\n`
      
      enhancedSystemPrompt += `When suggesting formulas, use the @function syntax with # to reference variables, like: @add #var1 #var2. Only use functions and variables that exist in the data provided.`
    }
    enhancedSystemPrompt += `\n\nTools:\n`
    enhancedSystemPrompt += `Name: chatto-plot\n`
    enhancedSystemPrompt += `Description: A tool to generate visualizations using natural language instructions.\n`
    enhancedSystemPrompt += `Instructions: Use the data provided to generate line, bar, and pie charts.\n`


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