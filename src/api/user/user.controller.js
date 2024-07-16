import UserService from "./user.service"; // UserService 모듈을 임포트한다.
import { Container } from 'typedi'; // typedi 라이브러리에서 Container를 임포트한다.

// 사용자 관련 API 엔드포인트들을 배열 형태로 정의한다.
export default [
    /**
     * 회원가입
     */
    {
        path: '/user/signup', // API 경로
        method: 'post', // HTTP 메서드
        middleware: [], // 사용될 미들웨어 (현재는 없음)
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수
            try {
                console.log('[User SignUp Controller Enter]'); // 디버깅 메시지
                const UserServiceInstance = Container.get(UserService); // UserService 인스턴스 가져오기
                const userInfo = req.body; // 요청 본문에서 사용자 정보를 추출
                const data = await UserServiceInstance.SignUp(userInfo); // 회원가입 처리

                let message = ''; // 메시지 변수 초기화
                switch (data.status) { // 상태에 따른 메시지 설정
                    case 4091:
                        message = '회원가입 성공';
                        break;
                    case 4092:
                        message = '유효하지 않은 입력';
                        break;
                    case 4094:
                        message = '회원 존재';
                        break;
                    default:
                        message = '알 수 없는 오류 발생!';
                        break;
                }

                return res.status(200).json({ // 성공적인 응답 반환
                    message,
                    ...data,
                });
            } catch (err) { // 에러 처리
                return res.status(500).json({
                    message: err.message, // 에러 메시지 반환
                });
            }
        }
    },

    /**
     * 로그인
     */
    {
        path: '/user/signin', // API 경로
        method: 'post', // HTTP 메서드
        middleware: [], // 사용될 미들웨어 (현재는 없음)
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수
            try {
                console.log('[User SignIn Controller Enter]'); // 디버깅 메시지
                const UserServiceInstance = Container.get(UserService); // UserService 인스턴스 가져오기
                const userInfo = req.body; // 요청 본문에서 사용자 정보를 추출
                const data = await UserServiceInstance.SignIn(userInfo); // 로그인 처리

                let message = ''; // 메시지 변수 초기화
                switch (data.status) { // 상태에 따른 메시지 설정
                    case 4091:
                        message = '로그인 성공';
                        break;
                    case 4092:
                        message = '회원이 존재하지 않음';
                        break;
                    case 4093:
                        message = '비밀번호 틀림';
                        break;
                    default:
                        message = '알 수 없는 오류 발생!';
                        break;
                }

                return res.status(200).json({ // 성공적인 응답 반환
                    message,
                    ...data,
                });
            } catch (err) { // 에러 처리
                return res.status(500).json({
                    message: err.message, // 에러 메시지 반환
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
                const UserServiceInstance = Container.get(UserService); // UserService 인스턴스 가져오기
                const { userId, score } = req.body; // 요청 본문에서 userId와 score를 추출
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

                return res.status(200).json({ // 성공적인 응답 반환
                    message,
                    ...data,
                });
            } catch (err) { // 에러 처리
                return res.status(500).json({
                    message: err.message, // 에러 메시지 반환
                });
            }
        }
    },

    /**
     * 점수 조회
     */
    {
        path: '/user/getScores', // API 경로
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
                    ...data,
                });
            } catch (err) { // 에러 처리
                return res.status(500).json({
                    message: err.message, // 에러 메시지 반환
                });
            }
        }
    },

    /**
     * 코인 적립
     */
    {
        path: '/user/coin/deposit', // API 경로
        method: 'post', // HTTP 메서드
        middleware: [], // 사용될 미들웨어 (현재는 없음)
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수
            try {
                console.log('[User DepositCoin Controller Enter]'); // 디버깅 메시지
                const UserServiceInstance = Container.get(UserService); // UserService 인스턴스 가져오기
                const { userId, amount } = req.body; // 요청 본문에서 userId와 amount를 추출
                const data = await UserServiceInstance.DepositCoin(userId, amount); // 코인 적립 처리
                
                let message = ''; // 메시지 변수 초기화
                switch (data.status) { // 상태에 따른 메시지 설정
                    case 4091:
                        message = '코인 적립 성공';
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
                    ...data,
                });
            } catch (err) { // 에러 처리
                return res.status(500).json({
                    message: err.message, // 에러 메시지 반환
                });
            }
        }
    },

    /**
     * 코인 사용
     */
    {
        path: '/user/useCoin', // API 경로
        method: 'post', // HTTP 메서드
        middleware: [], // 사용될 미들웨어 (현재는 없음)
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수
            try {
                console.log('[User UseCoin Controller Enter]'); // 디버깅 메시지
                const UserServiceInstance = Container.get(UserService); // UserService 인스턴스 가져오기
                const { userId, coinAmount } = req.body; // 요청 본문에서 userId와 coinAmount를 추출
                const data = await UserServiceInstance.UseCoin(userId, coinAmount); // 코인 사용 처리

                let message = ''; // 메시지 변수 초기화
                switch (data.status) { // 상태에 따른 메시지 설정
                    case 4091:
                        message = '코인 사용 성공';
                        break;
                    case 4092:
                        message = '코인 부족';
                        break;
                    default:
                        message = '알 수 없는 오류 발생!';
                        break;
                }

                return res.status(200).json({ // 성공적인 응답 반환
                    message,
                    ...data,
                });
            } catch (err) { // 에러 처리
                return res.status(500).json({
                    message: err.message, // 에러 메시지 반환
                });
            }
        }
    },

    /**
     * 식물 키우기
     */
    {
        path: '/user/plantlevel', // API 경로
        method: 'post', // HTTP 메서드
        middleware: [], // 사용될 미들웨어 (현재는 없음)
        controller: async (req, res, next) => { // 비동기 컨트롤러 함수
            try {
                console.log('[User PlantLevel Controller Enter]'); // 디버깅 메시지
                const UserServiceInstance = Container.get(UserService); // UserService 인스턴스 가져오기
                const { userId, action } = req.body; // 요청 본문에서 userId와 action을 추출
                const data = await UserServiceInstance.plantlevel(userId, action); // 식물 키우기 처리

                let message = ''; // 메시지 변수 초기화
                switch (data.status) { // 상태에 따른 메시지 설정
                    case 4091:
                        message = '식물 성장 성공';
                        break;
                    case 4092:
                        message = '식물 성장 실패';
                        break;
                    default:
                        message = '알 수 없는 오류 발생!';
                        break;
                }

                return res.status(200).json({ // 성공적인 응답 반환
                    message,
                    ...data,
                });
            } catch (err) { // 에러 처리
                return res.status(500).json({
                    message: err.message, // 에러 메시지 반환
                });
            }
        }
    }
];
