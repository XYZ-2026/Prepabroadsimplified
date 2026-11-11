import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserRole } from '@/lib/auth';
import { uploadPortfolioPhoto, PortfolioValidationError } from '@/lib/portfolio-service';

export const dynamic = 'force-dynamic';

/** POST multipart/form-data { photo: File } → { url } (Wix media URL). */
export async function POST(request: Request) {
  const claims = await verifySessionCookie();
  if (!claims?.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = await getUserRole();
  if (role !== 'student') {
    return NextResponse.json({ error: 'Only students can upload a portfolio photo.' }, { status: 403 });
  }

  let file: FormDataEntryValue | null = null;
  try {
    const form = await request.formData();
    file = form.get('photo');
  } catch {
    return NextResponse.json({ error: 'Invalid upload.' }, { status: 400 });
  }
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Please choose a photo to upload.' }, { status: 400 });
  }

  try {
    const url = await uploadPortfolioPhoto(claims.uid, file);
    return NextResponse.json({ success: true, url });
  } catch (err) {
    if (err instanceof PortfolioValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error('[Portfolio API] Photo upload failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Could not upload photo.' },
      { status: 502 },
    );
  }
}
