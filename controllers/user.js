class UserController {
    static getAllUsers(req, res) {
        // Fetch users data from your database or any other source
        const users = [
            // Sample user data
            { name: 'John Doe', email: 'john@example.com' },
            { name: 'Jane Smith', email: 'jane@example.com' },
        ];

        res.json({ users });
    }

    // Add more methods for handling user-related functionality
}

module.exports = UserController;