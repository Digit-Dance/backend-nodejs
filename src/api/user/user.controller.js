import UserService from "./user.service"; // UserService 모듈을 임포트한다.
import { Container } from 'typedi'; // typedi 라이브러리에서 Container를 임포트한다.

export default [
    /**
     * 회원가입
     */
    {
        path: '/user/signup', // 회원가입 API의 경로를 설정한다.
        method: 'post', // HTTP 메소드를 POST로 설정한다.
        middleware: [], // 사용할 미들웨어가 없음을 나타낸다.
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수 정의
            try { // 에러 처리를 위한 try 블록을 시작한다.
                // 콘솔 메시지를 이용하여 개발자에게 어떤 컨트롤러로 진입했는지 알려준다
                // (에러 발생 시 마지막 접근 API를 알기 위함)
                console.log('[User SignUp Controller Enter]'); // 컨트롤러 진입 로그를 출력한다.
                const UserServiceInstance = Container.get(UserService); // UserService 인스턴스를 typedi Container를 통해 가져온다.
                const userInfo = req.body; // 요청 본문에서 userInfo를 추출한다.
                const data = await UserServiceInstance.SignUp(userInfo); // UserService의 SignUp 메소드를 호출하여 결과를 얻는다.

                /**
                 * 4091: 회원가입 성공
                 * 4092: 이메일 없음
                 * 4093: 비밀번호 없음
                 * 4094: 회원 존재
                 */
                let message = ''; // 메시지 변수를 초기화한다.
                switch (data.status) { // data.status 값을 기반으로 메시지를 설정한다.
                    case 4091:
                        message = '회원가입 성공'; // 상태 4091일 때의 메시지
                        break;
                    case 4092:
                        message = '이메일 없음'; // 상태 4092일 때의 메시지
                        break;
                    case 4093:
                        message = '비밀번호 없음'; // 상태 4093일 때의 메시지
                        break;
                    case 4094:
                        message = '회원 존재'; // 상태 4094일 때의 메시지
                        break;
                    default:
                        message = '알 수 없는 오류 발생!'; // 기본 메시지
                        break;
                }

                /*
                    결과에 따른 메시지를 같이 보내 프론트에서 어떤 에러가 났는지 확실하게 알 수 있게 해준다.
                    아래와 같이 응답을 보내면 프론트에선 다음과 같은 데이터를 전달받는다. (회원가입 성공 했다고 가정)
                    {
                        message: '회원가입 성공',
                        status: 4091,
                        data: {
                            id: '1234',
                            pw: '1234
                        }
                    }
                */
                return res.status(200).json({ // 상태 200과 JSON 형식의 응답을 반환한다.
                    message, // 메시지를 포함한다.
                    ...data, // data 객체의 나머지 속성을 포함한다.
                });
            } catch (err) { // 에러가 발생한 경우
                // 에러가 났을 경우를 대비하여 try-catch문을 이용하여 확실하게 에러 처리를 한다.
                return res.status(500).json({ // 상태 500과 JSON 형식의 에러 메시지를 반환한다.
                    message: err, // 에러 메시지를 포함한다.
                });
            }
        }
    },

    /**
     * 로그인
     */
    {
        path: '/user/signin', // 로그인 API의 경로를 설정한다.
        method: 'post', // HTTP 메소드를 POST로 설정한다.
        middleware: [], // 사용할 미들웨어가 없음을 나타낸다.
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수 정의
            try { // 에러 처리를 위한 try 블록을 시작한다.
                console.log('[User SignIn Controller Enter]'); // 컨트롤러 진입 로그를 출력한다.
                const UserServiceInstance = Container.get(UserService); // UserService 인스턴스를 typedi Container를 통해 가져온다.
                const userInfo = req.body; // 요청 본문에서 userInfo를 추출한다.
                const data = await UserServiceInstance.SignIn(userInfo); // UserService의 SignIn 메소드를 호출하여 결과를 얻는다.

                /**
                 * 4091: 로그인 성공
                 * 4092: 회원이 존재하지 않음
                 * 4093: 비밀번호 틀림
                 */
                let message = ''; // 메시지 변수를 초기화한다.
                switch (data.status) { // data.status 값을 기반으로 메시지를 설정한다.
                    case 4091:
                        message = '로그인 성공'; // 상태 4091일 때의 메시지
                        break;
                    case 4092:
                        message = '회원이 존재하지 않음'; // 상태 4092일 때의 메시지
                        break;
                    case 4093:
                        message = '비밀번호 틀림'; // 상태 4093일 때의 메시지
                        break;
                    default:
                        message = '알 수 없는 오류 발생!'; // 기본 메시지
                        break;
                }

                return res.status(200).json({ // 상태 200과 JSON 형식의 응답을 반환한다.
                    message, // 메시지를 포함한다.
                    ...data, // data 객체의 나머지 속성을 포함한다.
                });
            } catch (err) { // 에러가 발생한 경우
                return res.status(500).json({ // 상태 500과 JSON 형식의 에러 메시지를 반환한다.
                    message: err, // 에러 메시지를 포함한다.
                });
            }
        }
    },

    /**
     * 점수 기록
     */
    {
        path: '/user/score', // API 경로
        method: 'post', // HTTP 메서드
        middleware: [], // 사용될 미들웨어 (현재는 없음)
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수
            try {
                console.log('[User Score Controller Enter]'); // 디버깅 메시지
                const UserServiceInstance = Container.get(UserService);  // UserService 인스턴스 가져오기
                const { userId, score } = req.body; // 요청 본문에서 userId와 score를 추출
                console.log(req.body);
                const data = await UserServiceInstance.RecordScore(userId, score); // 점수 기록 처리
                
                let message = ''; // 메시지 변수 초기화
                switch (data.status) { // 상태에 따른 메시지 설정
                    case 4091:
                        message = '점수 기록 성공';
                        break;
                    case 4092:
                        message = '사용자 존재하지 않음';
                        break;
                    case 4093:
                        message = '점수 기록 실패';
                        break;
                    default:
                        message = '알 수 없는 오류 발생!';
                        break;
                }
    
                console.log(data);
                console.log("message");
                console.log(message);
    
                return res.status(200).json({ // 성공적인 응답 반환
                    message,
                    status: data.status,
                    data: data.data
                });
            } catch (err) { // 에러 처리
                console.log(err);
                return res.status(500).json({
                    message: err.message // 에러 메시지 반환
                });
            }
        }
    },
    /**
     * 점수 조회(최신 4개 점수 조회)
     */
    {
        path: '/user/getScores',  // API 경로
        method: 'post', // HTTP 메서드
        middleware: [], // 사용될 미들웨어 (현재는 없음)
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수
        try {
            console.log('[User GetScores Controller Enter]'); // 디버깅 메시지
            const UserServiceInstance = Container.get(UserService); // UserService 인스턴스 가져오기
            const { userId } = req.body; // 요청 본문에서 userId를 추출
            const data = await UserServiceInstance.GetScores(userId); // 점수 조회 처리
    
            let message = ''; // 메시지 변수 초기화
            switch (data.status) { // 상태에 따른 메시지 설정
            case 4091:
                message = '점수 조회 성공';
                break;
            case 4092:
                message = '사용자 존재하지 않음';
                break;
            default:
                message = '알 수 없는 오류 발생!';
                break;
            }
    
            return res.status(200).json({ // 성공적인 응답 반환
            message,
            status: data.status,
            data: data.data
            });
        } catch (err) { // 에러 처리
            console.log(err);
            return res.status(500).json({
            message: err.message // 에러 메시지 반환
            });
        }
        }
    },

    /**
     * 코인 적립
     */

        {
        path: "/user/coin/deposit", // API 경로
        method: "post", // HTTP 메서드
        middleware: [], // 사용될 미들웨어 (현재는 없음)
        controller: async (req, res, next) => {
        // 비동기 컨트롤러 함수
        try {
            console.log("[User Score Controller Enter]");
            const UserServiceInstance = Container.get(UserService);
            const { userId, amount } = req.body;
            console.log("Received request:", req.body);

            const data = await UserServiceInstance.DepositCoin(userId, amount);

            let message = "";
            switch (data.status) {
                case 4091:
                message = "점수 기록 성공";
                break;
                case 4092:
                message = "사용자 존재하지 않음";
                break;
                case 4093:
                message = "점수 기록 실패";
                break;
                default:
                message = "알 수 없는 오류 발생!";
                break;
            }

            console.log("Response data:", data);
            console.log("Response message:", message);

            return res.status(200).json({
            // 성공적인 응답 반환
                message,
                ...data,
            });
            } catch (err) {
            console.error("[User Score Controller Error]", err);
            return res.status(500).json({
                message: err.message,
            });
            }
        },
        },


    // 코인 사용 API
    {
        path: '/user/useCoin', // 코인 사용 API의 경로를 설정한다.
        method: 'post', // HTTP 메소드를 POST로 설정한다.
        middleware: [], // 사용할 미들웨어가 없음을 나타낸다.
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수 정의
            try {
                console.log('[User UseCoin Controller Enter]'); // 컨트롤러 진입 로그를 출력한다.
                const UserServiceInstance = Container.get(UserService); // UserService 인스턴스를 typedi Container를 통해 가져온다.
                const { userId, coinAmount } = req.body; // 요청 본문에서 userId와 coinAmount를 추출한다.
                const data = await UserServiceInstance.UseCoin(userId, coinAmount); // UserService의 UseCoin 메소드를 호출하여 결과를 얻는다.

                /**
                 * 4091: 코인 사용 성공
                 * 4092: 코인 부족
                 */
                let message = ''; // 메시지 변수를 초기화한다.
                switch (data.status) { // data.status 값을 기반으로 메시지를 설정한다.
                    case 4091:
                        message = '코인 사용 성공'; // 상태 4091일 때의 메시지
                        break;
                    case 4092:
                        message = '코인 부족'; // 상태 4092일 때의 메시지
                        break;
                    default:
                        message = '알 수 없는 오류 발생!'; // 기본 메시지
                        break;
                }

                return res.status(200).json({ // 상태 200과 JSON 형식의 응답을 반환한다.
                    message, // 메시지를 포함한다.
                    ...data // data 객체의 나머지 속성을 포함한다.
                });
            } catch (err) { // 에러가 발생한 경우
                return res.status(500).json({ // 상태 500과 JSON 형식의 에러 메시지를 반환한다.
                    message: err // 에러 메시지를 포함한다.
                });
            }
        }
    },

    // 식물 키우기 API
    {
        path: '/user/plantlevel', // 식물 키우기 API의 경로를 설정한다.
        method: 'post', // HTTP 메소드를 POST로 설정한다.
        middleware: [], // 사용할 미들웨어가 없음을 나타낸다.
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수 정의
            try {
                console.log('[User plantlevel Controller Enter]'); // 컨트롤러 진입 로그를 출력한다.
                const UserServiceInstance = Container.get(UserService); // UserService 인스턴스를 typedi Container를 통해 가져온다.
                const { userId, action } = req.body; // 요청 본문에서 userId와 action을 추출한다.
                const data = await UserServiceInstance.plantlevel(userId, action); // UserService의 plantlevel 메소드를 호출하여 결과를 얻는다.

                /**
                 * 4091: 식물 성장 성공
                 * 4092: 식물 성장 실패
                 */
                let message = ''; // 메시지 변수를 초기화한다.
                switch (data.status) { // data.status 값을 기반으로 메시지를 설정한다.
                    case 4091:
                        message = '식물 성장 성공'; // 상태 4091일 때의 메시지
                        break;
                    case 4092:
                        message = '식물 성장 실패'; // 상태 4092일 때의 메시지
                        break;
                    default:
                        message = '알 수 없는 오류 발생!'; // 기본 메시지
                        break;
                }

                return res.status(200).json({ // 상태 200과 JSON 형식의 응답을 반환한다.
                    message, // 메시지를 포함한다.
                    ...data // data 객체의 나머지 속성을 포함한다.
                });
            } catch (err) { // 에러가 발생한 경우
                return res.status(500).json({ // 상태 500과 JSON 형식의 에러 메시지를 반환한다.
                    message: err // 에러 메시지를 포함한다.
                });
            }
        }
    },
    /**
     * 점수 조회(오래된 순서로 12개 조회)
     */
    {
        path: '/user/getScoresOldDate',  // API 경로
        method: 'post', // HTTP 메서드
        middleware: [], // 사용될 미들웨어 (현재는 없음)
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수
        try {
            console.log('[User GetScores Controller Enter]'); // 디버깅 메시지
            const UserServiceInstance = Container.get(UserService); // UserService 인스턴스 가져오기
            const { userId } = req.body; // 요청 본문에서 userId를 추출
            const data = await UserServiceInstance.GetScoresOldDate(userId); // 점수 조회 처리
    
            let message = ''; // 메시지 변수 초기화
            switch (data.status) { // 상태에 따른 메시지 설정
            case 4091:
                message = '점수 조회 성공';
                break;
            case 4092:
                message = '사용자 존재하지 않음';
                break;
            default:
                message = '알 수 없는 오류 발생!';
                break;
            }
    
            return res.status(200).json({ // 성공적인 응답 반환
            message,
            status: data.status,
            data: data.data
            });
        } catch (err) { // 에러 처리
            console.log(err);
            return res.status(500).json({
            message: err.message // 에러 메시지 반환
            });
        }
        }
    },
];

