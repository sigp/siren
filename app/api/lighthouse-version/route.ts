import { NextResponse } from 'next/server'
import fetchFromApi from '../../../utilities/fetchFromApi';

const validatorUrl = process.env.VALIDATOR_URL;
const apiToken = process.env.API_TOKEN;

export async function GET() {
  try {
    const { data } = await fetchFromApi(`${validatorUrl}/lighthouse/version`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      }
    });
    return NextResponse.json({data: data})
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch beacon node version' }, {status: 500})
  }
}
