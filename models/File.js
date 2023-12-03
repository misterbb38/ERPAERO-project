// models/file.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const File = sequelize.define('File', {

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        extension: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        mimeType: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        uploadDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        path: {
            type: DataTypes.STRING,
            allowNull: true,
        },


    });

    // Определение ассоциации с моделью User (если каждый пользователь должен иметь свои собственные файлы)
    // File.belongsTo(sequelize.models.User, {
    //     foreignKey: 'userId',
    //     onDelete: 'CASCADE', // Удаление файла при удалении пользователя
    // });


    return File;
};
