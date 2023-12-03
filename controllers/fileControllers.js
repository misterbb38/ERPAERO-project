const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../models');

const upload = require('../middleware/multer')

const File = db.file;

// @desc      ЗАГРУЗКА файла
// @route     GET /file/upload
// @access    Private
const uploadFile = asyncHandler(async (req, res) => {
    
        // Используйте функцию загрузки для обработки файла
        upload(req, res, async (err) => {

            // const userId = req.user.id; если файл принадлежит только одному пользователю 

            // Получите информацию о файле из запроса
            const { filename, originalname, mimetype, size } = req.file;

            // Используйте текущую дату как дату загрузки
            const uploadDate = new Date();
        
            // Запишите файл в базу данных
            const file = await File.create({
                filename: filename,
                name: originalname,
                extension: path.extname(originalname),
                mimeType: mimetype,
                size: size,
                uploadDate: uploadDate,
                //userId: userId
            });

            // Не сохранять путь в базе данных

            res.status(201).json({
                success: true,
                file: {
                    filename: filename,
                    name: originalname,
                    extension: path.extname(originalname),
                    mimeType: mimetype,
                    size: size,
                    uploadDate: uploadDate,
                },
            });
        });
   
});



// @desc      Получить все файлы
// @route     GET /file/list
// @access    Private
const getFileList = asyncHandler(async (req, res) => {
   
        const { list_size = 10, page = 1 } = req.query;

        // Преобразовать значения в целые числа
        const pageSize = parseInt(list_size, 10);
        const currentPage = parseInt(page, 10);

        // Вычислить смещение в зависимости от пагинации
        const offset = (currentPage - 1) * pageSize;

        // Получить список файлов из базы данных
        const files = await File.findAndCountAll({
            limit: pageSize,
            offset,
        });

        const totalFiles = files.count;
        const totalPages = Math.ceil(totalFiles / pageSize);

        // Рассчитать ссылки "next" и "prev"
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;

        res.status(200).json({
            success: true,
            currentPage,
            totalPages,
            totalFiles,
            prevPage,
            nextPage,
            files: files.rows,
        });
   
});


// @desc      УДАЛИТЬ файл
// @route     DELETE /file/delete:id
// @access    Private
const deleteFile = asyncHandler(async (req, res) => {
   
        const { id } = req.params;

        // Получить файл из базы данных
        const file = await File.findByPk(id);

        if (!file) {
            return res.status(404).json({ success: false, error: 'File not found' });
        }

        // Удалить файл из файловой системы
        const filePath = path.join(__dirname, '..', 'files', file.filename);
        fs.unlinkSync(filePath);

        // Удалить файл из базы данных
        await file.destroy();

        res.status(200).json({
            success: true,
            deletedFile: {
                id: file.id,
                filename: file.filename,
                // Добавьте другие свойства, которые вы хотите включить в ответ
            },
        });
    
});
// @desc      Получить файл
// @route     GET /file/:id
// @access    Private
const getFileById = asyncHandler(async (req, res) => {
    
        const { id } = req.params;

        // Получить файл из базы данных
        const file = await File.findByPk(id);

        res.status(200).json({
            success: true,
            file,
        });
   
});

// @desc      ЗАГРУЗИТЬ файл
// @route     GET /file/download/:id
// @access    Private
const downloadFile = asyncHandler(async (req, res) => {
   
        const { id } = req.params;

        // Получить файл из базы данных
        const file = await File.findByPk(id);

        if (!file || !file.filename) {
            return res.status(404).json({ success: false, error: 'File not found' });
        }

        // Получить имя файла без расширения
        const filenameWithoutExtension = path.parse(file.filename).name;

        // Ищем файл в папке "files" без учета расширения
        const matchingFiles = fs.readdirSync(path.join(__dirname, '../files')).filter(
            fileName => path.parse(fileName).name === filenameWithoutExtension
        );

        if (matchingFiles.length === 0) {
            return res.status(404).json({ success: false, error: 'File not found' });
        }

        // Берем первый совпадающий файл (предполагаем, что их всего один)
        const matchedFilename = matchingFiles[0];

        // Установить путь к файлу для скачивания
        const filePath = path.join(__dirname, '../files', matchedFilename);

        // Отправить файл клиенту для скачивания
        res.sendFile(filePath, {
            headers: {
                'Content-Disposition': `attachment; filename="${file.originalname}"`,
            },
        });
   
});



// @desc      ОБНОВИТЬ файл
// @route     UPDATE  /file/update/:id
// @access    Private
const updateFile = asyncHandler(async (req, res) => {
   
        const { id } = req.params;

        // Получить новую информацию о файле из запроса
        const { name, extension, mimeType, size } = req.body;

        // Получить текущий файл из базы данных
        const existingFile = await File.findByPk(id);

        if (!existingFile) {
            return res.status(404).json({ success: false, error: 'File not found' });
        }

        // Получить имя файла без расширения
        const filenameWithoutExtension = path.parse(existingFile.filename).name;

        // Ищем файл в папке "files" без учета расширения
        const matchingFiles = fs.readdirSync(path.join(__dirname, '..', 'files')).filter(
            fileName => path.parse(fileName).name === filenameWithoutExtension
        );

        if (matchingFiles.length === 0) {
            return res.status(404).json({ success: false, error: 'File not found' });
        }

        // Берем первый совпадающий файл (предполагаем, что их всего один)
        const matchedFilename = matchingFiles[0];

        // Установить путь к существующему файлу для удаления
        const existingFilePath = path.join(__dirname, '..', 'files', matchedFilename);

        // Удалить существующий файл из файловой системы
        fs.unlinkSync(existingFilePath);

        // Вызвать функцию загрузки для сохранения нового файла
        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, error: 'File Upload Error' });
            }

            // Получить информацию о новом файле из запроса
            const { filename, originalname, mimetype, size } = req.file;

            // Используйте текущую дату как дату загрузки
            const uploadDate = new Date();

            // Обновить файл в базе данных
            const updatedFile = await existingFile.update({
                filename: filename,
                    name: originalname,
                    extension: path.extname(originalname),
                    mimeType: mimetype,
                    size: size,
                    uploadDate: uploadDate, 
            });

            res.status(200).json({
                success: true,
                updatedFile,
            });
        });
    
});

module.exports = {
    uploadFile,
    getFileList,
    deleteFile,
    getFileById,
    downloadFile,
    updateFile,
    upload
};
