import httpClient from "supertest";
import assert from "assert";
import omit from "lodash.omit";

import { app } from "../app";
import { Note } from "../api/components/notes/model";

type NoteInput = {
  title: string;
  description: string;
};
type Request = ReturnType<typeof httpClient>;

const findManyNotes = (request: Request) =>
  request.get("/api/notes").expect(200);

const findNoteById = (request: Request, id: string) =>
  request.get(`/api/notes/${id}`).expect(200);

const createNote = (
  request: Request,
  note: NoteInput,
  status = 200,
) =>
  request.post("/api/notes").send({ note }).expect(status);

const deleteNoteById = (request: Request, id: string) =>
  request.delete(`/api/notes/${id}`).expect(200);

describe("App", () => {
  it("Note api journey", async () => {
    const request = httpClient(app);

    const createdNote = await createNote(request, {
      title: "Test title",
      description: "Test description",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      invalidField: "ignore me",
    });

    assert.deepStrictEqual(
      omit(createdNote.body.note, "createdAt", "updatedAt"),
      {
        id: "0",
        title: "Test title",
        description: "Test description",
      },
    );

    const allNotes = await findManyNotes(request);

    assert.deepStrictEqual(
      allNotes.body.notes.map((note: Note) =>
        omit(note, "createdAt", "updatedAt"),
      ),
      [
        {
          id: "0",
          title: "Test title",
          description: "Test description",
        },
      ],
    );

    const specificNote = await findNoteById(request, "0");

    assert.deepStrictEqual(
      omit(
        specificNote.body.note,
        "createdAt",
        "updatedAt",
      ),
      {
        id: "0",
        title: "Test title",
        description: "Test description",
      },
    );

    await deleteNoteById(request, "0");

    const allNotesAfterDelete = await findManyNotes(
      request,
    );

    assert.deepStrictEqual(
      allNotesAfterDelete.body.notes.map((note: Note) =>
        omit(note, "createdAt", "updatedAt"),
      ),
      [],
    );
  });
});
