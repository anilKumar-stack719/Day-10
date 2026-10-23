
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const API = "http://localhost:3000/api/notes";

  const [notes, setNotes] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

  // 1. Backend se notes fetch karo
  async function getnotes() {
    try {
      const res = await axios.get(API);
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getnotes();
  }, []);

  // 2. Input change handle karo
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // 3. Edit button click hone par
  function handleEdit(note) {
    setEditId(note._id);

    setFormData({
      title: note.title,
      description: note.description,
    });
  }

  // 4. Create aur Update dono ka submit handler
  async function submitnote(e) {
    e.preventDefault();

    try {
      if (editId !== null) {
        // UPDATE existing note
        await axios.put(`${API}/${editId}`, {
          title: formData.title,
          description: formData.description,
        });
      } else {
        // CREATE new note
        await axios.post(API, {
          title: formData.title,
          description: formData.description,
        });
      }

      // Latest notes fetch karo
      await getnotes();

      // Form clear karo
      setFormData({
        title: "",
        description: "",
      });

      // Edit mode band karo
      setEditId(null);
    } catch (error) {
      console.log("Submit error:", error);
    }
  }

  // 5. UI
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Notes App
      </h1>

      <form onSubmit={submitnote} className="space-y-3">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter title"
          className="border p-2 w-full"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          className="border p-2 w-full"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId !== null ? "Update Note" : "Add Note"}
        </button>

        {editId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({
                title: "",
                description: "",
              });
            }}
            className="border px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="mt-6 space-y-3">
        {notes.map((note) => (
          <div key={note._id} className="border p-4 rounded">
            <h2 className="font-bold">{note.title}</h2>
            <p>{note.description}</p>

            <button
              type="button"
              onClick={() => handleEdit(note)}
              className="bg-yellow-400 px-3 py-1 rounded mt-2"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
