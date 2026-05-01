"""
Flask Backend — Movie Favorites App
Uses PostgreSQL instead of MySQL.
"""

import os
import sqlite3
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response

@app.route("/submit", methods=["OPTIONS"])
def submit_options():
    return jsonify({}), 200

@app.route("/recent", methods=["OPTIONS"])
def recent_options():
    return jsonify({}), 200


USE_POSTGRES = bool(os.getenv("DATABASE_URL"))

def get_sqlite_conn():
    conn = sqlite3.connect("local_dev.db")
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users "
        "(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, movie TEXT)"
    )
    conn.commit()
    return conn

def get_postgres_conn():
    import psycopg2
    return psycopg2.connect(os.getenv("DATABASE_URL"))

def insert_user(username: str, movie: str):
    if USE_POSTGRES:
        conn = get_postgres_conn()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (username, movie) VALUES (%s, %s)", (username, movie)
        )
    else:
        conn = get_sqlite_conn()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (username, movie) VALUES (?, ?)", (username, movie)
        )
    conn.commit()
    cursor.close()
    conn.close()

def get_recent(limit: int = 5):
    """Fetch the most recently added entries."""
    if USE_POSTGRES:
        conn = get_postgres_conn()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT username, movie FROM users ORDER BY id DESC LIMIT %s", (limit,)
        )
    else:
        conn = get_sqlite_conn()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT username, movie FROM users ORDER BY id DESC LIMIT ?", (limit,)
        )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return [{"username": r[0], "movie": r[1]} for r in rows]


@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()

    if not data or not data.get("username") or not data.get("movie"):
        return jsonify({"success": False, "error": "username and movie are required"}), 400

    try:
        insert_user(data["username"], data["movie"])
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/recent", methods=["GET"])
def recent():
    """Return the 5 most recently submitted entries."""
    try:
        entries = get_recent(5)
        return jsonify({"success": True, "entries": entries}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    db_mode = "postgresql" if USE_POSTGRES else "sqlite (local dev)"
    return jsonify({"status": "ok", "db": db_mode}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
