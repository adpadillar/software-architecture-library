type State = "borrowed" | "available";

export class Resource {
  private id: string;
  private state: State;

  constructor(state: State, id: string) {
    this.id = id;
    this.state = state;
  }

  // Agregar este método
  public getState(): State {
    return this.state;
  }

  public isAvailable(): boolean {
    return this.state === "available";
  }

  public getId(): string {
    return this.id;
  }

  public borrow(): void {
    this.state = "borrowed";
  }

  public return(): void {
    this.state = "available";
  }
}

export class Laptop extends Resource {
  private brand: string;
  private model: string;

  constructor(brand: string, model: string, state: State, id: string) {
    super(state, id);
    this.brand = brand;
    this.model = model;
  }

  public getBrand(): string {
    return this.brand;
  }

  public getModel(): string {
    return this.model;
  }
}

export class Book extends Resource {
  private title: string;
  private author: string;
  private genre: string;

  constructor(
    title: string,
    author: string,
    genre: string,
    state: State,
    id: string
  ) {
    super(state, id);
    this.title = title;
    this.author = author;
    this.genre = genre;
  }

  public getTitle(): string {
    return this.title;
  }

  public getAuthor(): string {
    return this.author;
  }

  public getGenre(): string {
    return this.genre;
  }
}
