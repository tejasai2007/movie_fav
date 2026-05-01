# 🎬 Movie Favorites — Full Stack App

A beginner-friendly full-stack web application built with:

- **Frontend**: Next.js 14 + TypeScript
- **Backend**: Python Flask
- **Database**: MySQL

---

## 📁 Folder Structure

```
project/
├── frontend/               ← Next.js app (deploy to Vercel)
│   ├── src/app/
│   │   ├── page.tsx        ← Main page with the form
│   │   ├── page.module.css ← Styles for the page
│   │   ├── layout.tsx      ← Root layout
│   │   └── globals.css     ← Global reset styles
│   ├── .env.local.example  ← Copy to .env.local and fill in values
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                ← Flask API (deploy to Render/Railway/etc.)
│   ├── app.py              ← Main Flask application
│   ├── schema.sql          ← MySQL table definition
│   ├── requirements.txt    ← Python dependencies
│   └── .env.example        ← Copy to .env and fill in values
│
└── README.md               ← This file
```

---

## ⚙️ Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) v18+ (for the frontend)
- [Python](https://python.org/) 3.10+ (for the backend)
- [MySQL](https://dev.mysql.com/downloads/) (local database)

---

## 🗄️ Step 1 — Set Up the Database

1. Open your MySQL client (terminal or MySQL Workbench).
2. Run the schema file to create the database and table:

```bash
mysql -u root -p < backend/schema.sql
```

This creates a database called `moviesdb` with a `users` table.

---

## 🐍 Step 2 — Run the Backend (Flask)

```bash
# Navigate to the backend folder
cd backend

# Create a Python virtual environment (keeps dependencies isolated)
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy the example env file and fill in your MySQL credentials
cp .env.example .env
```

Edit `.env` with your actual database details:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=moviesdb
```

Start the Flask development server:

```bash
python app.py
```

The backend will be running at: **http://localhost:5000**

Test it with:
```bash
curl http://localhost:5000/health
# → {"status": "ok"}
```

---

## ⚛️ Step 3 — Run the Frontend (Next.js)

```bash
# In a new terminal, navigate to the frontend folder
cd frontend

# Install Node dependencies
npm install

# Copy the example env file
cp .env.local.example .env.local
```

The default `.env.local` already points to `http://localhost:5000`, so no changes needed for local development.

Start the Next.js dev server:

```bash
npm run dev
```

Open your browser at: **http://localhost:3000**

---

## ✅ How It Works

1. User fills in their name and favorite movie, then clicks **Submit**.
2. The frontend sends a `POST` request to `http://localhost:5000/submit` with JSON: `{ "username": "Alex", "movie": "Inception" }`.
3. Flask receives the data, inserts it into the `users` MySQL table, and returns `{ "success": true }`.
4. The frontend shows a success message.

---

## 🚀 Deployment

### Deploy the Backend

You can deploy the Flask app to **Render**, **Railway**, or **Fly.io**.

All these platforms support running a `gunicorn` command:

```bash
gunicorn app:app
```

Set the environment variables (`DB_HOST`, `DB_USER`, etc.) in your platform's dashboard.

### Deploy the Frontend to Vercel

1. Push your `frontend/` folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and import the repo.
3. In Vercel's project settings → **Environment Variables**, add:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url.onrender.com
   ```
4. Deploy!

---

## 🔌 API Reference

### `POST /submit`

**Request body (JSON):**
```json
{ "username": "Alex", "movie": "Inception" }
```

**Success response:**
```json
{ "success": true }
```

**Error response:**
```json
{ "success": false, "error": "username and movie are required" }
```

### `GET /health`

Returns `{ "status": "ok" }` — useful to verify the server is up.

---

## 🛠️ Common Issues

| Problem | Fix |
|---|---|
| `Could not reach the server` | Make sure Flask is running on port 5000 |
| MySQL connection error | Check your `.env` credentials and that MySQL is running |
| CORS error in browser | Flask-CORS is enabled — make sure `pip install -r requirements.txt` ran successfully |
| `npm run dev` fails | Run `npm install` first |
