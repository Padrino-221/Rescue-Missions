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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = readData()
  const event = data.find((e: any) => e.id === Number(id))
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(event)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const data = readData()
  const index = data.findIndex((e: any) => e.id === Number(id))
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  data[index] = { ...data[index], ...body }
  writeData(data)
  return NextResponse.json(data[index])
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = readData()
  const filtered = data.filter((e: any) => e.id !== Number(id))
  writeData(filtered)
  return NextResponse.json({ success: true })
}
