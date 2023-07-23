import { Router } from "express";
import { inMemoryNoteRepository } from "./inMemoryRepository";
import { NotFoundError } from "../../NotFoundError";
import omit from "lodash.omit";
import { clock } from "../../clock";
import { incrementIdGenerator } from "../../incrementIdGenerator";
import { createNote } from "./createNote";

export const notesRouter = Router();

const noteRepository = inMemoryNoteRepository();
const noteIdGenerator = incrementIdGenerator(String);

notesRouter.get("/api/notes", async (req, res, next) => {
  const notes = await noteRepository.findMany();

  res.send({ notes: Object.values(notes).map((note) => omit(note, "id")) });
});

notesRouter.get("/api/notes/:slug", async (req, res, next) => {
  const slug = req.params.slug;

  const existingNote = await noteRepository.findBySlug(slug);

  if (!existingNote) {
    throw new NotFoundError(`Note with slug: ${slug} does not exist`);
  }

  res.json({ note: omit(existingNote, "id") });
});

notesRouter.post("/api/notes", async (req, res, next) => {
  const input = req.body.note;

  const note = await createNote(noteRepository, noteIdGenerator, clock)(input);
  res.json({ note: omit(note, "id") });
});

notesRouter.delete("/api/notes/:slug", async (req, res, next) => {
  const slug = req.params.slug;

  const existingNote = await noteRepository.deleteBySlug(slug);

  if (!existingNote) {
    throw new NotFoundError(`Note with slug: ${slug} does not exist`);
  }

  res.json({ note: omit(existingNote, "id") });
});
