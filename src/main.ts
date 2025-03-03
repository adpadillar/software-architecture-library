import { Library } from "./models/Library";
import { Book, Laptop } from "./models/Resource";
import { Student, Teacher } from "./models/User";

const library = new Library();

// fantasy books
library.addBook(new Book("The Hobbit", "J.R.R. Tolkien", "Fantasy"));
library.addBook(new Book("The Lord of the Rings", "J.R.R. Tolkien", "Fantasy"));
library.addBook(new Book("The Silmarillion", "J.R.R. Tolkien", "Fantasy"));

// science fiction books
library.addBook(new Book("Dune", "Frank Herbert", "Science Fiction"));
library.addBook(new Book("Foundation", "Isaac Asimov", "Science Fiction"));
library.addBook(new Book("Neuromancer", "William Gibson", "Science Fiction"));

// school books
library.addBook(new Book("Introduction to Algorithms", "Thomas H. Cormen", "Science"));
library.addBook(new Book("The Art of Computer Programming", "Donald E. Knuth", "Science"));
library.addBook(new Book("Clean Code", "Robert C. Martin", "Science"));

// laptops
library.addLaptop(new Laptop("Apple", "MacBook Pro"));
library.addLaptop(new Laptop("Dell", "XPS"));
library.addLaptop(new Laptop("Lenovo", "ThinkPad"));

// teachers
const science_teacher = new Teacher("teacher1@school.gov", "Mr. Smith", library);
const math_teacher = new Teacher("teacher2@school.gov", "Mrs. Johnson", library);

// students
const student1 = new Student("student1@gmail.com", "Alice", library);
const student2 = new Student("student2@gmail.com", "Bob", library);
const student3 = new Student("student3@gmail.com", "Charlie", library);
const student4 = new Student("student4@gmail.com", "David", library);

science_teacher.requestLaptopLoan()
math_teacher.requestLaptopLoan()

const book1 = student1.searchBookByAuthor("J.R.R. Tolkien")
student1.requestLoan(book1)

const book2 = math_teacher.searchBookByGenre("Science Fiction")
student2.requestLoan(book2)


library.print()

