/*
    사용자가 정의하는 라우터 파일은 controller, service로 구분되며 각 역할은 아래와 같다
        * controller 파일
            - path설정       -> URL에서 주소 뒤에 /~~~ 부분을 의미함
            - method설정     -> GET, POST, PUT, DELETE
            - middleware설정 -> 보통 로그인 여부를 확인할 때 또는 이미지 관련해서 많이 사용
            - controller설정 -> 프론트에서 요청과 함께 전달한 데이터를 실제 로직이 정의된 함수에게 넘겨주고
                             함수가 넘겨준 데이터를 프론트에 넘겨주는 역할

        * service 파일
            - DB에 CRUD를 하는 로직이 정의된 함수를 모아놓은 파일
        
    요약: 프론트에서 api를 요청하면 controller파일에서 요청을 받아 service파일로 넘겨주고
        데이터를 처리한 service파일이 다시 controller파일에게 데이터를 넘겨주고
        controller는 다시 프론트에게 처리된 데이터를 넘겨준다
    
        front <-> controller <-> service
*/

/* service 파일 불러오기 */
import TestService from "./test.service";
/* service파일을 사용하기 위한 라이브러리 */
import { Container } from 'typedi';

export default [
    /**
     * 라우터 설정을 위한 파일
        * api 하나를 추가하기 위해선
        path, method, middleware, controller를 
        멤버(속성)로 가지는 객체를 하나 추가해야 한다
     */
    {
        /*
            path 설정
             * 해당 예제에서는 프론트에서 http://localhost:3333/test로 요청이 왔을 경우
             * 여기에 정의된 controller로 요청이 들어온다
        */
        path: '/test',

        /* method 설정 : GET, POST, PUT, DELETE중 하나가 된다 (대소문자 상관 없음) */
        method: 'get',

        /*
            middleware 설정
             * 일반적으로 로그인 여부 판단이나 이미지를 다루는 곳에서 사용
        */
        middleware: [],

        /* 프론트에서 요청이 올 경우 실행되는 함수 */
        controller: async (req, res, next) => {
            try {
                /* 오류가 났을 때 어디서 진입이 되었는지 확인하기 위한 콘솔 */
                console.log('[Test] GET test Controller Enter');
                /* service instance 만들기 */
                const TestServiceInstance = Container.get(TestService);
                /* 사용자가 정의한 함수 호출 */
                const data = await TestServiceInstance.Test();

                /*
                    프론트에게 요청이 완료되었는지 실패했는지 알려주기
                */
                return res.status(200).json(data);
            } catch (err) {
                /* 로직 실행 중 오류가 났을 경우 프론트에게 오류가 났음을 알림 */
                console.log('[Test] GET test Controller Error');
                return res.status(500).json({
                    data: 'error!'
                })
            }
        }
    },
]