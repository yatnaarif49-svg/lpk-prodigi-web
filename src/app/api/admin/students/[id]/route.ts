import { NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

// 1. PUT: Memperbarui data siswa berdasarkan ID
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    // TODO: Ganti dengan logika update database MySQL / ORM Anda di sini
    // Contoh data yang dikembalikan setelah update:
    const updatedStudent = {
      id,
      namaLengkap: body.namaLengkap || body.nama,
      nik: body.nik,
      sekolahAsal: body.sekolahAsal,
      namaLpk: body.namaLpk || 'LPK SO PRODIGI',
      status: body.status,
      pasporUploaded: body.pasporUploaded,
      ijazahUploaded: body.ijazahUploaded,
    };

    return NextResponse.json({
      success: true,
      data: updatedStudent,
      message: `Siswa dengan ID ${id} berhasil diperbarui`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui data siswa' },
      { status: 500 }
    );
  }
}

// 2. DELETE: Menghapus data siswa berdasarkan ID
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    // TODO: Ganti dengan logika hapus database MySQL / ORM Anda di sini

    return NextResponse.json({
      success: true,
      message: `Siswa dengan ID ${id} berhasil dihapus`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus data siswa' },
      { status: 500 }
    );
  }
}