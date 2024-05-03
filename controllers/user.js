const userModel = require('../models/user');
const { validationResult } = require('express-validator');

exports.getUsersList = async(req, res) => {
    try {
        const users = await userModel.getUsersList();
        console.debug('users', users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getUsersList:', error)
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserById = async(req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.getUserById(userId);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error getUserById:', error)
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addUser = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { name, email } = req.body;
        const users = await userModel.getUsersList();
        const currentLength = users.length;
        console.debug('currentLength', currentLength);
        const newUser = await userModel.addUser({ id: currentLength + 1, userName: name, email });
        res.status(200).json(newUser);
    } catch (error) {
        console.error('Error addUser:', error)
        res.status(500).json({ error: 'Internal server error' });
    }
};