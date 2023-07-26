import { Note, NoteId, NoteRepository } from "./model";

export const inMemoryNoteRepository =
  (): NoteRepository => {
    const notes: Record<NoteId, Note> = {};

    return {
      async findMany() {
        return notes;
      },
      async findById(id) {
        const note = Object.values(notes).find(
          (note) => note.id === id,
        );

        return note ?? null;
      },
      async create(note) {
        notes[note.id] = note;
      },
      async deleteById(id) {
        const note = Object.values(notes).find(
          (note) => note.id === id,
        );

        if (note) {
          delete notes[note.id];
        }

        return note;
      },
    };
  };
