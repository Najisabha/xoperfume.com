
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'xo-perfumes/',
      max_results: 500
    });

    const blobs = resources.map((resource: any) => ({
      url: resource.secure_url,
      pathname: resource.public_id,
      size: resource.bytes,
      uploadedAt: resource.created_at,
    }));

    return NextResponse.json({ blobs });
  } catch (error: any) {
    console.error('Error fetching blobs:', error);
    return NextResponse.json({ error: 'Failed to fetch blobs: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();

    // Extract public_id from URL
    // Format: .../upload/v12345/xo-perfumes/filename.jpg
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const filename = lastPart.split('.')[0];
    const publicId = `xo-perfumes/${filename}`;

    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting blob:', error);
    return NextResponse.json({ error: 'Failed to delete file: ' + error.message }, { status: 500 });
  }
}