import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'app', 'admin', 'products');
    fs.rmSync(dir, { recursive: true, force: true });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete folder error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete folder' }, { status: 500 });
  }
}
