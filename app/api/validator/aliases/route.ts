import { NextRequest, NextResponse } from 'next/server'
import getReqAuthToken from '../../../../utilities/getReqAuthToken'
import { BACKEND_URL } from '../../../../src/constants/envars'

export async function GET(request: NextRequest) {
  try {
    const token = getReqAuthToken(request)
    
    const response = await fetch(`${BACKEND_URL}/validator/aliases`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching validator aliases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch validator aliases' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getReqAuthToken(request)
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_URL}/validator/aliases/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error importing validator aliases:', error)
    return NextResponse.json(
      { error: 'Failed to import validator aliases' },
      { status: 500 }
    )
  }
}