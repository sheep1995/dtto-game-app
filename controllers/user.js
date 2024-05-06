const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const config = require('../config');

class UserController {
    constructor() {
        this.userModel = new UserModel();
    }

    async login(req, res) {
        const { uId, type } = req.body;

        try {
            const user = await this.userModel.getUser(uId);

            if (!user) {
                const userId = this.generateUserId();
                const token = this.generateToken(uId, userId, type);

                await this.userModel.addUser(uId, userId, token, type);
                res.json({ userId, token });
            } else {
                const { uId, userId, type } = user;
                const newToken = this.generateToken(uId, userId, type);

                await this.userModel.updateUserToken(uId, newToken);
                res.json({ userId, token: newToken });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async refreshToken(req, res) {
        const token = req.headers.authorization;

        try {
            const { uId, userId, type } = jwt.verify(token, config.JWT_SECRET);

            const newToken = this.generateToken(uId, userId, type);

            await this.userModel.updateUserToken(uId, newToken);
            res.json({ userId, token: newToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    generateUserId() {
        return Math.random().toString(36).substring(2, 12); // 10-character random string
    }

    generateToken(uId, userId, type) {
        return jwt.sign({ uId, userId, type }, config.JWT_SECRET, { expiresIn: '1h' });
    }
}

module.exports = UserController;