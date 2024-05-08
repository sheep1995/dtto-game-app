const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'User API',
        version: '1.0.0',
        description: 'API documentation for user management',
        contact: {
          name: 'Your Name',
          email: 'your.email@example.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000', // Replace with your server URL
          description: 'Development server'
        }
      ]
    },
    apis: ['./routes/user.js'] // Specify the path to your route file
  };
  
  module.exports = swaggerOptions;