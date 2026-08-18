import mysql from 'mysql2/promise';
import { crypto } from 'node:crypto';
import 'dotenv/config';

async function main() {
  console.log('Start seeding demo accounts...');

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL tidak ditemukan di file .env');
  }

  // Buat koneksi langsung ke MySQL Laragon
  const connection = await mysql.createConnection(dbUrl);

  try {
    // 1. Akun Admin Pusat
    const pusatId = '11111111-1111-1111-1111-111111111111';
    await connection.execute(
      `INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), role=VALUES(role)`,
      [pusatId, 'Admin Prodigi', 'admin@prodigi.id', 'admin123', 'pusat']
    );

    // 2. Akun Marketing
    const marketingId = '22222222-2222-2222-2222-222222222222';
    await connection.execute(
      `INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), role=VALUES(role)`,
      [marketingId, 'Budi Santoso', 'budi@prodigi.id', 'marketing123', 'marketing']
    );

    // 3. Akun LPK Penyangga
    const lpkUserId = '33333333-3333-3333-3333-333333333333';
    await connection.execute(
      `INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), role=VALUES(role)`,
      [lpkUserId, 'Siti Rahayu', 'lpk.binakarya@gmail.com', 'lpk123', 'lpk_penyangga']
    );

    // 4. LPK Penyangga Profile
    const profileId = '44444444-4444-4444-4444-444444444444';
    await connection.execute(
      `INSERT INTO LpkPenyanggaProfile (id, userId, namaLpk, penanggungJawab, wilayah, createdAt)
       VALUES (?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE namaLpk=VALUES(namaLpk), penanggungJawab=VALUES(penanggungJawab), wilayah=VALUES(wilayah)`,
      [profileId, lpkUserId, 'LPK Bina Karya', 'Siti Rahayu', 'Jawa Tengah']
    );

    console.log('✅ Seeding berhasil! Data akun demo telah masuk ke database Laragon.');
  } finally {
    await connection.end();
  }
}

main().catch((e) => {
  console.error('❌ Error saat seeding:', e);
  process.exit(1);
});