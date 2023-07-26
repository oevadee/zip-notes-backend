import { Router } from "express";

import { inMemoryNoteRepository } from "./inMemoryRepository";
import { NotFoundError } from "../../NotFoundError";
import { clock } from "../../clock";
import { incrementIdGenerator } from "../../incrementIdGenerator";
import { createNote } from "./createNote";
import { NoteInput } from "./parseNoteInput";

export const notesRouter = Router();

const noteRepository = inMemoryNoteRepository();
const noteIdGenerator = incrementIdGenerator(String);

notesRouter.get("/api/notes", async (req, res, next) => {
  const notes = await noteRepository.findMany();

  res.send({ notes: Object.values(notes) });
});

notesRouter.get(
  "/api/notes/:id",
  async (req, res, next) => {
    const id = req.params.id;

    try {
      const existingNote = await noteRepository.findById(
        id,
      );

      if (!existingNote) {
        throw new NotFoundError(
          `Note with id: ${id} does not exist`,
        );
      }

      res.json({ note: existingNote });
    } catch (err) {
      next(err);
    }
  },
);

notesRouter.post("/api/notes", async (req, res, next) => {
  try {
    const input = NoteInput.parse(req.body.note);

    const note = await createNote(
      noteRepository,
      noteIdGenerator,
      clock,
    )(input);

    res.json({ note });
  } catch (err) {
    next(err);
  }
});

notesRouter.delete(
  "/api/notes/:id",
  async (req, res, next) => {
    const id = req.params.id;

    try {
      const existingNote = await noteRepository.deleteById(
        id,
      );

      if (!existingNote) {
        throw new NotFoundError(
          `Note with id: ${id} does not exist`,
        );
      }

      res.json({ note: existingNote });
    } catch (err) {
      next(err);
    }
  },
);
