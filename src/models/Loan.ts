import { Resource } from "./Resource";
import { User } from "./User";

export class Loan {
  private id: string;
  private startDate: Date;
  private endDate: Date;
  private resource: Resource;
  private user: User;

  constructor(resource: Resource, user: User, startDate: Date, endDate: Date) {
    this.id = crypto.randomUUID();
    this.resource = resource;
    this.user = user;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public getId(): string {
    return this.id;
  }

  public isExpired(): boolean {
    return this.endDate < new Date();
  }

  public isAboutToExpire(): boolean {
    return this.endDate < new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
  }
}
