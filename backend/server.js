const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8200;

/******************************************************************************************* */
pool
  .connect()
  .then(() => console.log("📡 Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Connection error", err));

/********************************************************************************************* */
app.get("/", (req, res) => {
  res.send("📚 Welcome to Book Catalog API!");
});
/********************************************************************************************* */
app.get("/books", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/********************************************************************************************* */
app.post("/books", async (req, res) => {
  try {
    const { title, author, genre, publication_date, description } = req.body;
    const result = await pool.query(
      "INSERT INTO books (title, author, genre, publication_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, author, genre, publication_date, description]
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/********************************************************************************************* */
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, publication_date, description } = req.body;
    const result = await pool.query(
      "UPDATE books SET title = $1, author = $2, genre = $3, publication_date = $4, description = $5 WHERE id = $6 RETURNING *",
      [title, author, genre, publication_date, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
/********************************************************************************************* */
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }

    res.send("Book deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
/********************************************************************************************* */

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
