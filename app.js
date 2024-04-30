const express = require('express');
const app = express();
const config = require('./config');
const exampleRouter = require('./routes/example');
const userRouter = require('./routes/user');

// Middleware
app.use(express.json());

// Routes
app.use('/api/example', exampleRouter);
app.use('/api/users', userRouter);

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
