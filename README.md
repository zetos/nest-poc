<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJS POC Project

This is a Proof of Concept (POC) project using NestJS. The project demonstrates basic functionalities such as user creation and money transfer between users, incorporating various features like Prisma ORM, custom error handling, and comprehensive testing.

> **Note:** Here is a [Drizzle Branch](https://github.com/zetos/nest-poc/tree/feat-drizzle) for comparation.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
  - [Endpoints](#endpoints)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Features](#features)
- [TODO](#todo)

## Description

This project serves as a POC for building a simple financial application using NestJS. It includes endpoints for creating users and transferring funds between users, with robust error handling and testing mechanisms.

## Installation

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/nestjs-poc.git
   cd nestjs-poc
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Set up the environment variables (e.g., database connection details) in a `.env` file:

   ```plaintext
   DATABASE_URL=your_database_url
   ```

4. Generate prisma client:

   ```bash
   pnpm run prisma:generate
   ```

5. Run the database migrations:

   ```bash
   pnpm run prisma:deploy
   ```

6. Start the development server:
   ```bash
   pnpm run start:dev
   ```

## Usage

### Endpoints

#### `POST /user`

Creates a user of type `common` using a `cpf` or a user of type `shopkeeper` using `cnpj`.

**Request Body:**

```json
{
  "email": "mary@example.com",
  "name": "Mary Doe",
  "hash": "123",
  "type": "common",
  "cpf": "545.214.090-59",
  "balance": 500
}
```

Response:

- 201 Created: User successfully created.
- 400 Bad Request: Invalid input data.

#### `POST /transfer`

Creates a transfer between a common user as the creditor and another user. Validates user existence, type, and balance before proceeding with the transfer, and makes a request to a fake authorizer API.

**Request Body:**

```json
{ "creditorId": 1, "debitorId": 2, "amount": 5 }
```

Response:

- 201 Created: Transfer successfully created.
- 400 Bad Request: Invalid input data.
- 502 Bad Gateway: Fake Authorizer denial.

## Error Handling

The project uses the `HttpException` error format for consistent error handling. Errors are returned with appropriate HTTP status codes and messages to help with debugging and user feedback.
This is implemented by manually throwing a `HttpException`, `class-validator` errors and a custom filter to transform prisma exceptions into the `HttpException` format.

## Testing

The project includes various tests to ensure functionality and reliability:

- Unit Tests: For individual pure functions located at the `util` directory.
- Integration Tests: To test the integration between components. In this application it is used for _services_ that dont prisma, mocking requests or other external API calls.
- End-to-End (E2E) Tests: To simulate real-world scenarios. Third party API calls are mocked.

Run the tests using:

```bash
pnpm run test
pnpm run test:e2e # Make sure the db is running
```

## Features

- Prisma ORM: For database operations.
- Error Handling: Using HttpException for consistent and informative error responses.
- Swagger: For API documentation.
- CI/CD: Configured with GitHub Actions.
- Testing: Comprehensive tests using Jest and Pactum.
