import express from "express";
import { body, validationResult } from "express-validator";
import Note from "../models/Note.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// CREATE Note
router.post(
  "/add",
  auth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("body").notEmpty().withMessage("Body is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, body: content } = req.body;
      const note = await Note.create({
        title,
        body: content,
        completed: false,
        userId: req.user.id,
      });
      res.status(201).json({ message: "Note added", list: note });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// READ Notes
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.findAll({ where: { userId: req.user.id } });
    res.json({ list: notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE Note
router.put(
  "/:id",
  auth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("body").notEmpty().withMessage("Body is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const note = await Note.findOne({
        where: { id: req.params.id, userId: req.user.id },
      });

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      note.title = req.body.title;
      note.body = req.body.body;
      if (req.body.completed !== undefined) {
        note.completed = req.body.completed;
      }

      await note.save();

      res.json({ message: "Note updated", task: note });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// DELETE Note
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await note.destroy();
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
