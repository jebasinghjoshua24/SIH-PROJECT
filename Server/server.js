const express = require("express");
const cors = require("cors");
const path = require("path");
const database = require('better-sqlite3');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = 2000;

const db = new database('faults.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS faults (
        fault_id INTEGER PRIMARY KEY AUTOINCREMENT,
        pole_id TEXT NOT NULL,
        ward TEXT,
        street TEXT,
        reported_date TEXT NOT NULL,
        fault_type TEXT NOT NULL,
        status TEXT DEFAULT "Pending",
        repaired_date TEXT
    );
`);

db.exec('DELETE FROM faults');

const insert = db.prepare(`
    INSERT INTO faults (pole_id, ward, street, reported_date, fault_type, status, repaired_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const seedData = [
    // === NORMAL RECORDS (37 of these) ===
    ['P-101', 'Ward 5', 'MG Road', '2026-07-20', 'Bulb Fuse', 'Pending', null],
    ['P-102', 'Ward 3', 'Church Street', '2026-07-18', 'Cable Cut', 'In Progress', null],
    ['P-103', 'Ward 1', 'Park Avenue', '2026-07-15', 'Pole Damaged', 'Pending', null],
    ['P-104', 'Ward 2', 'Lake View', '2026-07-10', 'Cable Cut', 'Repaired', '2026-07-12'],
    ['P-105', 'Ward 4', 'Gandhi Road', '2026-07-19', 'Bulb Fuse', 'Pending', null],
    ['P-106', 'Ward 5', 'Nehru Street', '2026-07-14', 'Cable Cut', 'Repaired', '2026-07-16'],
    ['P-107', 'Ward 3', 'Ring Road', '2026-07-12', 'Pole Damaged', 'In Progress', null],
    ['P-108', 'Ward 1', 'Old Town', '2026-07-08', 'Bulb Fuse', 'Repaired', '2026-07-09'],
    ['P-109', 'Ward 2', 'Market Road', '2026-07-21', 'Cable Cut', 'Pending', null],
    ['P-110', 'Ward 4', 'Station Road', '2026-07-17', 'Bulb Fuse', 'Pending', null],
    ['P-111', 'Ward 5', 'Hospital Road', '2026-07-13', 'Pole Damaged', 'Repaired', '2026-07-14'],
    ['P-112', 'Ward 3', 'School Lane', '2026-07-11', 'Cable Cut', 'Pending', null],
    ['P-113', 'Ward 1', 'Temple Street', '2026-07-09', 'Bulb Fuse', 'Repaired', '2026-07-10'],
    ['P-114', 'Ward 2', 'Bus Stand', '2026-07-16', 'Cable Cut', 'Pending', null],
    ['P-115', 'Ward 4', 'River View', '2026-07-22', 'Pole Damaged', 'Pending', null],
    ['P-116', 'Ward 5', 'Green Park', '2026-07-07', 'Bulb Fuse', 'Repaired', '2026-07-08'],
    ['P-117', 'Ward 3', 'Sunset Blvd', '2026-07-06', 'Cable Cut', 'Pending', null],
    ['P-118', 'Ward 1', 'North Gate', '2026-07-19', 'Pole Damaged', 'In Progress', null],
    ['P-119', 'Ward 2', 'South End', '2026-07-15', 'Bulb Fuse', 'Repaired', '2026-07-17'],
    ['P-120', 'Ward 4', 'East Street', '2026-07-20', 'Cable Cut', 'Pending', null],
    ['P-121', 'Ward 5', 'West Avenue', '2026-07-18', 'Pole Damaged', 'Pending', null],
    ['P-122', 'Ward 3', 'Central Square', '2026-07-14', 'Bulb Fuse', 'Repaired', '2026-07-15'],
    ['P-123', 'Ward 1', 'Garden Road', '2026-07-12', 'Cable Cut', 'Pending', null],
    ['P-124', 'Ward 2', 'Lakeside', '2026-07-10', 'Pole Damaged', 'Repaired', '2026-07-11'],
    ['P-125', 'Ward 4', 'Hilltop', '2026-07-08', 'Bulb Fuse', 'Pending', null],
    ['P-126', 'Ward 5', 'Valley View', '2026-07-06', 'Cable Cut', 'Repaired', '2026-07-07'],
    ['P-127', 'Ward 3', 'Riverside', '2026-07-21', 'Pole Damaged', 'Pending', null],
    ['P-128', 'Ward 1', 'Oak Tree Lane', '2026-07-17', 'Bulb Fuse', 'Pending', null],
    ['P-129', 'Ward 2', 'Pine Street', '2026-07-13', 'Cable Cut', 'In Progress', null],
    ['P-130', 'Ward 4', 'Maple Drive', '2026-07-09', 'Pole Damaged', 'Repaired', '2026-07-10'],
    ['P-131', 'Ward 5', 'Cedar Road', '2026-07-16', 'Bulb Fuse', 'Pending', null],
    ['P-132', 'Ward 3', 'Elm Street', '2026-07-11', 'Cable Cut', 'Pending', null],
    ['P-133', 'Ward 1', 'Birch Avenue', '2026-07-07', 'Pole Damaged', 'Repaired', '2026-07-08'],
    ['P-134', 'Ward 2', 'Spruce Lane', '2026-07-22', 'Bulb Fuse', 'Pending', null],
    ['P-135', 'Ward 4', 'Fir Road', '2026-07-18', 'Cable Cut', 'Pending', null],
    ['P-136', 'Ward 5', 'Redwood', '2026-07-14', 'Pole Damaged', 'Repaired', '2026-07-15'],
    ['P-137', 'Ward 3', 'Chestnut', '2026-07-12', 'Bulb Fuse', 'Pending', null],
    
    // === THE 3 AWKWARD CASES (Required by PDF) ===
    // 1. Missing Ward
    ['P-138', null, 'Main Street', '2026-07-05', 'Cable Cut', 'Pending', null],
    // 2. Similar Name (Maine vs Main)
    ['P-139', 'Ward 1', 'Maine Street', '2026-07-04', 'Bulb Fuse', 'Pending', null],
    // 3. Unrelated Record (Future date)
    ['P-140', 'Ward 2', 'Future Lane', '2027-01-01', 'Pole Damaged', 'Pending', null]
];

seedData.forEach(row => insert.run(row));

console.log(`✅ Seeded ${seedData.length} faults into the database`);

app.post('/api/faults',  (req, res) => {
    const { pole_id, ward, street, reported_date, fault_type, status, repaired_date } = req.body;

    if (!pole_id || pole_id.trim() === '') {
        return res.status(400).json({ error: 'Pole ID is required' });
    }
    if (!street || street.trim() === '') {
        return res.status(400).json({ error: 'Street is required' });
    }
    if (!reported_date || isNaN(new Date(reported_date))) {
        return res.status(400).json({ error: 'Valid reported date is required' });
    }
    if (new Date(reported_date) > new Date()) {
        return res.status(400).json({ error: 'Reported date cannot be in the future' });
    }

    const today = new Date();
    const reportDate = new Date(reported_date);
    const daysOutstanding = Math.floor((today - reportDate) / (1000 * 60 * 60 * 24));

    const info = insert.run(
        pole_id.trim(),
        ward ? ward.trim() : null,
        street.trim(),
        reported_date,
        fault_type || 'Bulb Fuse',
        status || 'Pending',
        repaired_date || null
    );

    const newFault = db.prepare('SELECT * FROM faults WHERE fault_id = ?').get(info.lastInsertRowid);

    res.status(201).json({
        fault: newFault,
        days_outstanding: daysOutstanding
    });
});

app.get('/api/faults', (req, res) => {
    const { search, status } = req.query;
    
    // --- Build the SQL query dynamically ---
    let sql = 'SELECT * FROM faults WHERE 1=1';
    const params = [];
    
    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }
    
    if (search && search.trim() !== '') {
        sql += ' AND (street LIKE ? OR pole_id LIKE ?)';
        const searchTerm = `%${search.trim()}%`;
        params.push(searchTerm, searchTerm);
    }
    
    // --- FIXED: Use single quotes for string literals ---
    sql += ` ORDER BY CASE 
        WHEN status = 'Pending' THEN 0 
        WHEN status = 'In Progress' THEN 1 
        ELSE 2 
    END, reported_date ASC`;
    
    // --- Execute the query ---
    const stmt = db.prepare(sql);
    const faults = stmt.all(...params);
    
    // --- Calculate days_outstanding for EVERY record on the server ---
    const today = new Date();
    const results = faults.map(fault => {
        let daysOutstanding = 0;
        
        // Only calculate if NOT repaired
        if (fault.status !== 'Repaired') {
            const reportDate = new Date(fault.reported_date);
            // Handle future dates gracefully (they show as 0)
            if (reportDate <= today) {
                daysOutstanding = Math.floor((today - reportDate) / (1000 * 60 * 60 * 24));
            } else {
                daysOutstanding = 0; // Future date = 0 days outstanding
            }
        }
        
        return {
            ...fault,
            days_outstanding: daysOutstanding
        };
    });
    
    res.json({
        faults: results,
        count: results.length
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})