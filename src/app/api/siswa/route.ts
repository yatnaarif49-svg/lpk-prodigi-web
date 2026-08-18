import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const siswa = await prisma.student.findMany({
      include: {
        lpkPenyangga: true,
      },
    });
    return NextResponse.json({ success: true, data: siswa });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 });
  }
}