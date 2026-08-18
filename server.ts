import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool(process.env.DATABASE_URL!);

// ==========================================
// 1. READ / GET DATA STATISTIK PUSAT
// ==========================================
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [[{ totalSiswa }]] = await pool.query('SELECT COUNT(*) as totalSiswa FROM Student');
    const [[{ totalLpk }]] = await pool.query('SELECT COUNT(*) as totalLpk FROM LpkPenyanggaProfile');
    const [[{ totalMarketing }]] = await pool.query("SELECT COUNT(*) as totalMarketing FROM User WHERE role = 'marketing'");

    res.json({ totalSiswa, totalLpk, totalMarketing });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil statistik' });
  }
});

// ==========================================
// 2. CRUD LPK PENYANGGA
// ==========================================
// GET All LPK Penyangga
app.get('/api/admin/lpk', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.namaLpk, p.penanggungJawab, p.wilayah, u.email, u.id as userId
      FROM LpkPenyanggaProfile p
      JOIN User u ON p.userId = u.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data LPK' });
  }
});

// CREATE LPK Penyangga (User + Profile)
app.post('/api/admin/lpk', async (req, res) => {
  const { name, email, password, namaLpk, penanggungJawab, wilayah } = req.body;
  const userId = crypto.randomUUID();
  const profileId = crypto.randomUUID();

  try {
    await pool.query(
      'INSERT INTO User (id, name, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, "lpk_penyangga", NOW(), NOW())',
      [userId, name, email, password]
    );

    await pool.query(
      'INSERT INTO LpkPenyanggaProfile (id, userId, namaLpk, penanggungJawab, wilayah, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [profileId, userId, namaLpk, penanggungJawab, wilayah]
    );

    res.json({ success: true, message: 'LPK Penyangga berhasil ditambahkan' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Gagal menambah LPK' });
  }
});

// DELETE LPK Penyangga
app.delete('/api/admin/lpk/:id', async (req, res) => {
  const { id } = req.params; // Profile ID
  try {
    const [rows]: any = await pool.query('SELECT userId FROM LpkPenyanggaProfile WHERE id = ?', [id]);
    if (rows.length > 0) {
      await pool.query('DELETE FROM User WHERE id = ?', [rows[0].userId]); // Trigger CASCADE di DB
    }
    res.json({ success: true, message: 'LPK berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus LPK' });
  }
});

// ==========================================
// 3. CRUD SISWA (STUDENT)
// ==========================================
// GET All Siswa
app.get('/api/admin/students', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, l.namaLpk 
      FROM Student s
      LEFT JOIN LpkPenyanggaProfile l ON s.lpkPenyanggaId = l.id
      ORDER BY s.createdAt DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data siswa' });
  }
});

// CREATE Siswa
app.post('/api/admin/students', async (req, res) => {
  const { namaLengkap, nik, sekolahAsal, lpkPenyanggaId, status } = req.body;
  const id = crypto.randomUUID();

  try {
    await pool.query(
      `INSERT INTO Student (id, lpkPenyanggaId, namaLengkap, nik, sekolahAsal, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [id, lpkPenyanggaId, namaLengkap, nik, sekolahAsal, status || 'Pendaftaran']
    );
    res.json({ success: true, message: 'Siswa berhasil ditambahkan' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Gagal menambah siswa' });
  }
});

// UPDATE Status/Data Siswa
app.put('/api/admin/students/:id', async (req, res) => {
  const { id } = req.params;
  const { namaLengkap, sekolahAsal, status } = req.body;

  try {
    await pool.query(
      'UPDATE Student SET namaLengkap = ?, sekolahAsal = ?, status = ?, updatedAt = NOW() WHERE id = ?',
      [namaLengkap, sekolahAsal, status, id]
    );
    res.json({ success: true, message: 'Data siswa diperbarui' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui data siswa' });
  }
});

// DELETE Siswa
app.delete('/api/admin/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Student WHERE id = ?', [id]);
    res.json({ success: true, message: 'Siswa berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus siswa' });
  }
});

app.listen(5000, () => console.log('API Admin Pusat berjalan di port 5000'));