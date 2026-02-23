import sqlite3
from flask import Flask, redirect, render_template, request,send_from_directory
app = Flask(__name__)
@app.route("/")
def home():
    return render_template('design.html')
@app.route("/about")
def info():
    return render_template('about.html')
def init_db():
    conn = sqlite3.connect("reviews.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            review TEXT NOT NULL,
            rating INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()
init_db()
@app.route("/reviews", methods=["GET", "POST"])
def reviews():
    conn = sqlite3.connect("reviews.db")
    c = conn.cursor()

    if request.method == "POST":
        name = request.form["name"]
        review = request.form["review"]
        rating = int(request.form["rating"])

        c.execute(
            "INSERT INTO reviews (name, review, rating) VALUES (?, ?, ?)",
            (name, review, rating)
        )
        conn.commit()
        conn.close()
        return redirect("/reviews")

    c.execute("SELECT name, review, rating, created_at FROM reviews ORDER BY id DESC")
    all_reviews = c.fetchall()

    c.execute("SELECT AVG(rating) FROM reviews")
    avg_rating = c.fetchone()[0]

    conn.close()

    reviews_list = [
        {"name": r[0], "text": r[1], "rating": r[2], "time": r[3]}
        for r in all_reviews
    ]

    return render_template(
        "reviews.html",
        reviews=reviews_list,
        average=round(avg_rating, 1) if avg_rating else 0
    )
if __name__ == "__main__":
    app.run(debug=True)