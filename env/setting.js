/*
    npx sequelize db:create 명령어를 실행하기 위한 파일
     * 해당 파일은 .sequelizerc 파일과 관련있습니다
*/

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env.development') });

const dbconfig = {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dialect: process.env.DATABASE_DIALECT
};


module.exports = dbconfig;