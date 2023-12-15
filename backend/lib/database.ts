import { BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { eq, sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_NAME = process.env.DATABASE_NAME || "pixel2022";
const SQL_PATH = process.env.SQL_PATH || "/temp";

console.log(DATABASE_NAME, SQL_PATH);

const pixels = sqliteTable(DATABASE_NAME, {
  id: text("id").unique(),
  x: integer("x"),
  y: integer("y"),
  color: text("color"),
});

export class DatabaseQueries {
  private static db: BunSQLiteDatabase;
  constructor() {}

  async connect() {
    if (!DatabaseQueries.db) {
      const sqlite = new Database(`${SQL_PATH}/sqlite.db`);
      DatabaseQueries.db = drizzle(sqlite);
      await this.setup();
    }
  }

  async getAllPixels() {
    return await DatabaseQueries.db.select().from(pixels).all();
  }
  async addPixel(x: number, y: number, color: string) {
    // upsert hehe ://
    try {
      await DatabaseQueries.db.insert(pixels).values({
        id: `${x},${y}`,
        x,
        y,
        color,
      });
    } catch (e) {
      await DatabaseQueries.db
        .update(pixels)
        .set({ color })
        .where(eq(pixels.id, `${x},${y}`));
    }
  }
  async setup() {
    const queries = [
      `CREATE TABLE IF NOT EXISTS ${DATABASE_NAME} (id TEXT PRIMARY KEY, x INTEGER, y INTEGER, color TEXT)`,
    ] as any;

    await DatabaseQueries.db.run(sql(queries as TemplateStringsArray));
  }
}
