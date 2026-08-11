import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export const config = {
  api: { bodyParser: { sizeLimit: '12mb' } },
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'rescue-mission'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `Image is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB` }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as { secure_url: string; public_id: string })
        }
      )
      uploadStream.end(buffer)
    })

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
