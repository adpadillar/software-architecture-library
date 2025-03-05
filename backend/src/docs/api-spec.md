# Library Management System API Specification

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### Books

#### GET /books

Get all books in the library.

- Response: Array of Book objects
- Status: 200 OK

#### GET /books/search

Search books by title, author, or genre.

- Query Parameters:
  - title: string
  - author: string
  - genre: string
- Response: Array of matching Book objects
- Status: 200 OK

#### POST /books

Add a new book to the library.

- Body:

```json
{
  "title": "string",
  "author": "string",
  "genre": "string"
}
```

- Response: Created Book object
- Status: 201 Created

#### DELETE /books/:id

Remove a book from the library.

- Parameters:
  - id: string
- Status: 204 No Content

### Laptops

#### GET /laptops

Get all laptops in the library.

- Response: Array of Laptop objects
- Status: 200 OK

#### GET /laptops/available

Get all available laptops.

- Response: Array of available Laptop objects
- Status: 200 OK

#### POST /laptops

Add a new laptop to the library.

- Body:

```json
{
  "brand": "string",
  "model": "string"
}
```

- Response: Created Laptop object
- Status: 201 Created

### Loans

#### POST /loans/books

Create a new book loan.

- Body:

```json
{
  "bookId": "string",
  "userId": "string",
  "userType": "student" | "teacher"
}
```

- Response: Loan confirmation message
- Status: 201 Created

#### POST /loans/laptops

Create a new laptop loan (teachers only).

- Body:

```json
{
  "userId": "string"
}
```

- Response: Loan confirmation message
- Status: 201 Created

#### GET /loans/active

Get all active loans.

- Response: Array of active Loan objects
- Status: 200 OK

#### GET /loans/expired

Get all expired loans.

- Response: Array of expired Loan objects
- Status: 200 OK

#### GET /loans/user/:userId

Get all loans for a specific user.

- Parameters:
  - userId: string
- Response: Array of Loan objects
- Status: 200 OK

### Resources

#### POST /resources/:id/return

Return a borrowed resource.

- Parameters:
  - id: string
- Response: Return confirmation message
- Status: 200 OK

#### GET /resources

Get all resources in the library.

- Response: Array of Resource objects
- Status: 200 OK

#### GET /resources/:id/availability

Check if a resource is available.

- Parameters:
  - id: string
- Response: Availability status
- Status: 200 OK
