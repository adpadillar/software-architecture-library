# Library Management System

A modern library management system that handles books and laptop loans for students and teachers.

## Features

- Book management (add, remove, search, loan)
- Laptop management (add, loan to teachers)
- User roles (students and teachers)
- Loan tracking and history
- RESTful API interface

## Getting Started

### Prerequisites

- Node.js >= 14
- SQLite3
- TypeScript

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tc-library.git
cd tc-library
```

2. Install dependencies:

```bash
npm install
```

3. Create the database:

```bash
npm run init-db
```

4. Start the server:

```bash
npm start
```

The API will be available at `http://localhost:3000/api`

## Project Structure

```
tc-library/
├── src/
│   ├── models/         # Data models
│   ├── services/       # Business logic and database operations
│   ├── controllers/    # Request handlers
│   └── config/         # Configuration files
├── docs/              # Documentation
└── tests/            # Test files
```

## Key Concepts

### Resources

The system manages two types of resources:

- Books: Can be borrowed by both students and teachers
- Laptops: Can only be borrowed by teachers

### Loans

- Books: 14-day loan period
- Laptops: 1-day loan period
- System tracks active and expired loans

### Users

- Students: Can borrow books
- Teachers: Can borrow books and laptops

## API Usage Examples

### Searching for a Book

```bash
curl "http://localhost:3000/api/books/search?title=Programming"
```

### Creating a Book Loan

```bash
curl -X POST http://localhost:3000/api/loans/books \
  -H "Content-Type: application/json" \
  -d '{"bookId":"123","userId":"456","userType":"student"}'
```

### Checking Resource Availability

```bash
curl http://localhost:3000/api/resources/123/availability
```

For complete API documentation, see [API Specification](./docs/api-spec.md)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
