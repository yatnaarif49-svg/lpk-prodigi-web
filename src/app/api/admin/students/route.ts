import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: Ambil seluruh daftar siswa dari Database Real (Prisma)
export async function GET() {
  try {
    const students = await prisma.siswa.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        lpkPenyangga: true, // Ambil relasi LPK Penyangga agar nama LPK bisa dirender
      },
    });

    // Formating data agar sesuai dengan mapper di studentService
    const formattedStudents = students.map((s: any) => ({
      id: s.id,
      namaLengkap: s.namaLengkap,
      nik: s.nik,
      sekolahAsal: s.sekolahAsal,
      namaLpk: s.lpkPenyangga?.nama || 'LPK SO PRODIGI',
      status: s.status,
      pasporUploaded: Boolean(s.pasporUploaded),
      ijazahUploaded: Boolean(s.ijazahUploaded),
    }));

    return NextResponse.json({
      success: true,
      data: formattedStudents,
    });
  } catch (error) {
    console.error('Database GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data dari database' },
      { status: 500 }
    );
  }
}

// 2. POST: Simpan data siswa baru ke Database Real (Prisma)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi field wajib
    if (!body.namaLengkap && !body.nama) {
      return NextResponse.json(
        { success: false, error: 'Nama siswa wajib diisi' },
        { status: 400 }
      );
    }

    // Simpan ke database MySQL via Prisma
    const newStudent = await prisma.siswa.create({
      data: {
        namaLengkap: body.namaLengkap || body.nama,
        nik: body.nik,
        sekolahAsal: body.sekolahAsal,
        lpkPenyanggaId: body.lpkPenyanggaId || null,
        status: body.status || 'Pendaftaran',
      },
      include: {
        lpkPenyangga: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newStudent.id,
          namaLengkap: newStudent.namaLengkap,
          nik: newStudent.nik,
          sekolahAsal: newStudent.sekolahAsal,
          namaLpk: (newStudent as any).lpkPenyangga?.nama || 'LPK SO PRODIGI',
          status: newStudent.status,
          pasporUploaded: Boolean((newStudent as any).pasporUploaded),
          ijazahUploaded: Boolean((newStudent as any).ijazahUploaded),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menyimpan data ke database' },
      { status: 500 }
    );
  }
}