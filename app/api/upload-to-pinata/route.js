// app/api/upload-to-pinata/route.js
// app/api/upload-to-pinata/route.js  ← add these 3 lines right at the top
console.log('=== ENV DEBUG ===');
console.log('PINATA_JWT exists:', !!process.env.PINATA_JWT);
console.log('First 20 chars:', process.env.PINATA_JWT?.substring(0, 20));
import { NextResponse } from 'next/server';

const PINATA_JWT = process.env.PINATA_JWT;

export async function POST(request) {
  if (!PINATA_JWT) {
    return NextResponse.json(
      { error: 'Pinata JWT not configured' },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No valid file provided' }, { status: 400 });
  }

  // Prepare data for Pinata
  const pinataFormData = new FormData();
  pinataFormData.append('file', file);

  // Optional: add metadata (name, keyvalues, etc.)
  const metadata = JSON.stringify({
    name: file.name,
  });
  pinataFormData.append('pinataMetadata', metadata);

  try {
    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: pinataFormData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Pinata error:', data);
      return NextResponse.json(
        { error: data.error?.details || data.error?.reason || 'Upload failed' },
        { status: res.status }
      );
    }

    const uri = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    return NextResponse.json({ uri });
  } catch (err) {
    console.error('Unexpected upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}