import { Loan } from "./Loan";
import { Book, Laptop, Resource } from "./Resource";
import { User } from "./User";

export class Library {
  private resources: Resource[];
  private loans: Loan[];

  constructor() {
    this.resources = [];
    this.loans = [];
  }

  public addBook(book: Book): void {
    this.resources.push(book);
  }

  public deleteBook(book: Book): void {
    this.resources = this.resources.filter((resource) => resource !== book);
  }

  public addLaptop(laptop: Laptop): void {
    this.resources.push(laptop);
  }

  public print() {
    const tableData = this.resources.map((resource) => {
      if (resource instanceof Book) {
        return {
          type: "Book",
          details: resource.getTitle(),
          available: resource.isAvailable(),
        };
      } else if (resource instanceof Laptop) {
        return {
          type: "Laptop",
          details: `${resource.getBrand()} ${resource.getModel()}`,
          available: resource.isAvailable(),
        };
      }
      return {
        type: "Resource",
        details: resource.toString(),
        available: resource.isAvailable(),
      };
    });

    console.table(tableData);
  }

  public getBookByTitle(title: string): Book | null {
    const book = this.resources.find(
      (resource) => resource instanceof Book && resource.getTitle() === title
    );

    if (!book) {
      return null;
    }

    return book as Book;
  }

  public getBookByAuthor(author: string): Book | null {
    const book = this.resources.find(
      (resource) => resource instanceof Book && resource.getAuthor() === author
    );

    if (!book) {
      return null;
    }

    return book as Book;
  }

  public getBookByGenre(genre: string): Book | null {
    const book = this.resources.find(
      (resource) => resource instanceof Book && resource.getGenre() === genre
    );

    if (!book) {
      return null;
    }

    return book as Book;
  }

  public loanBook(book: Book, user: User): void {
    const askedBook = this.resources.find((resource) => resource === book);

    if (!askedBook) {
      throw new Error("Book not found in the library");
    }

    if (!askedBook.isAvailable()) {
      throw new Error("Book is not available");
    }

    askedBook.borrow();
    const loan = new Loan(
      askedBook,
      user,
      new Date(),
      // loan for 14 days
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
    );

    this.loans.push(loan);

    console.log(`Book ${book.getTitle()} loaned to ${user.getName()}`);
  }

  public loanLaptop(user: User): Laptop {
    const availableLaptops = this.resources.filter(
      (resource) => resource instanceof Laptop && resource.isAvailable()
    );

    const askedLaptop = availableLaptops[0] as Laptop | undefined;

    if (!askedLaptop) {
      throw new Error("Laptop not found in the library");
    }

    if (!askedLaptop.isAvailable()) {
      throw new Error("Laptop is not available");
    }

    askedLaptop.borrow();
    const loan = new Loan(
      askedLaptop,
      user,
      new Date(),
      // loan for 1 day
      new Date(Date.now() + 1000 * 60 * 60 * 24)
    );

    this.loans.push(loan);

    console.log(
      `Laptop ${askedLaptop.getBrand()} ${askedLaptop.getModel()} loaned to ${user.getName()}`
    );

    return askedLaptop;
  }
}
