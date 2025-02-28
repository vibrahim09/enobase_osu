import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function OpenAIStream(payload: {
  model: string
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  temperature?: number
  max_tokens?: number
}) {
  const response = await openai.chat.completions.create({
    model: payload.model,
    messages: payload.messages,
    temperature: payload.temperature ?? 0.7,
    max_tokens: payload.max_tokens,
    stream: true
  })

  return response
} 