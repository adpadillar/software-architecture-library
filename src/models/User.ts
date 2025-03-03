import { Library } from "./Library";
import { Book, Laptop } from "./Resource";

type Role = "student" | "teacher" | "not-set";

export class User {
  private id: string;
  private role: Role;
  private email: string;
  private name: string;
  public library: Library;

  constructor(
    email: string,
    name: string,
    library: Library,
    role: Role = "not-set"
  ) {
    this.id = crypto.randomUUID();
    this.role = role;
    this.email = email;
    this.name = name;
    this.library = library;
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string {
    return this.name;
  }

  public getRole(): Role {
    return this.role;
  }

  public searchBookByTitle(title: string): Book {
    const book = this.library.getBookByTitle(title);

    if (!book) {
      throw new Error(`Book with title ${title} not found`);
    }

    return book;
  }

  public searchBookByAuthor(author: string): Book {
    const book = this.library.getBookByAuthor(author);

    if (!book) {
      throw new Error(`Book with author ${author} not found`);
    }

    return book;
  }

  public searchBookByGenre(category: string): Book {
    const book = this.library.getBookByGenre(category);

    if (!book) {
      throw new Error(`Book with genre ${category} not found`);
    }

    return book;
  }

  public requestLoan(book: Book): void {
    this.library.loanBook(book, this);
  }
}

export class Student extends User {
  constructor(email: string, name: string, library: Library) {
    super(email, name, library, "student");
  }
}

export class Teacher extends User {
  constructor(email: string, name: string, library: Library) {
    super(email, name, library, "teacher");
  }

  public requestLaptopLoan(): Laptop {
    return this.library.loanLaptop(this);
  }
}
