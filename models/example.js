let exampleData = [];

// Add mock data
exampleData.push({ id: 1, name: 'Example 1', description: 'This is example 1' });
exampleData.push({ id: 2, name: 'Example 2', description: 'This is example 2' });

// Methods to interact with the data
const getExamples = () => {
    return exampleData;
};

const addExample = (example) => {
    exampleData.push(example);
};

// Export model methods and exampleData
module.exports = {
    getExamples,
    addExample,
    exampleData // Export exampleData
};