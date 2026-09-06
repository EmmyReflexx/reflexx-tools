// app/proxy-download/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
  }

  try {
    // Fetch the cross-origin image on the server side
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image from source');

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Identify content type or fall back to standard image
    const contentType = response.headers.get('content-type') || 'image/png';

    // Attempt to parse a natural filename or fallback
    const urlPathname = new URL(imageUrl).pathname;
    const filename = urlPathname.split('/').pop() || 'reflexx-tools-qr-and-barcode-generator.png';

    // Return the file with an attachment header to force download
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Server proxy download failed:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
