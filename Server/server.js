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

db.exec('DROP TABLE IF EXISTS faults');

db.exec(`
    CREATE TABLE IF NOT EXISTS faults (
        fault_id INTEGER PRIMARY KEY AUTOINCREMENT,
        pole_id TEXT NOT NULL,
        ward TEXT,
        street TEXT,
        reported_date TEXT NOT NULL,
        fault_type TEXT NOT NULL,
        status TEXT DEFAULT "Pending",
        repaired_date TEXT,
        version INTEGER DEFAULT 1,
        UNIQUE(pole_id, reported_date, fault_type)
    );
`);

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

    // --- 1. Pole ID validation ---
    if (!pole_id || pole_id.trim() === '') {
        return res.status(400).json({ error: 'Pole ID is required' });
    }
    if (pole_id.trim().length < 3) {
        return res.status(400).json({ error: 'Pole ID must be at least 3 characters (e.g., P-101)' });
    }

    // --- 2. Ward validation (must be "Ward [number]" format if provided) ---
    let wardValue = null;
    if (ward && ward.trim() !== '') {
        const wardTrimmed = ward.trim();
        
        // Check format: "Ward" + space + number(s)
        if (!wardTrimmed.match(/^Ward \d+$/)) {
            return res.status(400).json({ 
                error: 'Ward must be in format: "Ward X" (e.g., "Ward 5", "Ward 12")' 
            });
        }
        
        // Extract the number part
        const wardNumber = parseInt(wardTrimmed.split(' ')[1]);
        if (wardNumber < 1 || wardNumber > 999) {
            return res.status(400).json({ 
                error: 'Ward number must be between 1 and 999' 
            });
        }
        
        wardValue = wardTrimmed;
    }

    // --- 3. Street validation ---
    if (!street || street.trim() === '') {
        return res.status(400).json({ error: 'Street is required' });
    }

    // --- 4. Reported date validation ---
    if (!reported_date || isNaN(new Date(reported_date))) {
        return res.status(400).json({ error: 'Valid reported date is required' });
    }
    if (new Date(reported_date) > new Date()) {
        return res.status(400).json({ error: 'Reported date cannot be in the future' });
    }

    // --- 5. Fault type validation ---
    const validFaultTypes = ['Bulb Fuse', 'Cable Cut', 'Pole Damaged'];
    if (fault_type && !validFaultTypes.includes(fault_type)) {
        return res.status(400).json({ error: 'Fault type must be one of: Bulb Fuse, Cable Cut, Pole Damaged' });
    }

    // --- 6. Calculate derived figure ---
    const today = new Date();
    const reportDate = new Date(reported_date);
    const daysOutstanding = Math.floor((today - reportDate) / (1000 * 60 * 60 * 24));

    // --- 7. Insert ---
    try {
        const info = insert.run(
            pole_id.trim(),
            wardValue,  // ← "Ward X" format or null
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
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'A fault for this pole on this date with this type already exists. Only one submission allowed.' });
        }
        throw err;
    }
});

app.get('/api/faults', (req, res) => {
    const { search, status } = req.query;
    
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
    
    sql += ` ORDER BY CASE 
        WHEN status = 'Pending' THEN 0 
        WHEN status = 'In Progress' THEN 1 
        ELSE 2 
    END, reported_date ASC`;
    
    const stmt = db.prepare(sql);
    const faults = stmt.all(...params);

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
                daysOutstanding = 0;
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

// ========== PUT /api/faults/:id (Update Status with Optimistic Locking) ==========
app.put('/api/faults/:id', (req, res) => {
    const { status, repaired_date, version } = req.body;
    const faultId = req.params.id;

    // --- Validation ---
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }
    if (!version) {
        return res.status(400).json({ error: 'Version is required for optimistic locking' });
    }

    // --- Check if fault exists ---
    const current = db.prepare('SELECT version, status FROM faults WHERE fault_id = ?').get(faultId);
    if (!current) {
        return res.status(404).json({ error: 'Fault not found' });
    }

    // --- Check version (Optimistic Locking) ---
    if (current.version !== version) {
        return res.status(409).json({
            error: '❌ This fault was modified by another user. Please refresh and try again.',
            current_version: current.version
        });
    }

    // --- If status is "Repaired", set repaired_date to today ---
    let finalRepairedDate = repaired_date;
    if (status === 'Repaired' && !repaired_date) {
        finalRepairedDate = new Date().toISOString().split('T')[0];
    }

    // --- Update only if version matches ---
    const result = db.prepare(`
        UPDATE faults 
        SET status = ?, repaired_date = ?, version = version + 1
        WHERE fault_id = ? AND version = ?
    `).run(status, finalRepairedDate || null, faultId, version);

    // --- Check if update actually happened ---
    if (result.changes === 0) {
        return res.status(409).json({
            error: '❌ This fault was modified by another user. Please refresh and try again.'
        });
    }

    // --- Success ---
    const updatedFault = db.prepare('SELECT * FROM faults WHERE fault_id = ?').get(faultId);
    res.json({
        message: '✅ Fault updated successfully',
        fault: updatedFault,
        new_version: updatedFault.version
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
