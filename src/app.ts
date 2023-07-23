import express from "express";
import cors from "cors";
import { notesRouter } from "./api/components/notes/router";

export const app = express();
app.use(cors());
app.use(express.json());

app.use(notesRouter);
