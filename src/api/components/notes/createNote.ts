import { Clock } from "../../clock";
import { Note, NoteRepository } from "./model";
import { IdGenerator } from "../../incrementIdGenerator";
import { NoteInput } from "./parseNoteInput";

export const createNote =
  (
    noteRepository: NoteRepository,
    noteIdGenerator: IdGenerator,
    clock: Clock,
  ) =>
  async (input: NoteInput) => {
    const now = clock();
    const note: Note = {
      title: input.title,
      description: input.description,
      id: noteIdGenerator(),
      createdAt: now,
      updatedAt: now,
    };

    await noteRepository.create(note);

    return note;
  };
