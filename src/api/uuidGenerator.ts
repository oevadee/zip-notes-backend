import { v4 as uuidv4 } from "uuid";
import { IdGenerator } from "./incrementIdGenerator";

export const uuidGenerator: IdGenerator = uuidv4;
