import { Database } from "sqlite";
import { Loan } from "../models/Loan";
import { Resource } from "../models/Resource";
import { User } from "../models/User";
import { getConnection } from "../config/database";

export class LoanService {
  private db: Database | null = null;

  private async initDb() {
    if (!this.db) {
      this.db = await getConnection();
      await this.createTables();
    }
  }

  private async createTables() {
    await this.db!.exec(`
      CREATE TABLE IF NOT EXISTS loans (
        id TEXT PRIMARY KEY,
        resource_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        FOREIGN KEY(resource_id) REFERENCES resources(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        type TEXT NOT NULL
      );
    `);

    // Add seed data if tables are empty
    const userCount = await this.db!.get("SELECT COUNT(*) as count FROM users");
    if (userCount.count === 0) {
      // Seed users
      await this.db!.exec(`
        INSERT INTO users (id, name, email, type) VALUES 
          ('user-001', 'John Smith', 'john@example.com', 'teacher'),
          ('user-002', 'Jane Doe', 'jane@example.com', 'student'),
          ('user-003', 'Bob Johnson', 'bob@example.com', 'student');
      `);

      console.log("User seed data added successfully");
    }

    const loanCount = await this.db!.get("SELECT COUNT(*) as count FROM loans");
    if (loanCount.count === 0) {
      // Get current date for calculations
      const now = new Date();

      // Past loan (ended yesterday)
      const pastLoanEnd = new Date(now);
      pastLoanEnd.setDate(pastLoanEnd.getDate() - 1);
      const pastLoanStart = new Date(pastLoanEnd);
      pastLoanStart.setDate(pastLoanStart.getDate() - 7);

      // Current loan (ends in 6 days)
      const currentLoanStart = new Date(now);
      currentLoanStart.setDate(currentLoanStart.getDate() - 1);
      const currentLoanEnd = new Date(now);
      currentLoanEnd.setDate(currentLoanEnd.getDate() + 6);

      // Overdue loan (should have ended 3 days ago)
      const overdueLoanStart = new Date(now);
      overdueLoanStart.setDate(overdueLoanStart.getDate() - 10);
      const overdueLoanEnd = new Date(now);
      overdueLoanEnd.setDate(overdueLoanEnd.getDate() - 3);

      // Seed loans
      await this.db!.exec(`
        INSERT INTO loans (id, resource_id, user_id, start_date, end_date) VALUES 
          ('loan-001', 'book-001', 'user-001', '${pastLoanStart.toISOString()}', '${pastLoanEnd.toISOString()}'),
          ('loan-002', 'book-003', 'user-002', '${currentLoanStart.toISOString()}', '${currentLoanEnd.toISOString()}'),
          ('loan-003', 'laptop-002', 'user-001', '${overdueLoanStart.toISOString()}', '${overdueLoanEnd.toISOString()}');
      `);

      console.log("Loan seed data added successfully");
    }
  }

  async createLoan(
    resource: Resource,
    user: User,
    startDate: Date,
    endDate: Date
  ): Promise<Loan> {
    await this.initDb();
    const loan = new Loan(resource, user, startDate, endDate);
    await this.db!.run(
      "INSERT INTO loans (id, resource_id, user_id, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
      [
        loan.getId(),
        resource.getId(),
        user.getId(),
        startDate.toISOString(),
        endDate.toISOString(),
      ]
    );
    return loan;
  }

  async getActiveLoans(): Promise<Loan[]> {
    await this.initDb();
    const loans = await this.db!.all(`
      SELECT * FROM loans 
      WHERE end_date > datetime('now')
    `);
    return this.mapLoansToObjects(loans);
  }

  async getExpiredLoans(): Promise<Loan[]> {
    await this.initDb();
    const loans = await this.db!.all(`
      SELECT * FROM loans 
      WHERE end_date < datetime('now')
    `);
    return this.mapLoansToObjects(loans);
  }

  async getLoansByUser(userId: string): Promise<Loan[]> {
    await this.initDb();
    const loans = await this.db!.all(`SELECT * FROM loans WHERE user_id = ?`, [
      userId,
    ]);
    return this.mapLoansToObjects(loans);
  }

  async getActiveLoanByResource(resourceId: string): Promise<Loan | null> {
    await this.initDb();
    const loan = await this.db!.get(
      `
      SELECT * FROM loans 
      WHERE resource_id = ? 
      AND end_date > datetime('now')
      ORDER BY end_date DESC 
      LIMIT 1
    `,
      [resourceId]
    );

    if (!loan) return null;
    return (await this.mapLoansToObjects([loan]))[0];
  }

  async closeLoan(loanId: string): Promise<void> {
    await this.initDb();
    await this.db!.run(
      "UPDATE loans SET end_date = datetime('now') WHERE id = ?",
      [loanId]
    );
  }

  async getLoanHistory(resourceId: string): Promise<Loan[]> {
    await this.initDb();
    const loans = await this.db!.all(
      `SELECT * FROM loans WHERE resource_id = ? ORDER BY start_date DESC`,
      [resourceId]
    );
    return this.mapLoansToObjects(loans);
  }

  async getOverdueLoans(): Promise<Loan[]> {
    await this.initDb();
    const loans = await this.db!.all(`
      SELECT * FROM loans 
      WHERE end_date < datetime('now') 
      AND end_date > start_date
    `);
    return this.mapLoansToObjects(loans);
  }

  private async mapLoansToObjects(loans: any[]): Promise<Loan[]> {
    // This helper method would need ResourceService and UserService to properly
    // reconstruct the Loan objects with their associated Resource and User instances
    return Promise.all(
      loans.map(async (loan) => {
        // Here you would:
        // 1. Get the resource from ResourceService
        // 2. Get the user from UserService
        // 3. Create and return a new Loan instance
        return new Loan(
          {} as Resource, // Replace with actual resource
          {} as User, // Replace with actual user
          new Date(loan.start_date),
          new Date(loan.end_date)
        );
      })
    );
  }
}
