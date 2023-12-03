const express = require('express');
const router = express.Router();
// const verifyRefreshToken = require('../middleware/verifyRefreshToken');
// const { protect } = require('../middleware/authMiddleware');
const {
    uploadFile,
    getFileList,
    deleteFile,
    getFileById,
    downloadFile,
    updateFile,
    upload
} = require('../controllers/fileControllers');
const { protect } = require('../middleware/authMiddleware.js');


router.post('/upload',protect, upload,  uploadFile);


router.get('/list', protect, getFileList);
router.get('/:id', protect, getFileById);
router.get('/download/:id', protect, downloadFile);

router.delete('/delete/:id',protect, deleteFile);

router.put('/update/:id', protect, updateFile);

module.exports = router;
