import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_PATH = join(process.cwd(), 'data', 'events.json')

function readData() {
  if (!existsSync(DATA_PATH)) return []
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
}

function writeData(data: unknown[]) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

export async function GET() {
  return NextResponse.json(readData())
}

export async function POST(request: Request) {
  const body = await request.json()
  const data = readData()
  const newEvent = { id: Date.now(), ...body }
  data.push(newEvent)
  writeData(data)
  return NextResponse.json(newEvent, { status: 201 })
}
