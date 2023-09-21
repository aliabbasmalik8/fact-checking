import { NextResponse } from 'next/server'
import { getJson } from "serpapi";

export async function POST(req) {
  const { query } = await req.json()
  const params = {
    q: query,
    api_key: "0b3e5c180ee5003348588f9148ee477e24767b49eea365f20966edbba21cc3f1"
  }

  const response = await getJson("google", params);
  return NextResponse.json({ data: response })
}