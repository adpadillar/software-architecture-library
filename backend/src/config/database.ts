import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export async function getConnection(): Promise<Database> {
  return open({
    filename: "./library.db",
    driver: sqlite3.Database,
  });
}
