import { NextResponse } from 'next/server'
import { BACKEND_URL } from '../../../../src/constants/envars'
import fetchFromApi from '../../../../utilities/fetchFromApi'
import getReqAuthToken from '../../../../utilities/getReqAuthToken'

export async function DELETE(req: Request, context: any) {
  try {
    const { index } = context.params
    const token = getReqAuthToken(req)

    if (!index) {
      return NextResponse.json({ error: 'No exclusion index found' }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ error: 'Authentication token is missing' }, { status: 401 })
    }

    const data = await fetchFromApi(`${BACKEND_URL}/exclude-status/${index}`, token, {
      method: 'DELETE',
    })
    return NextResponse.json(data)
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to delete exclude status'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
