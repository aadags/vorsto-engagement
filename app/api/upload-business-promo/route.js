import { NextResponse } from 'next/server';
import cloudinary from '@/cloudinary/config';
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const org = await prisma.organization.findFirstOrThrow({
      where: { id: organizationId },
    });

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const MAX_SIZE = 1000 * 1024; // 1000KB (1MB)

    // 🔍 Step 1: Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: `File "${file.name}" exceeds the 1000KB limit (${(file.size / 1024).toFixed(1)}KB)`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'vorsto' }, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    await prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        promo_image: upload.secure_url,
      },
    });

    return NextResponse.json({ success: true, file: upload });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
