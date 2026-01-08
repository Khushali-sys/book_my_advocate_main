# BookMyAdvocate - Quick Setup Guide

## Step 1: Database Setup

### Option A: Using MySQL Command Line
```bash
mysql -u root -p < database/setup.sql
```

### Option B: Using phpMyAdmin (XAMPP)
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Click "Import" tab
3. Choose file: `database/setup.sql`
4. Click "Go"

### Option C: Using MySQL Workbench
1. Open MySQL Workbench
2. File → Run SQL Script
3. Select `database/setup.sql`
4. Execute

## Step 2: Backend Setup

```bash
cd server
npm install
npm start
```

Server will run on: http://localhost:5000

## Step 3: Frontend Setup

```bash
cd client
npm install
npm start
```

Application will run on: http://localhost:3000

## Default Credentials

### Admin
- Email: admin@bookmyadvocate.com
- Password: admin123

### Test User
- Email: john@example.com
- Password: password123

### Test Advocate
- Email: rajesh@example.com
- Password: password123

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in `server/.env`
- Ensure database `bookmyadvocate` exists

### Port Already in Use
- Backend: Change PORT in `server/.env`
- Frontend: Change port when prompted or set in `client/package.json`

### Node Modules Error
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```
