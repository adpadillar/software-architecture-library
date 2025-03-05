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
    `);
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
