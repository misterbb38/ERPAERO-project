// models/user.js
const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        emailOrPhone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEailOrPhoneNumber(value) {
                    
                    const eailRegex = /\S+@\S+\.\S+/;
                    const phoneRegex = /^\+\d{11}$/; 
        
                    if (!(eailRegex.test(value) || phoneRegex.test(value))) {
                        throw new Error('Пожалуйста, введите действительный адрес электронной почты или номер телефона в формате (+7');
                    }
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    return User;
};
