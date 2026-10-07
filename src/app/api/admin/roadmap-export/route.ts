import { NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const claims = await verifySessionCookie();
    // Allow admin or staff to download complete master dataset
    if (!claims || (claims.role !== 'admin' && claims.role !== 'counsellor' && claims.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const filePath = path.join(process.cwd(), 'Career_Roadmap_COMPLETE_DATA.xlsx');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Master export file not found. Please run export script.' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Career_Roadmap_COMPLETE_DATA.xlsx"',
      },
    });
  } catch (error: any) {
    console.error('Error serving roadmap master export:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
