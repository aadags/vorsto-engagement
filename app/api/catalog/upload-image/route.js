import { NextResponse } from 'next/server';
import cloudinary from '@/cloudinary/config';
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file');
    const productId = formData.get('productId');

    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const MAX_SIZE = 800 * 1024; // 800KB

    // 🔍 Step 1: Validate all file sizes
    for (const file of files) {
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds the 800KB limit (${(file.size / 1024).toFixed(1)}KB)`,
          },
          { status: 400 }
        );
      }
    }

    const uploads = await Promise.all(
      files.map(async (file) => {
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

        return upload;
      })
    );

    if(productId)
    {
      for (const [index, img] of uploads.entries()) {
        await prisma.image.create({
          data: {
            product_id: productId,
            url: img.secure_url,
            cloud_id: img.public_id,
          },
        });
      }
    }

    return NextResponse.json({ success: true, files: uploads });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
