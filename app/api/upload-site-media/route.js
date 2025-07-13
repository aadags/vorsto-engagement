import { NextResponse } from 'next/server'
import prisma from '@/db/prisma'
import { v2 as cloudinary } from 'cloudinary'

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get('organizationId')?.value ?? 0)
    const formData = await req.formData()

    const file = formData.get('file')
    const template = formData.get('template')
    const key = formData.get('key')

    if (!file || typeof file === 'string' || !template || !key) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const MAX_SIZE = 1000 * 1024
    if ((file).size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: `File "${(file).name}" exceeds 1000KB limit`,
        },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await (file).arrayBuffer())

    // 📤 Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'vorsto' }, (err, result) => {
          if (err) return reject(err)
          resolve(result)
        })
        .end(buffer)
    })

    const { secure_url } = uploadResult

    // 🔄 Update org.template_media JSON
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { template_media: true },
    })

    const currentMedia = org?.template_media || {}
    const updatedMedia = {
      ...currentMedia,
      [template]: {
        ...(currentMedia[template] || {}),
        [key]: secure_url,
      },
    }

    await prisma.organization.update({
      where: { id: organizationId },
      data: { template_media: updatedMedia },
    })

    return NextResponse.json({ url: secure_url })
  } catch (error) {
    console.error('[Upload Error]', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
