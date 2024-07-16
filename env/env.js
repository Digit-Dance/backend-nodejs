import path from 'path';
import dotenv from 'dotenv';

/*
    env 환경변수 파일을 사용하기 위한 파일

    * 예제에서는 학습을 위해 env파일을 공개하였지만
    실제 프로젝트에선 env파일을 절대절대 github같은 개방된 공간에 올려서는 안된다 *
*/
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: path.join(__dirname, '.env.production') });
} else if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: path.join(__dirname, '.env.development') });
} else {
    // throw new Error('process.env.NODE_ENV is undefined');
    dotenv.config({ path: path.join(__dirname, '.env.local') });
}