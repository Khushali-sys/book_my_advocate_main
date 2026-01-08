# Database Setup Instructions

## Method 1: Using MySQL Command Line

1. **Open Command Prompt or PowerShell**

2. **Navigate to the database folder:**
```bash
cd C:\BookMyAdvocate\database
```

3. **Run the SQL script:**
```bash
mysql -u root -p < setup.sql
```

4. **Enter your MySQL password when prompted**

## Method 2: Using MySQL Workbench

1. **Open MySQL Workbench**
2. **Connect to your MySQL server**
3. **Click: File → Open SQL Script**
4. **Select: `C:\BookMyAdvocate\database\setup.sql`**
5. **Click the lightning bolt icon (Execute)**

## Method 3: Using phpMyAdmin (XAMPP)

1. **Start XAMPP and MySQL**
2. **Open: http://localhost/phpmyadmin**
3. **Click "Import" tab**
4. **Choose file: `setup.sql`**
5. **Click "Go" button**

## Method 4: Copy-Paste in MySQL Console

1. **Open MySQL Console/Command Line**
```bash
mysql -u root -p
```

2. **Open the setup.sql file in a text editor**
3. **Copy all contents**
4. **Paste into MySQL console**
5. **Press Enter**

## Verification

After running the script, verify the setup:

```sql
USE bookmyadvocate;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM advocates;
SELECT COUNT(*) FROM services;
```

You should see:
- 5 tables created (users, advocates, services, bookings, reviews)
- 9 users (1 admin, 3 regular users, 5 advocates)
- 5 advocate profiles
- 15 services
- 5 sample bookings
- 2 sample reviews

## Default Login Credentials

**Admin Account:**
- Email: `admin@bookmyadvocate.com`
- Password: `admin123`

**Sample User:**
- Email: `john@example.com`
- Password: `admin123`

**Sample Advocate:**
- Email: `rajesh@advocate.com`
- Password: `admin123`

## Troubleshooting

### Error: "Access denied"
- Check your MySQL username and password
- Default is usually: username=`root`, password=`empty` or `root`

### Error: "Database already exists"
- The script will drop and recreate tables safely
- Or manually drop database first: `DROP DATABASE bookmyadvocate;`

### Error: "Table already exists"
- The script uses `DROP TABLE IF EXISTS` so this shouldn't happen
- If it does, run: `DROP DATABASE bookmyadvocate;` then re-run the script

## What's Created

### Tables:
1. **users** - All user accounts (users, advocates, admin)
2. **advocates** - Advocate profiles and details
3. **services** - Services offered by advocates
4. **bookings** - Appointment bookings
5. **reviews** - User reviews for advocates

### Sample Data:
- 1 Admin user
- 3 Regular users
- 5 Advocates with complete profiles
- 15 Legal services across different categories
- 5 Sample bookings (various statuses)
- 2 Reviews

### Specializations Included:
- Criminal Law
- Corporate Law
- Family Law
- Property Law
- Civil Litigation
