import makeSlug from "slug";
import { Clock } from "../../clock";
import { Note, NoteRepository } from "./model";
import { IdGenerator } from "../../incrementIdGenerator";

type NoteInput = {
  title: string;
  description: string;
};

export const createNote =
  (
    noteRepository: NoteRepository,
    noteIdGenerator: IdGenerator,
    clock: Clock
  ) =>
  async (input: NoteInput) => {
    const now = clock();
    const note: Note = {
      title: input.title,
      description: input.description,
      slug: makeSlug(input.title),
      id: noteIdGenerator(),
      createdAt: now,
      updatedAt: now,
    };

    await noteRepository.create(note);

    return note;
  };
