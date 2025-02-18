import { NextResponse } from 'next/server'
import { dispatch } from '@/lib/functions'
import { FunctionRequestBody } from '@/lib/functions'

export async function POST(request: Request) {
  try {
    const body = await request.json() as FunctionRequestBody
    console.log('Received request body:', body)

    const result = dispatch(body)
    console.log('Calculation result:', result)
    
    if (result === undefined) {
      console.log('Invalid request - result undefined')
      return NextResponse.json(
        { message: 'Invalid request' },
        { status: 400 }
      )
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 