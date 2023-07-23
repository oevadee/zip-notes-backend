export type NoteId = string;
export type Slug = string;

export type Note = {
  title: string;
  description: string;
  slug: Slug;
  id: NoteId;
  createdAt: Date;
  updatedAt: Date;
};

export type NoteRepository = {
  findMany(): Promise<Record<NoteId, Note>>;
  findBySlug(slug: Slug): Promise<Note | null>;
  create(note: Note): Promise<void>;
  deleteBySlug(slug: Slug): Promise<Note | undefined>;
};
