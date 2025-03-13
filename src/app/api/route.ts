import { NextResponse } from 'next/server'
import { dispatch } from '@/lib/functions'
import { FunctionRequestBody } from '@/lib/functions'

export async function POST(request: Request) {
  try {
    const body = await request.json() as FunctionRequestBody
    console.log('API received:', body)
    
    // Ensure dates are properly converted from ISO strings to Date objects
    // This is needed because JSON.stringify converts Date objects to strings
    Object.keys(body).forEach(key => {
      const value = body[key];
      
      // Check if the value looks like an ISO date string
      if (typeof value === 'string' && 
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value)) {
        body[key] = new Date(value);
      }
    });
    
    const response = dispatch(body)
    console.log('API response:', response)

    // If it's an error, return it directly
    if ('error' in response) {
      return NextResponse.json(
        { error: response.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      result: response.result
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 
