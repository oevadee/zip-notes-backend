import { Note, NoteId, NoteRepository } from "./model";

export const inMemoryNoteRepository =
  (): NoteRepository => {
    const notes: Record<NoteId, Note> = {};

    return {
      async findMany() {
        return notes;
      },
      async findBySlug(slug) {
        const note = Object.values(notes).find(
          (note) => note.slug === slug,
        );

        return note ?? null;
      },
      async create(note) {
        notes[note.id] = note;
      },
      async deleteBySlug(slug) {
        const note = Object.values(notes).find(
          (note) => note.slug === slug,
        );

        if (note) {
          delete notes[note.id];
        }

        return note;
      },
    };
  };
