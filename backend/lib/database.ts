import { BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { and, eq, sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import dotenv from "dotenv";

dotenv.config();

const INITIAL_CANVAS = process.env.INITIAL_CANVAS || null;
const SQL_PATH = process.env.SQL_PATH || "/temp";

const pixels = sqliteTable("pixels", {
  canvas: integer("canvas").primaryKey(),
  x: integer("x").primaryKey(),
  y: integer("y").primaryKey(),
  color: integer("color").notNull(),
});

const canvases = sqliteTable("canvases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export class DatabaseQueries {
  private static db: BunSQLiteDatabase;
  private static activeCanvas: number;
  constructor() {}

  async connect() {
    console.debug("connecting");
    if (!DatabaseQueries.db) {
      const sqlite = new Database(`${SQL_PATH}/sqlite.db`);
      DatabaseQueries.db = drizzle(sqlite);
      await this.setup();
    }
  }

  async getAllPixels() {
    return await DatabaseQueries.db
      .select()
      .from(pixels)
      .where(eq(pixels.canvas, DatabaseQueries.activeCanvas));
  }

  async addPixel(x: number, y: number, color: number) {
    // upsert hehe ://
    try {
      await DatabaseQueries.db.insert(pixels).values({
        canvas: DatabaseQueries.activeCanvas,
        x,
        y,
        color,
      });
    } catch (e) {
      await DatabaseQueries.db
        .update(pixels)
        .set({ color })
        .where(
          and(
            eq(pixels.canvas, DatabaseQueries.activeCanvas),
            eq(pixels.x, x),
            eq(pixels.y, y)
          )
        );
    }
  }

  async setup() {
    const queries = [
      "CREATE TABLE IF NOT EXISTS `pixels` (`canvas` INTEGER, `x` INTEGER, `y` INTEGER, `color` INTEGER, PRIMARY KEY(`canvas`, `x`, `y`))",
      "CREATE TABLE IF NOT EXISTS `canvases` (`id` INTEGER NOT NULL, `name` TEXT, PRIMARY KEY(`id`))",
    ] as any;

    DatabaseQueries.db.run(sql(queries as TemplateStringsArray));

    if (!INITIAL_CANVAS) {
      throw new Error("INITIAL_CANVAS is a required env variable.");
    } else {
      const canvas = await DatabaseQueries.db
        .select()
        .from(canvases)
        .where(eq(canvases.name, INITIAL_CANVAS));

      if (canvas.length < 1) {
        throw new Error("No canvas corresponds to INITIAL_CANVAS.");
      } else {
        DatabaseQueries.activeCanvas = canvas[0].id;
      }
    }
    console.debug("Launching backend db with canvas ", INITIAL_CANVAS);
  }
}
