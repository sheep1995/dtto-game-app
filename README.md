# Dtto 碰碰樂 APP

## Installation

To install the dependencies, run: ```npm install```

Ensure you have a MySQL server installed. Create a database named `mydatabase` and set up a user with appropriate permissions. Update the `config` in `database.js` to ensure correct connection settings.

## Project Structure

This project follows the MVC (Model-View-Controller) architecture and uses the Express framework.

- **Model**: Responsible for interacting with the database to handle data operations.

- **Route**: Describes API endpoints, parameter validation, and includes Swagger documentation.

- **Controller**: Connects routes and models, and handles core business logic.

## Usage

To run the project, execute: ```node app.js```

## Dependencies

This project depends on the following packages:

- [Express](https://www.npmjs.com/package/express) - Fast, unopinionated, minimalist web framework for Node.js.
- [express-validator](https://www.npmjs.com/package/express-validator) - An express.js middleware for input validation and sanitation.
- [MySQL2](https://www.npmjs.com/package/mysql2) - A node.js driver for MySQL.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JSON Web Token implementation for Node.js.
- [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc) - A package to integrate Swagger using JSDoc comments.
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) - Middleware to serve the Swagger UI interface for API documentation.

## Contributing

We welcome contributions! To contribute to [Project Name], follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Create a new Pull Request.
