import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function App() {
  const [notes, setNotes] = useState([]);
  const [formdata, setFormdata] = useState(null);
  const [editId, setEditId] = useState(null);

  console.log("redering");
  const { register, handleSubmit, reset } = useForm();

  async function getnotes() {
    const Api = "http://localhost:3000/api/notes";
    const notes = await axios.get(Api);
    // console.log(notes.data.notes);
    setNotes(notes.data.notes);
  }

  useEffect(() => {
    getnotes();
  }, []);

  function submithandel(data) {
    // console.log(data);
    setFormdata(data);
    submitnote(data);
  }

  // async function submitnote(data) {
  //   const Api = "http://localhost:3000/api/notes";

  //   const respose = await axios.post(Api, {
  //     title: data.title,
  //     description: data.description,
  //   });

  //   getnotes();
  //   // console.log(respose.data);
  // }

  // const [editId, setEditId] = useState(null);

  async function submitnote(data) {
    const Api = "http://localhost:3000/api/notes";

    if (editId) {
      // Update existing note
      await axios.patch(`${Api}/${editId}`, {
        title: data.title,
        description: data.description,
      });
    } else {
      // Create new note
      await axios.post(Api, {
        title: data.title,
        description: data.description,
      });
    }

    getnotes();

    reset(); // Form clear karo
    setEditId(null); // Edit mode band karo
  }

  async function handleClick(id) {
    try {
      const deletnote = await axios.delete(
        "http://localhost:3000/api/notes/" + id,
      );
      getnotes();
      console.log(deletnote.data);
    } catch (error) {
      console.log(error);
    }
  }

  // Edit button click
  function handleEdit(not) {
    setEditId(not._id);
    console.log(not._id);
    reset({
      title: not.title,
      description: not.description,
    });
  }

  // console.log(editId)

  return (
    <>
      <div>
        <form
          className=" border-2 flex flex-col gap-3 justify-center items-center w-3xl p-5"
          onSubmit={handleSubmit(submithandel)}
        >
          <input
            className="border-2 p-2 w-full"
            type="text"
            placeholder="Enter title"
            {...register("title")}
          />
          <input
            className="border-2 p-2 w-full"
            type="text"
            placeholder="Enter description"
            {...register("description")}
          />
          <button className="bg-blue-500 p-2 text-white px-5 rounded-2xl">
            Create
          </button>
        </form>
        <div className="flex gap-5 bg-amber-100 p-4 w-full">
          {notes.map((not) => {
            return (
              <div className="p-3 border-2 ">
                <h3>{not.title}</h3>
                <p>{not.description}</p>
                <div className="flex gap-2 ">
                  <button
                    onClick={() => handleClick(not._id)}
                    className="border p-2"
                  >
                    delete
                  </button>
                  <button
                    onClick={() => handleEdit(not)}
                    className="border p-2 border-red-300"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
