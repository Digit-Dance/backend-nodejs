/* 환경변수 실행 파일 */
import '../env/env';
/* 서버를 실행하기 위한 라이브러리 불러오기 */
import dotenv from 'dotenv';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

/*
  서버 라우터 및 기능 모듈
    * 윈도우의 경우 Ctrl을 누르고 ./api를 클릭하시면 해당 파일로 이동됩니다.
    * 맥의 경우 Command를 누르고 ./api를 클릭하시면 해당 파일로 이동됩니다.
*/
import { routes } from './api';

/*
  DB 관련 모듈
    * 윈도우의 경우 Ctrl을 누르고 ./api를 클릭하시면 해당 파일로 이동됩니다.
    * 맥의 경우 Command를 누르고 ./api를 클릭하시면 해당 파일로 이동됩니다.
*/
import models from './models';

/* 환경변수 설정 */
dotenv.config();

/* express 서버 설정 */
const app = express();

/*
  처음 실행하실 때 아래 코드의 주석을 해제한 뒤 npm start로 서버를 실행하시고
  반드시 다시 주석을 해주시기 바랍니다.
    * {force: true} 일 경우 서버가 재시작 될 때마다 DB가 초기화 되므로
  반드시 꼭! 주석처리 해주셔야 합니다.
  Coin 누적 시 백업해서 데이터 복구 또는 migration 사용(어려움)
 */
// if (process.env.DB_SYNC || process.env.DB_SYNC === 'false') {
//   console.log('Sequelize Initialize');
//   models.sequelize
//     .sync({ force: true })
//     .then(() => {
//       console.log('Sequelize Success');
//     })
//     .catch((err) => {
//       console.log('Sequelize Error : ', err);
//     });
// }

// app.disable('x-powered-by');

/*
  서버 cors설정

  만약 프론트 주소가 http://example.com일 경우
  origin에 http://example.com을 추가하셔야 통신이 가능합니다
*/
app.use(
  cors({
    origin: [
      'http://localhost:3000', //local 말고 url을 가질 경우 url로 수정 백엔드 포트와 다른 포트를 사용해야됨
      'http://localhost:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

/* 서버 설정 부분이므로 자세히 보실 필요 없습니다. */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* 사용자가 정의한 라우터 설정 */
routes.forEach((route) => {
  app[route.method](route.path, [...route.middleware], route.controller);
});
const { Sequelize } = require('sequelize');

// Connect to MySQL without specifying a database
const sequelize = new Sequelize('mysql://root:0000@localhost', {
  logging: false, // Turn off logging
});

async function createDatabase() {
  const dbName = 'test_schema'; // Move dbName declaration to a broader scope
  try {
    // Check if the database exists
    const databases = await sequelize.query("SHOW DATABASES;", { type: Sequelize.QueryTypes.SHOWTABLES });
    
    if (!databases[0].includes(dbName)) { // Ensure correct checking of database existence
      // Create the database if it does not exist
      await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
      console.log(`Database ${dbName} created.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    // Close the initial connection
    await sequelize.close();
    
    // Reconnect with the new database
    // Make sure to replace 'username:password' with actual credentials
    const sequelizeWithDb = new Sequelize(`mysql://root:0000@localhost/${dbName}`, {
      logging: false, // Turn off logging
    });
    
  }
}

createDatabase();
/* 서버 에러처리 부분이므로 자세히 보실 필요 없습니다 */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

async function syncDatabase() {
  try {
    await models.sequelize.sync({ force: false });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}


app.listen(3000, async () => {
  console.log('Server is running on port 3000');
  await syncDatabase();
  console.log('Initialization successful');
});


module.exports = app;
