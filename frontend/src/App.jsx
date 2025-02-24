import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    publication_date: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8200/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let newBook;
      if (editingId) {
        const response = await axios.put(
          `http://localhost:8200/books/${editingId}`,
          formData
        );
        newBook = response.data;
        setBooks((prevBooks) =>
          prevBooks.map((book) => (book.id === editingId ? newBook : book))
        );
      } else {
        const response = await axios.post(
          "http://localhost:8200/books",
          formData
        );
        newBook = response.data;
        setBooks((prevBooks) => [...prevBooks, newBook]);
      }

      setFormData({
        title: "",
        author: "",
        genre: "",
        publication_date: "",
        description: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving book", error);
    }
  };


  const handleEdit = (book) => {
    setFormData(book);
    setEditingId(book.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8200/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Book Catalog
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author"
          required
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Genre"
          required
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="date"
          name="publication_date"
          value={formData.publication_date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-3"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full p-2 border rounded mb-3"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </form>
      <div className="max-w-4xl mx-auto mt-10">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">
                {book.author} - {book.genre}
              </p>
              <p className="text-gray-500 text-sm">
                Published: {book.publication_date}
              </p>
              <p className="text-gray-700 mt-2">{book.description}</p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(book)}
                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(book.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
