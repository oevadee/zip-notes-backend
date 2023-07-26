export type NoteId = string;

export type Note = {
  title: string;
  description: string;
  id: NoteId;
  createdAt: Date;
  updatedAt: Date;
};

export type NoteRepository = {
  findMany(): Promise<Record<NoteId, Note>>;
  findById(noteId: NoteId): Promise<Note | null>;
  create(note: Note): Promise<void>;
  deleteById(noteId: NoteId): Promise<Note | undefined>;
};
