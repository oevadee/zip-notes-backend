import httpClient from "supertest";
import assert from "assert";
import { app } from "../app";
import omit from "lodash.omit";
import { Note } from "../api/components/notes/model";

type NoteInput = {
  title: string;
  description: string;
};
type Request = ReturnType<typeof httpClient>;

const findManyNotes = (request: Request) =>
  request.get("/api/notes").expect(200);

const findNoteBySlug = (request: Request, slug: string) =>
  request.get(`/api/notes/${slug}`).expect(200);

const createNote = (
  request: Request,
  note: NoteInput,
  status = 200,
) =>
  request.post("/api/notes").send({ note }).expect(status);

const deleteNoteBySlug = (request: Request, slug: string) =>
  request.delete(`/api/notes/${slug}`).expect(200);

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
        title: "Test title",
        description: "Test description",
        slug: "test-title",
      },
    );

    const allNotes = await findManyNotes(request);

    assert.deepStrictEqual(
      allNotes.body.notes.map((note: Note) =>
        omit(note, "createdAt", "updatedAt"),
      ),
      [
        {
          title: "Test title",
          description: "Test description",
          slug: "test-title",
        },
      ],
    );

    const specificNote = await findNoteBySlug(
      request,
      "test-title",
    );

    assert.deepStrictEqual(
      omit(
        specificNote.body.note,
        "createdAt",
        "updatedAt",
      ),
      {
        title: "Test title",
        description: "Test description",
        slug: "test-title",
      },
    );

    await deleteNoteBySlug(request, "test-title");

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
