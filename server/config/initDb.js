const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../../database/bookmyadvocate.db');
const db = new sqlite3.Database(dbPath);

const createTables = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // 1. Users Table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('admin', 'advocate', 'user')),
                phone TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // 2. Advocates Table
            db.run(`CREATE TABLE IF NOT EXISTS advocates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                specialization TEXT,
                experience_years INTEGER,
                bar_council_number TEXT,
                location TEXT,
                bio TEXT,
                hourly_rate REAL,
                rating REAL DEFAULT 0,
                is_verified INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`);

            // 3. Services Table (With new location column)
            db.run(`CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                advocate_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                service_type TEXT CHECK(service_type IN ('online', 'offline', 'both')),
                category TEXT,
                price REAL NOT NULL,
                duration_minutes INTEGER NOT NULL,
                location TEXT, -- New Column
                is_active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (advocate_id) REFERENCES advocates(id) ON DELETE CASCADE
            )`);

            // 4. Bookings Table
            db.run(`CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                service_id INTEGER NOT NULL,
                status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
                scheduled_date DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (service_id) REFERENCES services(id)
            )`);

            // 5. Reviews Table
            db.run(`CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                booking_id INTEGER NOT NULL,
                rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (booking_id) REFERENCES bookings(id)
            )`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
};

const runMigrations = () => {
    return new Promise((resolve) => {
        // Attempt to add location column if it doesn't exist (Migration)
        db.run(`ALTER TABLE services ADD COLUMN location TEXT`, (err) => {
            if (err && err.message.includes('duplicate column name')) {
                // Column already exists, ignore error
                console.log('Migration: Location column already exists in services.');
            } else if (err) {
                console.error('Migration Warning:', err.message);
            } else {
                console.log('Migration: Successfully added location column to services.');
            }
            resolve();
        });
    });
};

const seedData = async () => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Insert Users
        const users = [
            ['Admin User', 'admin@bookmyadvocate.com', hashedPassword, 'admin', '9999999999'],
            ['Advocate Rajesh Kumar', 'rajesh@advocate.com', hashedPassword, 'advocate', '9876543220'],
            ['Advocate Priya Sharma', 'priya@advocate.com', hashedPassword, 'advocate', '9876543221'],
            ['Advocate Amit Patel', 'amit@advocate.com', hashedPassword, 'advocate', '9876543222'],
            ['Advocate Sunita Reddy', 'sunita@advocate.com', hashedPassword, 'advocate', '9876543223'],
            ['Advocate Vikram Singh', 'vikram@advocate.com', hashedPassword, 'advocate', '9876543224']
        ];

        for (const user of users) {
            db.run(`INSERT OR IGNORE INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)`, user);
        }

        // Insert Advocates (Assuming IDs 2-6 based on insertion order)
        // Note: In a real app, you should fetch the user_id first. For seeding, this assumes a fresh DB.
        const advocateProfiles = [
            [2, 'Criminal Law', 15, 'BAR/DL/2008/1', 'New Delhi', 'Criminal defense specialist.', 5000],
            [3, 'Corporate Law', 12, 'BAR/MH/2011/2', 'Mumbai', 'Expert in company law.', 6000],
            [4, 'Family Law', 10, 'BAR/KA/2013/3', 'Bangalore', 'Specialized in divorce/custody.', 4000],
            [5, 'Property Law', 8, 'BAR/TN/2015/4', 'Chennai', 'Real estate and property law.', 4500],
            [6, 'Civil Litigation', 7, 'BAR/UP/2016/5', 'Noida', 'Civil dispute resolution.', 3500]
        ];

        for (const profile of advocateProfiles) {
            db.run(`INSERT OR IGNORE INTO advocates (user_id, specialization, experience_years, bar_council_number, location, bio, hourly_rate, is_verified) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, 1)`, profile);
        }

        console.log('Database initialization & seeding completed!');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

// Main Execution Flow
const init = async () => {
    try {
        await createTables();
        await runMigrations(); // Checks for new columns in existing DB
        await seedData();
        db.close();
    } catch (err) {
        console.error('Initialization failed:', err);
    }
};

init();