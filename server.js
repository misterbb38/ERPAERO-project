const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');

// Инициализация Express приложения
const app = express();

// Конфигурация для использования JSON в запросах
app.use(express.json());

// Конфигурация CORS
var corOptions = {
    origin: 'https://localhost:8081',
};

// Маршруты
app.use('/', require('./routes/userRoutes'));
app.use('/file', require('./routes/fileRoutes'));

// Промежуточное ПО для обработки ошибок
app.use(errorHandler);

// Конфигурация CORS
app.use(cors(corOptions));

// Конфигурация для обработки данных формы
app.use(express.urlencoded({ extended: true }));

// Конфигурация для обслуживания статических файлов из папки 'files'
app.use('/files', express.static('./files'));

// Конфигурация порта
const PORT = process.env.PORT || 8080;

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
