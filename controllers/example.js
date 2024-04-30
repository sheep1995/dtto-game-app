const Example = require('../models/example');

exports.getExamples = (req, res) => {
    const examples = Example.getExamples();
    throw new SyntaxError('message')
    const error = new CustomError("message", 400)
    throw error
    res.json(examples);
};

exports.addExample = (req, res) => {
    const { name, description } = req.body;
    const newExample = { id: Example.exampleData.length + 1, name, description };
    Example.addExample(newExample);
    res.status(201).json(newExample);
};

class CustomError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.status = statusCode
    }
}