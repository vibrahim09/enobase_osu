import { NextResponse } from 'next/server'
import { dispatch } from '@/lib/functions'
import { FunctionRequestBody } from '@/lib/functions'

export async function POST(request: Request) {
  try {
    const body = await request.json() as FunctionRequestBody
    console.log('API received:', body)
    
    const response = dispatch(body)
    console.log('API response:', response)

    // If it's an error, return it directly
    if ('error' in response) {
      return NextResponse.json(
        { message: response.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      result: response.result
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 