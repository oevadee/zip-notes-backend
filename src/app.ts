import express from "express";
import cors from "cors";
import { notesRouter } from "./api/components/notes/router";
import { errorHandler, notFoundHandler } from "./errorHandler";

export const app = express();
app.use(cors());
app.use(express.json());

app.use(notesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
