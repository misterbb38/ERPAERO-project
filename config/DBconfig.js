module.exports = {
    //В режиме продакшн эта информация должна находиться в файле .env.
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: '',
    DB: 'erp_aero',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}