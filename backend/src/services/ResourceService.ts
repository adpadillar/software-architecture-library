import { Database } from "sqlite";
import { Book, Laptop, Resource } from "../models/Resource";
import { getConnection } from "../config/database";

export class ResourceService {
  private db: Database | null = null;

  private async initDb() {
    if (!this.db) {
      this.db = await getConnection();
      await this.createTables();
    }
  }

  private async createTables() {
    await this.db!.exec(`
      CREATE TABLE IF NOT EXISTS resources (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        state TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        genre TEXT NOT NULL,
        FOREIGN KEY(id) REFERENCES resources(id)
      );

      CREATE TABLE IF NOT EXISTS laptops (
        id TEXT PRIMARY KEY,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        FOREIGN KEY(id) REFERENCES resources(id)
      );
    `);
  }

  // Resource Management
  async findResource(id: string): Promise<Resource | null> {
    await this.initDb();
    const resource = await this.db!.get(
      "SELECT * FROM resources WHERE id = ?",
      [id]
    );
    if (!resource) return null;
    return this.mapToResource(resource);
  }

  async updateResourceState(
    id: string,
    state: "available" | "borrowed"
  ): Promise<void> {
    await this.initDb();
    await this.db!.run("UPDATE resources SET state = ? WHERE id = ?", [
      state,
      id,
    ]);
  }

  async deleteResource(id: string): Promise<void> {
    await this.initDb();
    await this.db!.run("BEGIN TRANSACTION");
    try {
      await this.db!.run("DELETE FROM books WHERE id = ?", [id]);
      await this.db!.run("DELETE FROM laptops WHERE id = ?", [id]);
      await this.db!.run("DELETE FROM resources WHERE id = ?", [id]);
      await this.db!.run("COMMIT");
    } catch (error) {
      await this.db!.run("ROLLBACK");
      throw error;
    }
  }

  async getAllResources(): Promise<(Book | Laptop)[]> {
    await this.initDb();
    const resources = await this.db!.all("SELECT * FROM resources");
    return Promise.all(resources.map((r) => this.mapToResource(r)));
  }

  // Book Management
  async addBook(book: Book): Promise<void> {
    await this.initDb();
    await this.db!.run("BEGIN TRANSACTION");
    try {
      await this.db!.run(
        "INSERT INTO resources (id, type, state) VALUES (?, ?, ?)",
        [book.getId(), "book", "available"]
      );
      await this.db!.run(
        "INSERT INTO books (id, title, author, genre) VALUES (?, ?, ?, ?)",
        [book.getId(), book.getTitle(), book.getAuthor(), book.getGenre()]
      );
      await this.db!.run("COMMIT");
    } catch (error) {
      await this.db!.run("ROLLBACK");
      throw error;
    }
  }

  async findBook(id: string): Promise<Book | null> {
    await this.initDb();
    const book = await this.db!.get(
      `
      SELECT r.*, b.* 
      FROM resources r 
      JOIN books b ON r.id = b.id 
      WHERE r.id = ? AND r.type = 'book'
    `,
      [id]
    );
    return book ? new Book(book.title, book.author, book.genre) : null;
  }

  async getAllBooks(): Promise<Book[]> {
    await this.initDb();
    const books = await this.db!.all(`
      SELECT r.*, b.* 
      FROM resources r 
      JOIN books b ON r.id = b.id 
      WHERE r.type = 'book'
    `);
    return books.map((b) => new Book(b.title, b.author, b.genre));
  }

  async searchBooksByTitle(title: string): Promise<Book[]> {
    await this.initDb();
    const books = await this.db!.all(
      `
      SELECT r.*, b.* 
      FROM resources r 
      JOIN books b ON r.id = b.id 
      WHERE r.type = 'book' AND b.title LIKE ?
    `,
      [`%${title}%`]
    );
    return books.map((b) => new Book(b.title, b.author, b.genre));
  }

  async searchBooksByAuthor(author: string): Promise<Book[]> {
    await this.initDb();
    const books = await this.db!.all(
      `
      SELECT r.*, b.* 
      FROM resources r 
      JOIN books b ON r.id = b.id 
      WHERE r.type = 'book' AND b.author LIKE ?
    `,
      [`%${author}%`]
    );
    return books.map((b) => new Book(b.title, b.author, b.genre));
  }

  async searchBooksByGenre(genre: string): Promise<Book[]> {
    await this.initDb();
    const books = await this.db!.all(
      `
      SELECT r.*, b.* 
      FROM resources r 
      JOIN books b ON r.id = b.id 
      WHERE r.type = 'book' AND b.genre LIKE ?
    `,
      [`%${genre}%`]
    );
    return books.map((b) => new Book(b.title, b.author, b.genre));
  }

  // Laptop Management
  async addLaptop(laptop: Laptop): Promise<void> {
    await this.initDb();
    await this.db!.run("BEGIN TRANSACTION");
    try {
      await this.db!.run(
        "INSERT INTO resources (id, type, state) VALUES (?, ?, ?)",
        [laptop.getId(), "laptop", "available"]
      );
      await this.db!.run(
        "INSERT INTO laptops (id, brand, model) VALUES (?, ?, ?)",
        [laptop.getId(), laptop.getBrand(), laptop.getModel()]
      );
      await this.db!.run("COMMIT");
    } catch (error) {
      await this.db!.run("ROLLBACK");
      throw error;
    }
  }

  async getAllLaptops(): Promise<Laptop[]> {
    await this.initDb();
    const laptops = await this.db!.all(`
      SELECT r.*, l.* 
      FROM resources r 
      JOIN laptops l ON r.id = l.id 
      WHERE r.type = 'laptop'
    `);
    return laptops.map((l) => new Laptop(l.brand, l.model));
  }

  async getAvailableLaptops(): Promise<Laptop[]> {
    await this.initDb();
    const laptops = await this.db!.all(`
      SELECT r.*, l.* 
      FROM resources r 
      JOIN laptops l ON r.id = l.id 
      WHERE r.type = 'laptop' AND r.state = 'available'
    `);
    return laptops.map((l) => new Laptop(l.brand, l.model));
  }

  private async mapToResource(resource: any): Promise<Book | Laptop> {
    if (resource.type === "book") {
      const book = await this.db!.get("SELECT * FROM books WHERE id = ?", [
        resource.id,
      ]);
      return new Book(book.title, book.author, book.genre);
    } else {
      const laptop = await this.db!.get("SELECT * FROM laptops WHERE id = ?", [
        resource.id,
      ]);
      return new Laptop(laptop.brand, laptop.model);
    }
  }
}
