const express = require("express");
const noteModel = require("./model/note.model");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/notes", async (req, res) => {
  try {
    const { title, description } = req.body;

    const note = await noteModel.create({
      title,
      description,
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/api/notes", async (req, res) => {
  const notes = await noteModel.find();
  res.status(200).json({
    message: "note fetch succesfully",
    notes,
  });
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedNote = await noteModel.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    res.status(200).json({
      message: "Note deleted successfully",
      deletedNote,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting note",
      error: error.message,
    });
  }
});

app.patch("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const updatenote = await noteModel.findByIdAndUpdate(
    id,
    { title, description },
    { new: true, runValidators: true },
  );
  res.json({
    message: "note updated successfully",
    updatenote,
  });
});

app.use("*name", (req, res) => {
  console.log("this is wild card");
  res.sendFile(path.join(__dirname, "/public/index.html"));

});


// app.use( "*name" ,(req, res) => {
//   console.log("This is wildcard");

//   res.sendFile(
//     path.join(__dirname, "public", "index.html")
//   );
// });
module.exports = app;
