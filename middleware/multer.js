// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Конфигурация хранилища для загружаемых файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/'); // Указание директории для сохранения файлов
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Генерация уникального имени файла
    },
});

// Настройка объекта multer для загрузки файлов
const upload = multer({
    storage: storage, // Использование настроенного хранилища
    limits: { fileSize: '100000000' }, // Ограничение размера файла до 100 МБ
    fileFilter: (req, file, cb) => {
        const fileTypes = /pdf|doc|docx|txt|jpeg|jpg|png|gif|/; // Разрешенные типы файлов
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extname) {
            return cb(null, true);
        }
        cb('Give an appropriate file format for uploading'); // Ошибка при недопустимом формате файла
    },
}).single('file'); // Загрузка одного файла с полем 'file' в запросе

module.exports = upload;
