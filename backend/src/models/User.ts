import { Library } from "./Library";
import { Book, Laptop } from "./Resource";

type Role = "student" | "teacher" | "not-set";

export class User {
  private id: string;
  private role: Role;
  private email: string;
  private name: string;

  constructor(email: string, name: string, role: Role = "not-set") {
    this.id = crypto.randomUUID();
    this.role = role;
    this.email = email;
    this.name = name;
  }

  // Only getters remain
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
}

export class Student extends User {
  constructor(email: string, name: string) {
    super(email, name, "student");
  }
}

export class Teacher extends User {
  constructor(email: string, name: string) {
    super(email, name, "teacher");
  }
}
