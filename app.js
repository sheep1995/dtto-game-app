const express = require('express');
const config = require('./config');
const userRouter = require('./routes/user');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./swaggerOptions'); // Import the swaggerOptions file

const app = express();

// Define the Swagger specification
const specs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(express.json());

// Routes
app.use('/api/user', userRouter);

// Serve Swagger documentation using Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Start server
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});

// Handle 400 Bad Request
app.use((err, req, res, next) => {
    console.debug('err', err);
    if (err instanceof SyntaxError || err.status === 400) {
        // Handle bad JSON parsing
        res.status(400).json({ error: 'Bad Request' });
    } else {
        next(err);
    }
});

// Handle other errors
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Handle other endpoints or invalid requests
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
