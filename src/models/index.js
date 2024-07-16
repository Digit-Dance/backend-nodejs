/* sequelize설정을 위한 라이브러리 */
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

/* DB 설정 파일 불러오기 */
const basename = path.basename(__filename);
const config = require('../../env/database.config');

const db = {};

/* sequelize 설정 */
let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        port: config.port,
        database: config.database,
        username: config.username,
        password: config.password,
        dialect: config.dialect,
    })
}
/*
    models폴더에 정의된 파일 불러오기
        * 파일은 반드시 ***.model.js 형태로 만들어야 합니다
*/
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-9, -3) === '.model' &&
            file.slice(-3) === '.js'
        );
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize);
        db[model.name] = model;
    })

/* 관계 설정 */
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;