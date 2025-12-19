require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

/* ================= STUDENTS ================= */
app.get('/students', (req, res) => {
    db.query('SELECT * FROM students', (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.post('/students', (req, res) => {
    const { student_id, first_name, last_name, gender, phone, email } = req.body;

    db.query(
        `INSERT INTO students (student_id, first_name, last_name, gender, phone, email)
     VALUES (?,?,?,?,?,?)`,
        [student_id, first_name, last_name, gender, phone, email],
        err => {
            if (err) return res.status(500).json(err);
            res.sendStatus(201);
        }
    );
});

/* students with rooms */
app.get('/reports/students-with-rooms', (req, res) => {
    const sql = `
    SELECT 
      s.student_id,
      s.first_name,
      s.last_name,
      s.gender,
      s.phone,
      s.email,
      r.room_number
    FROM students s
    JOIN allocations a ON s.student_id = a.student_id
    JOIN rooms r ON a.room_id = r.room_id
  `;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

/* ================= HOSTELS ================= */
app.get('/hostels', (req, res) => {
    db.query('SELECT * FROM hostels', (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.post('/hostels', (req, res) => {
    const { hostel_id, hostel_name, location, total_rooms } = req.body;

    db.query(
        'INSERT INTO hostels VALUES (?,?,?,?)',
        [hostel_id, hostel_name, location, total_rooms],
        err => {
            if (err) return res.status(500).json(err);
            res.sendStatus(201);
        }
    );
});

/* ================= ROOM TYPES ================= */
app.get('/roomtypes', (req, res) => {
    db.query('SELECT * FROM roomtypes', (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.post('/roomtypes', (req, res) => {
    const { type_name, default_price } = req.body;

    db.query(
        'INSERT INTO roomtypes (type_name, default_price) VALUES (?,?)',
        [type_name, default_price],
        err => {
            if (err) return res.status(500).json(err);
            res.sendStatus(201);
        }
    );
});

/* ================= ROOMS ================= */
app.get('/rooms', (req, res) => {
    db.query('SELECT * FROM rooms', (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.post('/rooms', (req, res) => {
    const { room_id, hostel_id, type_name, room_number } = req.body;

    db.query(
        `INSERT INTO rooms (room_id, hostel_id, type_name, room_number, status)
     VALUES (?,?,?,?,?)`,
        [room_id, hostel_id, type_name, room_number, 'Available'],
        err => {
            if (err) return res.status(500).json(err);
            res.sendStatus(201);
        }
    );
});

/* rooms + hostel names (FIXED) */
app.get('/reports/rooms-hostels', (req, res) => {
    const sql = `
    SELECT
  r.room_id,
  r.room_number,
  h.hostel_name,
  CASE
    WHEN COUNT(a.student_id) <
      CASE
        WHEN r.type_name LIKE '%Single%' THEN 1
        WHEN r.type_name LIKE '%Double%' THEN 2
        WHEN r.type_name LIKE '%Triple%' THEN 3
        ELSE 1
      END
    THEN 'Available'
    ELSE 'Occupied'
  END AS status
FROM rooms r
JOIN hostels h ON r.hostel_id = h.hostel_id
LEFT JOIN allocations a
  ON r.room_id = a.room_id
 AND a.checkout_date IS NULL
GROUP BY r.room_id

  `;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

/* ================= ALLOCATIONS ================= */
app.get('/allocations', (req, res) => {
    db.query('SELECT * FROM allocations', (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.post('/allocations', (req, res) => {
    const { allocation_id, student_id, room_id, allocation_date, checkout_date } = req.body;

    const roomTypeQuery = 'SELECT type_name FROM rooms WHERE room_id = ?';

    db.query(roomTypeQuery, [room_id], (err, roomRows) => {
        if (err || roomRows.length === 0) {
            return res.status(400).json({ error: 'Room not found' });
        }

        const type = roomRows[0].type_name.toLowerCase();
        let max = 1;
        if (type.includes('double')) max = 2;
        if (type.includes('triple')) max = 3;

        db.query(
            'SELECT COUNT(*) AS cnt FROM allocations WHERE room_id = ? AND checkout_date IS NULL',
            [room_id],
            (err, countRows) => {
                if (countRows[0].cnt >= max) {
                    return res.status(400).json({ error: 'Room capacity exceeded' });
                }

                db.query(
                    `INSERT INTO allocations
           (allocation_id, student_id, room_id, allocation_date, checkout_date)
           VALUES (?,?,?,?,?)`,
                    [allocation_id, student_id, room_id, allocation_date, checkout_date || null],
                    err => {
                        if (err) return res.status(500).json(err);
                        res.sendStatus(201);
                    }
                );
            }
        );
    });
});

/* ================= PAYMENTS ================= */
app.get('/payments', (req, res) => {
    db.query('SELECT * FROM payments', (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.get('/reports/total-payments', (req, res) => {
    const sql = `
    SELECT 
      s.student_id,
      CONCAT(s.first_name, ' ', s.last_name) AS student_name,
      SUM(p.amount) AS total_paid
    FROM students s
    JOIN payments p ON s.student_id = p.student_id
    GROUP BY s.student_id, student_name
  `;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});


app.post('/payments', (req, res) => {
    const { payment_id, student_id, amount, payment_date, description } = req.body;

    db.query(
        `INSERT INTO payments
     (payment_id, student_id, amount, payment_date, description)
     VALUES (?,?,?,?,?)`,
        [payment_id, student_id, amount, payment_date, description || null],
        err => {
            if (err) return res.status(500).json(err);
            res.sendStatus(201);
        }
    );
});

/* ================= SERVER ================= */
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});