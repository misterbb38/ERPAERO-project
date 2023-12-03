// middleware/verifyRefreshToken.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require('../models');

const User = db.user;

const verifyRefreshToken = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;

    try {
        // Проверка действительности токена обновления
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Проверка существования пользователя, связанного с токеном обновления
        const user = await User.findOne({ where: { id: decoded.userId } });

        if (!user) {
            throw new Error('Неверный токен обновления');
        }

        // Добавление пользователя к запросу для последующего использования
        req.user = user;

        next(); // Переход к следующему промежуточному обработчику
    } catch (error) {
        res.status(401).json({ success: false, error: 'Неверный токен обновления' });
    }
});

module.exports = verifyRefreshToken;
