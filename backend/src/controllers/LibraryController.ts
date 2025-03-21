import { Book, Laptop } from "../models/Resource";
import { User } from "../models/User";
import { ResourceService } from "../services/ResourceService";
import { LoanService } from "../services/LoanService";
import { Student, Teacher } from "../models/User";

export class LibraryController {
  private resourceService: ResourceService;
  private loanService: LoanService;

  constructor() {
    this.resourceService = new ResourceService();
    this.loanService = new LoanService();
  }

  // Método nuevo y único necesario------------------------------------------------
  async updateBookState(bookId: string, state: "available" | "borrowed") {
    await this.resourceService.updateResourceState(bookId, state);
  }

  async updateResourceState(
    resourceId: string,
    state: "available" | "borrowed"
  ) {
    await this.resourceService.updateResourceState(resourceId, state);
  }

  async loanBook(bookId: string, user: Student | Teacher) {
    const book = await this.resourceService.findBook(bookId);

    if (!book || book.getState() !== "available") {
      throw new Error("El libro no está disponible");
    }

    // Calcular fechas de préstamo
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7); // Préstamo por 7 días

    await this.resourceService.updateResourceState(bookId, "borrowed");

    // Usar createLoan con las fechas calculadas
    await this.loanService.createLoan(book, user, startDate, endDate);
  }

  // Book Management
  async addBook(title: string, author: string, genre: string): Promise<Book> {
    const book = new Book(
      title,
      author,
      genre,
      "available",
      crypto.randomUUID()
    );
    await this.resourceService.addBook(book);
    return book;
  }

  async deleteBook(bookId: string): Promise<void> {
    await this.resourceService.deleteResource(bookId);
  }

  async getAllBooks(): Promise<Book[]> {
    return await this.resourceService.getAllBooks();
  }

  async searchBookByTitle(title: string): Promise<Book[]> {
    return await this.resourceService.searchBooksByTitle(title);
  }

  async searchBookByAuthor(author: string): Promise<Book[]> {
    return await this.resourceService.searchBooksByAuthor(author);
  }

  async searchBookByGenre(genre: string): Promise<Book[]> {
    return await this.resourceService.searchBooksByGenre(genre);
  }

  // Laptop Management
  async addLaptop(brand: string, model: string): Promise<Laptop> {
    const laptop = new Laptop(brand, model, "available", crypto.randomUUID());
    await this.resourceService.addLaptop(laptop);
    return laptop;
  }

  async getAllLaptops(): Promise<Laptop[]> {
    return await this.resourceService.getAllLaptops();
  }

  async getAvailableLaptops(): Promise<Laptop[]> {
    return await this.resourceService.getAvailableLaptops();
  }

  async loanLaptop(user: User): Promise<void> {
    if (user.getRole() !== "teacher") {
      throw new Error("Only teachers can loan laptops");
    }

    const availableLaptops = await this.getAvailableLaptops();
    if (availableLaptops.length === 0) {
      throw new Error("No laptops available");
    }

    const laptop = availableLaptops[0];
    await this.resourceService.updateResourceState(laptop.getId(), "borrowed");
    await this.loanService.createLoan(
      laptop,
      user,
      new Date(),
      new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day loan
    );
  }

  // Loan Management
  async getActiveLoans(): Promise<any[]> {
    return await this.loanService.getActiveLoans();
  }

  async getExpiredLoans(): Promise<any[]> {
    return await this.loanService.getExpiredLoans();
  }

  async getLoansByUser(userId: string): Promise<any[]> {
    return await this.loanService.getLoansByUser(userId);
  }

  async returnResource(resourceId: string): Promise<void> {
    const activeLoan = await this.loanService.getActiveLoanByResource(
      resourceId
    );
    if (!activeLoan) {
      throw new Error("No active loan found for this resource");
    }

    await this.resourceService.updateResourceState(resourceId, "available");
    await this.loanService.closeLoan(activeLoan.getId());
  }

  // Resource Management
  async getResourceAvailability(resourceId: string): Promise<boolean> {
    const resource = await this.resourceService.findResource(resourceId);
    return resource?.isAvailable() ?? false;
  }

  async getAllResources(): Promise<(Book | Laptop)[]> {
    return await this.resourceService.getAllResources();
  }
}
