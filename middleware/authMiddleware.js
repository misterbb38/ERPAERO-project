const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require('../models');

const User = db.user;

const protect = asyncHandler(async (req, res, next) => {
    let refreshToken;

    // Извлечение токена обновления из тела запроса или заголовков
    if (req.body.refreshToken) {
        refreshToken = req.body.refreshToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        refreshToken = req.headers.authorization.split(' ')[1];
    }

    try {
        if (!refreshToken) {
            res.status(401);
            throw new Error('Недопустимо, отсутствует токен обновления');
        }

        // Проверка токена обновления
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Поиск пользователя, связанного с токеном обновления в базе данных
        const user = await User.findByPk(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            res.status(401);
            throw new Error('Недопустимо, неверный токен обновления');
        }

        // Установка идентификатора пользователя в объекте запроса
        req.user = { userId: user.id }; // Установите userId в user.id

        next();
    } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error('Недопустимо');
    }
});

module.exports = { protect };
