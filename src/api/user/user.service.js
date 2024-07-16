import { Service, Inject } from 'typedi';
import models from '../../models';

@Service()
export default class UserService {
  constructor() {}

  /**
   * 회원가입
   */
  async SignUp(userInfo) {
    try {
      const returnData = {
        status: 4095, // 기본 상태 코드
        data: null,
      };

      const { id, pw, age, name } = userInfo;
      const ageInt = parseInt(age, 10); // 나이를 정수로 변환
      const cleanId = id.trim().replace(/\u200B/g, ''); // 아이디 입력값 정리
      const cleanPw = pw.trim().replace(/\u200B/g, ''); // 비밀번호 입력값 정리
      const cleanName = name.trim().replace(/\u200B/g, ''); // 이름 입력값 정리

      // 입력값 유효성 검사
      if (!cleanId || cleanId === '' || !cleanPw || cleanPw === '' || !cleanName || cleanName === '' || !ageInt) {
        returnData.status = 4092; // 입력값 오류 상태 코드
        return returnData;
      }

      // 기존 사용자 확인
      const testUser = await models.user.findOne({
        where: { id: cleanId },
      });

      if (!testUser) {
        // 새로운 사용자 생성
        const user = await models.user.create({
          id: cleanId,
          pw: cleanPw,
          age: ageInt.toString(), // 나이를 문자열로 변환
          name: cleanName,
          coin: '0', // 코인을 문자열로 초기화
          plantLevel: '0', // 식물 레벨을 문자열로 초기화
        });

        // 사용자 점수 초기화
        await models.score.create({
          user_id: user.num,
          score: '0',
          date: new Date(),
        });

        returnData.status = 4091; // 성공 상태 코드
        returnData.data = user;
        return returnData;
      }

      returnData.status = 4094; // 사용자 중복 상태 코드
      return returnData;
    } catch (err) {
      console.log('[User] SignUp Service Error!' + err); // 에러 로그 출력
      throw err;
    }
  }

  /**
   * 로그인
   */
  async SignIn(userInfo) {
    try {
      const returnData = {
        status: 4095, // 기본 상태 코드
        data: null,
      };

      const { id, pw } = userInfo;

      // 사용자 정보 확인
      const user = await models.user.findOne({
        where: { id },
      });

      if (!user) {
        returnData.status = 4092; // 사용자 없음 상태 코드
        return returnData;
      }

      if (user.pw != pw) {
        returnData.status = 4093; // 비밀번호 불일치 상태 코드
        return returnData;
      }

      returnData.status = 4091; // 성공 상태 코드
      returnData.data = user;
      return returnData;
    } catch (err) {
      console.log('[User] SignIn Service Error!' + err); // 에러 로그 출력
      throw err;
    }
  }

  /**
   * 점수 기록
   */
  async RecordScore(userId, score) {
    try {
      const returnData = {
        status: 4095, // 기본 상태 코드
        data: null,
      };

      // 사용자 정보 확인
      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        returnData.status = 4092; // 사용자 없음 상태 코드
        return returnData;
      }

      // 새로운 점수 기록
      await models.score.create({
        user_id: user.num,
        score: String(score), // 점수를 문자열로 변환
        date: new Date(),
      });

      // 모든 점수 가져오기
      const allScores = await models.score.findAll({
        where: { user_id: user.num },
        order: [['date', 'DESC']],
      });

      // 상위 3개의 점수 가져오기
      const topScores = allScores.slice(0, 3);
      const mostRecentScore = topScores[0];

      returnData.status = 4091; // 성공 상태 코드
      returnData.data = {
        topScores: topScores.map(score => ({
          score: score.score,
          date: score.date,
        })),
        mostRecentScore: {
          score: mostRecentScore.score,
          date: mostRecentScore.date,
        },
      };

      return returnData;
    } catch (err) {
      console.error('[User] RecordScore Service Error:', err.message); // 에러 로그 출력
      throw err;
    }
  }

  /**
   * 코인 적립
   */
  async DepositCoin(userId, amount) {
    try {
      const returnData = {
        status: 4095, // 기본 상태 코드
        data: null,
      };

      // 함수 호출 시 전달된 값 로그 출력
      console.log(`[User] DepositCoin called with userId: ${userId}, amount: ${amount}`);

      // 사용자 정보 확인
      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        returnData.status = 4092; // 사용자 없음 상태 코드
        returnData.message = 'User not found';
        return returnData;
      }

      // amount 값 검증 및 디버깅 로그 추가
      if (amount == null || isNaN(amount)) {
        console.error('[User] DepositCoin Error: Amount is null or not a number');
        returnData.status = 4092; // 잘못된 입력 상태 코드
        returnData.message = 'Amount cannot be null or non-numeric';
        return returnData;
      }

      const amountInt = parseInt(amount, 10); // amount 값을 정수로 변환
      const currentCoin = parseInt(user.coin, 10); // 현재 코인을 정수로 변환
      const newCoin = currentCoin + amountInt; // 새로운 코인 값 계산
      user.coin = newCoin.toString(); // 코인을 문자열로 저장
      await user.save();

      returnData.status = 4091; // 성공 상태 코드
      returnData.data = {
        userId: user.id,
        coins: user.coin,
      };

      return returnData;
    } catch (error) {
      console.error('[User] DepositCoin Service Error:', error.message); // 에러 로그 출력
      return { status: 4093, message: error.message }; // 에러 상태 코드 반환
    }
  }



  /**
   * 코인 사용
   */
  async UseCoin(userId, coinAmount) {
    try {
      const returnData = {
        status: 4095, // 기본 상태 코드
        data: null,
      };

      // 사용자 정보 확인
      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        returnData.status = 4092; // 사용자 없음 상태 코드
        return returnData;
      }

      const currentCoin = parseInt(user.coin, 10); // 현재 코인을 정수로 변환
      if (currentCoin < parseInt(coinAmount, 10)) {
        returnData.status = 4092; // 코인 부족 상태 코드
        return returnData;
      }

      const newCoin = currentCoin - parseInt(coinAmount, 10); // 새로운 코인 값 계산
      user.coin = newCoin.toString(); // 코인을 문자열로 저장
      await user.save();

      returnData.status = 4091; // 성공 상태 코드
      returnData.data = {
        userId: user.id,
        coins: user.coin,
      };

      return returnData;
    } catch (error) {
      console.error('[User] UseCoin Service Error:', error.message); // 에러 로그 출력
      return { status: 4093, message: error.message }; // 에러 상태 코드 반환
    }
  }

  /**
   * 식물 키우기
   */
  async plantlevel(userId, action) {
    try {
      const returnData = {
        status: 4095, // 기본 상태 코드
        data: null,
      };

      // 사용자 정보 확인
      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        returnData.status = 4092; // 사용자 없음 상태 코드
        return returnData;
      }

      let newPlantLevel = parseInt(user.plantLevel, 10); // 현재 식물 레벨을 정수로 변환

      if (action === 'water') {
        newPlantLevel += 1; // 물주기 액션 시 레벨 증가
      } else if (action === 'fertilize') {
        newPlantLevel += 2; // 비료주기 액션 시 레벨 더 많이 증가
      } else {
        return {
          status: 4092,
          message: 'Invalid action', // 잘못된 액션 시 오류 반환
        };
      }

      user.plantLevel = newPlantLevel.toString(); // 새로운 식물 레벨을 문자열로 저장
      await user.save();

      returnData.status = 4091; // 성공 상태 코드
      returnData.data = {
        userId: user.id,
        plantLevel: user.plantLevel,
      };

      return returnData;
    } catch (error) {
      console.error('[User] PlantLevel Service Error:', error.message); // 에러 로그 출력
      return { status: 4093, message: error.message }; // 에러 상태 코드 반환
    }
  }

  /**
   * Cognition Score 가져오기(최신순)
   */
  async GetScores(userId) {
    try {
      const returnData = {
        status: 4095, // 기본 상태 코드
        data: null,
      };

      // 사용자 정보 확인
      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        returnData.status = 4092; // 사용자 없음 상태 코드
        return returnData;
      }

      // 상위 4개의 점수 가져오기
      const topScores = await models.score.findAll({
        where: { user_id: user.num },
        order: [['date', 'DESC']],
        limit: 4,
      });

      returnData.status = 4091; // 성공 상태 코드
      returnData.data = {
        topScores: topScores.map(score => ({
          score: score.score,
          date: score.date,
        })),
      };

      return returnData;
    } catch (err) {
      console.error('[User] GetScores Service Error:', err.message); // 에러 로그 출력
      throw err;
    }
  }
}
