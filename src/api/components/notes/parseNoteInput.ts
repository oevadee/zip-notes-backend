import { z } from "zod";

export const NoteInput = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1),
});
export type NoteInput = z.infer<typeof NoteInput>;
