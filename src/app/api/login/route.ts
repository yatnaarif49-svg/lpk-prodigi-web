import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Tambahkan logika autentikasi atau proxy ke backend Express di sini
    // Contoh dummy response:
    if (email === 'admin@gmail.com' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        user: {
          id: '1',
          name: 'Administrator',
          email: 'admin@gmail.com',
          role: 'admin',
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Email atau password salah' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}