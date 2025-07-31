import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '../../../../../src/constants/envars'
import getReqAuthToken from '../../../../../utilities/getReqAuthToken'

export async function PUT(request: NextRequest, { params }: { params: { index: string } }) {
  try {
    const token = getReqAuthToken(request)
    const body = await request.json()
    const { index } = params

    const response = await fetch(`${BACKEND_URL}/validator/aliases/${index}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
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
    console.error('Error updating validator alias:', error)
    return NextResponse.json({ error: 'Failed to update validator alias' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { index: string } }) {
  try {
    const token = getReqAuthToken(request)
    const { index } = params

    const response = await fetch(`${BACKEND_URL}/validator/aliases/${index}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error deleting validator alias:', error)
    return NextResponse.json({ error: 'Failed to delete validator alias' }, { status: 500 })
  }
}
