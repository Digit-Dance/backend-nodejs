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
        status: 4095,  // 기본 상태 코드
        data: null,    // 반환할 데이터 초기화
      };

      // 사용자 입력 정보 파싱 및 정리
      const { id, pw, age, name } = userInfo;
      const ageInt = parseInt(age, 10);
      const cleanId = id.trim().replace(/\u200B/g, '');
      const cleanPw = pw.trim().replace(/\u200B/g, '');
      const cleanName = name.trim().replace(/\u200B/g, '');

      // 입력된 정보의 유효성 검사
      if (!cleanId || cleanId === '' || !cleanPw || cleanPw === '' || !cleanName || cleanName === '' || !ageInt) {
        returnData.status = 4092;  // 유효하지 않은 입력
        return returnData;
      }

      // 이미 존재하는 사용자 검사
      const testUser = await models.user.findOne({
        where: { id: cleanId },
      });

      if (!testUser) {
        // 새로운 사용자 생성
        const user = await models.user.create({
          id: cleanId,
          pw: cleanPw,
          age: ageInt,
          name: cleanName,
          coin: 0,
          plantLevel: 0,
        });

        // 초기 점수 생성
        await models.score.create({
          user_id: user.num,
          score: '0',
          date: new Date(),
        });

        returnData.status = 4091;  // 성공
        returnData.data = user;    // 생성된 사용자 반환
        return returnData;
      }

      // 이미 존재하는 사용자
      returnData.status = 4094;
      return returnData;
    } catch (err) {
      console.log('[User] SignUp Service Error!' + err);
      throw err;
    }
  }

  /**
   * 로그인
   */
  async SignIn(userInfo) {
    try {
      const returnData = {
        status: 4095,  // 기본 상태 코드
        data: null,    // 반환할 데이터 초기화
      };

      const { id, pw } = userInfo;

      // 사용자 조회
      const user = await models.user.findOne({
        where: { id },
      });

      if (!user) {
        // 사용자를 찾을 수 없음
        returnData.status = 4092;
        return returnData;
      }

      if (user.pw != pw) {
        // 비밀번호 불일치
        returnData.status = 4093;
        return returnData;
      }

      // 로그인 성공
      returnData.status = 4091;
      returnData.data = user;
      return returnData;
    } catch (err) {
      console.log('[User] SignIn Service Error!' + err);
      throw err;
    }
  }

  /**
   * 점수 기록
   */
  async RecordScore(userId, score) {
    try {
      const returnData = {
        status: 4095,  // 기본 상태 코드
        data: null,    // 반환할 데이터 초기화
      };

      // 사용자 조회
      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        // 사용자를 찾을 수 없음
        returnData.status = 4092;
        return returnData;
      }

      // 새로운 점수 기록 생성
      await models.score.create({
        user_id: user.num,
        score: String(score),
        date: new Date(),
      });

      // 모든 점수 조회
      const allScores = await models.score.findAll({
        where: { user_id: user.num },
        order: [['date', 'DESC']],
      });

      const topScores = allScores.slice(0, 3);  // 상위 3개의 점수 선택
      const mostRecentScore = topScores[0];    // 가장 최근 점수

      // 반환 데이터 설정
      returnData.status = 4091;
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
      console.error('[User] RecordScore Service Error:', err.message);
      throw err;
    }
  }

  /**
   * 코인 적립
   */
  async DepositCoin(userId, amount) {
    try {
      const returnData = {
        status: 4095,  // 기본 상태 코드
        data: null,    // 반환할 데이터 초기화
      };

      // 사용자 조회
      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        // 사용자를 찾을 수 없음
        returnData.status = 4092;
        return returnData;
      }

      // 코인 적립
      user.coin += amount;
      await user.save();

      // 반환 데이터 설정
      returnData.status = 4091;
      returnData.data = {
        userId: user.id,
        coins: user.coin,
      };

      return returnData;
    } catch (error) {
      console.error('[User] DepositCoin Service Error:', error.message);
      return { status: 4093, message: error.message };
    }
  }

  /**
   * 코인 사용
   */
  async UseCoin(userId, coinAmount) {
    try {
      const returnData = {
        status: 4095,  // 기본 상태 코드
        data: null,    // 반환할 데이터 초기화
      };

      // 사용자 조회
      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        // 사용자를 찾을 수 없음
        returnData.status = 4092;
        return returnData;
      }

      if (user.coin < coinAmount) {
        // 코인이 부족함
        returnData.status = 4092;
        return returnData;
      }

      // 코인 사용
      user.coin -= coinAmount;
      await user.save();

      // 반환 데이터 설정
      returnData.status = 4091;
      returnData.data = {
        userId: user.id,
        coins: user.coin,
      };

      return returnData;
    } catch (error) {
      console.error('[User] UseCoin Service Error:', error.message);
      return { status: 4093, message: error.message };
    }
  }

  /**
   * 식물 키우기
   */
  async plantlevel(userId, action) {
    try {
      const returnData = {
        status: 4095,  // 기본 상태 코드
        data: null,    // 반환할 데이터 초기화
      };

      // 사용자 조회
      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        // 사용자를 찾을 수 없음
        returnData.status = 4092;
        return returnData;
      }

      if (action === 'water') {
        // 물 주기: 식물 레벨 1 증가
        user.plantLevel += 1;
      } else if (action === 'fertilize') {
        // 비료 주기: 식물 레벨 2 증가
        user.plantLevel += 2;
      } else {
        // 유효하지 않은 액션
        return {
          status: 4092,
          message: 'Invalid action',
        };
      }

      await user.save();

      // 반환 데이터 설정
      returnData.status = 4091;
      returnData.data = {
        userId: user.id,
        plantLevel: user.plantLevel,
      };

      return returnData;
    } catch (error) {
      console.error('[User] PlantLevel Service Error:', error.message);
      return { status: 4093, message: error.message };
    }
  }

  /**
   * Cognition Score 가져오기(최신순)
   */
  async GetScores(userId) {
    try {
      const returnData = {
        status: 4095,  // 기본 상태 코드
        data: null,    // 반환할 데이터 초기화
      };

      // 사용자 조회
      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        // 사용자를 찾을 수 없음
        returnData.status = 4092;
        return returnData;
      }

      // 최신 점수 4개 조회
      const topScores = await models.score.findAll({
        where: { user_id: user.num },
        order: [['date', 'DESC']],
        limit: 4,
      });

      // 반환 데이터 설정
      returnData.status = 4091;
      returnData.data = {
        topScores: topScores.map(score => ({
          score: score.score,
          date: score.date,
        })),
      };

      return returnData;
    } catch (err) {
      console.error('[User] GetScores Service Error:', err.message);
      throw err;
    }
  }
}
