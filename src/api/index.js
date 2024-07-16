/*
    사용자가 정의한 api 불러오기
     * 만약 새로운 api 파일을 만들면 import해야 한다
*/
import Test from './test';

import User from './user';


/* 사용자가 정의한 api 내보내기 */
export const routes = [...User, ...Test];