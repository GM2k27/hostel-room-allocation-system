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
    const data = Object.values(req.body);

    if (data.length < 6) {
        return res.status(400).json({ error: 'Invalid student data' });
    }

    db.query(
        `INSERT INTO students 
        (student_id, first_name, last_name, gender, phone, email)
        VALUES (?,?,?,?,?,?)`,
        data,
        err => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            res.sendStatus(201);
        }
    );
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
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.json(rows);
    });
});

app.post('/roomtypes', (req, res) => {
    const { type_name, default_price } = req.body;

    db.query(
        'INSERT INTO roomtypes (type_name, default_price) VALUES (?, ?)',
        [type_name, default_price],
        err => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            res.sendStatus(201);
        }
    );
});


/* ================= ROOMS ================= */
app.get('/rooms', (req, res) => {
    db.query('SELECT * FROM rooms', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.json(rows);
    });
});

app.post('/rooms', (req, res) => {
    const { room_id, hostel_id, type_name, room_number } = req.body;

    db.query(
        'INSERT INTO rooms (room_id, hostel_id, type_name, room_number, status) VALUES (?,?,?,?,?)',
        [room_id, hostel_id, type_name, room_number, 'Available'],
        err => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            res.sendStatus(201);
        }
    );
});


/* ================= ALLOCATIONS ================= */
app.get('/allocations', (req, res) => {
    db.query('SELECT * FROM allocations', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.json(rows);
    });
});

app.post('/allocations', (req, res) => {
    const {
        allocation_id,
        student_id,
        room_id,
        allocation_date,
        checkout_date
    } = req.body;

    db.query(
        `INSERT INTO allocations 
        (allocation_id, student_id, room_id, allocation_date, checkout_date)
        VALUES (?,?,?,?,?)`,
        [
            allocation_id,
            student_id,
            room_id,
            allocation_date,
            checkout_date || null
        ],
        err => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            res.sendStatus(201);
        }
    );
});

/* ================= PAYMENTS ================= */
app.get('/payments', (req, res) => {
    db.query('SELECT * FROM payments', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.json(rows);
    });
});

app.post('/payments', (req, res) => {
    const {
        payment_id,
        student_id,
        amount,
        payment_date,
        description
    } = req.body;

    db.query(
        `INSERT INTO payments 
        (payment_id, student_id, amount, payment_date, description)
        VALUES (?,?,?,?,?)`,
        [
            payment_id,
            student_id,
            amount,
            payment_date,
            description || null
        ],
        err => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            res.sendStatus(201);
        }
    );
});

/* ================= SERVER ================= */
app.listen(3000, () =>
    console.log('Server running on http://localhost:3000')
);
