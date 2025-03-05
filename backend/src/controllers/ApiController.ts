import express, { Request, Response } from "express";
import { LibraryController } from "./LibraryController";
import { Student, Teacher } from "../models/User";
import { DocsService } from "../services/DocsService";

export const apiRouter = express.Router();
const libraryController = new LibraryController();

// Documentation endpoint
apiRouter.get("/docs", async (_req: Request, res: Response) => {
  try {
    const htmlDocs = await DocsService.generateHtmlDocs();
    res.header("Content-Type", "text/html");
    res.send(htmlDocs);
  } catch (error) {
    res.status(500).json({ error: "Failed to load API documentation" });
  }
});

// Book endpoints
apiRouter.get("/books", async (req: Request, res: Response) => {
  try {
    const books = await libraryController.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

apiRouter.get("/books/search", async (req: Request, res: Response) => {
  try {
    const { title, author, genre } = req.query;
    let books;

    if (title) {
      books = await libraryController.searchBookByTitle(title as string);
    } else if (author) {
      books = await libraryController.searchBookByAuthor(author as string);
    } else if (genre) {
      books = await libraryController.searchBookByGenre(genre as string);
    } else {
      throw new Error("Search parameter required: title, author, or genre");
    }

    res.json(books);
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
});

apiRouter.post("/books", async (req: Request, res: Response) => {
  try {
    const { title, author, genre } = req.body;
    const book = await libraryController.addBook(title, author, genre);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
});

apiRouter.delete("/books/:id", async (req: Request, res: Response) => {
  try {
    await libraryController.deleteBook(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
});

// Laptop endpoints
apiRouter.get("/laptops", async (req: Request, res: Response) => {
  try {
    const laptops = await libraryController.getAllLaptops();
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

apiRouter.get("/laptops/available", async (req: Request, res: Response) => {
  try {
    const laptops = await libraryController.getAvailableLaptops();
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

apiRouter.post("/laptops", async (req: Request, res: Response) => {
  try {
    const { brand, model } = req.body;
    const laptop = await libraryController.addLaptop(brand, model);
    res.status(201).json(laptop);
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
});

// Loan endpoints
apiRouter.post("/loans/books", async (req: Request, res: Response) => {
  try {
    const { bookId, userId, userType } = req.body;
    const user =
      userType === "teacher"
        ? new Teacher(userId, "name@example.com")
        : new Student(userId, "name@example.com");

    await libraryController.loanBook(bookId, user);
    res.status(201).json({ message: "Book loaned successfully" });
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
});

apiRouter.post("/loans/laptops", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const teacher = new Teacher(userId, "name@example.com");
    await libraryController.loanLaptop(teacher);
    res.status(201).json({ message: "Laptop loaned successfully" });
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
});

apiRouter.get("/loans/active", async (req: Request, res: Response) => {
  try {
    const loans = await libraryController.getActiveLoans();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

apiRouter.get("/loans/expired", async (req: Request, res: Response) => {
  try {
    const loans = await libraryController.getExpiredLoans();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

apiRouter.get("/loans/user/:userId", async (req: Request, res: Response) => {
  try {
    const loans = await libraryController.getLoansByUser(req.params.userId);
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Resource endpoints
apiRouter.post("/resources/:id/return", async (req: Request, res: Response) => {
  try {
    await libraryController.returnResource(req.params.id);
    res.json({ message: "Resource returned successfully" });
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
});

apiRouter.get("/resources", async (req: Request, res: Response) => {
  try {
    const resources = await libraryController.getAllResources();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

apiRouter.get(
  "/resources/:id/availability",
  async (req: Request, res: Response) => {
    try {
      const available = await libraryController.getResourceAvailability(
        req.params.id
      );
      res.json({ available });
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  }
);
