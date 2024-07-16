import { Service, Inject } from 'typedi';
/* DB를 사용하기 위한 import (실제 사용은 user.service.js 참조) */
import models from '../../models';


export default class TestService {
    constructor() { }

    /*
        사용자가 정의하는 함수
         * 일반적으로 DB를 사용 할 경우 비동기로 진행되며 이로 인한
        콜백 지옥을 피하기 위해 async, awiat를 사용
    */
    async Test() {
        /* 오류 처리를 위한 try-catch문 */
        try {
            /*
                함수가 종료될 경우 반드시 return을 하여 현재 상태가 어떤지 controller에게 알려준다

                 * 만약 실패하는 경우가 여러개인 경우 상태 값을 여러개로 정의하여
                controller에게 어떤 오류가 났는지 명확하게 알려준다
            */
            return {
                data: '백엔드 요청'
            }
        } catch (err) {
            /*
                함수 실행 중 오류가 발생할 경우 로그를 남기고 오류 전달(로그 방법은 추후 추가)
            */
            throw err;
        }
    }
}