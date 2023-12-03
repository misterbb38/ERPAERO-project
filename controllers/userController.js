const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const db = require('../models');

const User = db.user;
const blacklistedTokens = [];

// Генерация токена доступа
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '10m',  // 10 минут
    });
};

// Генерация токена обновления
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '30d',  // 30 дней
    });
};

// Обновление токена доступа
const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (blacklistedTokens.includes(refreshToken)) {
        return res.status(401).json({ success: false, error: 'Недействительный токен обновления' });
    }
    const user = await User.findOne({ where: { refreshToken } });

    if (!user) {
        return res.status(401).json({ success: false, error: 'Недействительный токен обновления' });
    }

    const accessToken = generateAccessToken(user.id);

    res.status(200).json({
        success: true,
        accessToken,
    });
});

// @ desc       Регистрация нового пользователя
//@route        Post /users/signup
//@access       Public
const registerUser = asyncHandler(async (req, res) => {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
        return res.status(400).json({ success: false, error: 'Пожалуйста, заполните все поля' });
    }

    const userExists = await User.findOne({ where: { emailOrPhone } });

    if (userExists) {
        return res.status(400).json({ success: false, error: 'Пользователь уже существует' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const refreshToken = generateRefreshToken();

    const user = await User.create({
        emailOrPhone,
        password: hashedPassword,
        refreshToken,
    });

    if (user) {
        const accessToken = generateAccessToken(user.id);

        res.status(201).json({
            _id: user.id,
            emailOrPhone,
            accessToken,
            refreshToken,
        });
    } else {
        res.status(400).json({ success: false, error: 'Неверные данные пользователя' });
    }
});

// @ desc       Аутентификация пользователя
//@route        Post /user/signup
//@access       Public
const loginUser = asyncHandler(async (req, res) => {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({ where: { emailOrPhone } });

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            _id: user.id,
            emailOrPhone,
            accessToken,
            refreshToken,
        });
    } else {
        res.status(400).json({ success: false, error: 'Неверные учетные данные' });
    }
});

// @ desc       Получение данных пользователя
//@route        Get /user/info
//@access       Private
const getMe = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.userId;

        console.log('Идентификатор пользователя в маршруте getMe:', userId);

        const user = await User.findByPk(userId);

        console.log('Объект пользователя в маршруте getMe:', user);

        if (user) {
            res.status(200).json({
                id: user.id,
                emailOrPhone: user.emailOrPhone,
            });
        } else {
            res.status(404).json({ success: false, error: 'Пользователь не найден' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
});

// @ desc       ВЫХОД пользователя 
//@route        Get /api/user/me
//@access       Private
const logout = asyncHandler(async (req, res) => {
    // Получение пользователя из запроса
    const user = await User.findByPk(req.user.userId);

    if (!user) {
        return res.status(404).json({ success: false, error: 'Пользователь не найден' });
    }

    // Получение токена обновления из запроса
    const { refreshToken } = req.body;

    // Проверка, не находится ли токен обновления уже в черном списке
    if (blacklistedTokens.includes(refreshToken)) {
        return res.status(401).json({ success: false, error: 'Токен уже в черном списке' });
    }

    // Добавление токена обновления в черный список
    blacklistedTokens.push(refreshToken);

    // Обновление поля токена обновления в базе данных
    user.refreshToken = null;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Выход выполнен успешно',
    });
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    refreshAccessToken,
    logout
};
