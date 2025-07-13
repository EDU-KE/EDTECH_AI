import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'User data', 
    user: { 
      id: '123', 
      name: 'Test User',
      role: 'student' 
    } 
  })
}
