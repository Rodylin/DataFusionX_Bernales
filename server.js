import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'task_management'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/api/qrcodes', (req, res) => {
  const sql = 'SELECT * FROM qr_codes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching QR codes:', err);
      res.status(500).send('Server error');
      return;
    }
    res.send(results);
  });
});

app.post('/api/qrcodes', (req, res) => {
  const { text, qr_code_url } = req.body;
  const sql = 'INSERT INTO qr_codes (text, qr_code_url) VALUES (?, ?)';
  db.query(sql, [text, qr_code_url], (err, result) => {
    if (err) {
      console.error('Error inserting QR code:', err);
      res.status(500).send('Server error');
      return;
    }
    res.send(result);
  });
});

app.delete('/api/qrcodes/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM qr_codes WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting QR code:', err);
      res.status(500).send('Server error');
      return;
    }
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
