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
        status: 4095,
        data: null,
      };

      const { id, pw, age, name } = userInfo;
      const ageInt = parseInt(age, 10);
      const cleanId = id.trim().replace(/\u200B/g, '');
      const cleanPw = pw.trim().replace(/\u200B/g, '');
      const cleanName = name.trim().replace(/\u200B/g, '');

      if (!cleanId || cleanId === '' || !cleanPw || cleanPw === '' || !cleanName || cleanName === '' || !ageInt) {
        returnData.status = 4092;
        return returnData;
      }

      const testUser = await models.user.findOne({
        where: { id: cleanId },
      });

      if (!testUser) {
        const user = await models.user.create({
          id: cleanId,
          pw: cleanPw,
          age: ageInt.toString(), // age를 문자열로 변환
          name: cleanName,
          coin: '0', // 문자열로 초기화
          plantLevel: '0', // 문자열로 초기화
        });

        await models.score.create({
          user_id: user.num,
          score: '0',
          date: new Date(),
        });

        returnData.status = 4091;
        returnData.data = user;
        return returnData;
      }

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
        status: 4095,
        data: null,
      };

      const { id, pw } = userInfo;

      const user = await models.user.findOne({
        where: { id },
      });

      if (!user) {
        returnData.status = 4092;
        return returnData;
      }

      if (user.pw != pw) {
        returnData.status = 4093;
        return returnData;
      }

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
        status: 4095,
        data: null,
      };

      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        returnData.status = 4092;
        return returnData;
      }

      await models.score.create({
        user_id: user.num,
        score: String(score), // 문자열로 변환
        date: new Date(),
      });

      const allScores = await models.score.findAll({
        where: { user_id: user.num },
        order: [['date', 'DESC']],
      });

      const topScores = allScores.slice(0, 3);
      const mostRecentScore = topScores[0];

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
        status: 4095,
        data: null,
      };

      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        returnData.status = 4092;
        return returnData;
      }

      const currentCoin = parseInt(user.coin, 10);
      const newCoin = currentCoin + parseInt(amount, 10);
      user.coin = newCoin.toString(); // 문자열로 저장
      await user.save();

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
        status: 4095,
        data: null,
      };

      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        returnData.status = 4092;
        return returnData;
      }

      const currentCoin = parseInt(user.coin, 10);
      if (currentCoin < parseInt(coinAmount, 10)) {
        returnData.status = 4092;
        return returnData;
      }

      const newCoin = currentCoin - parseInt(coinAmount, 10);
      user.coin = newCoin.toString(); // 문자열로 저장
      await user.save();

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
        status: 4095,
        data: null,
      };

      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        returnData.status = 4092;
        return returnData;
      }

      let newPlantLevel = parseInt(user.plantLevel, 10);

      if (action === 'water') {
        newPlantLevel += 1;
      } else if (action === 'fertilize') {
        newPlantLevel += 2;
      } else {
        return {
          status: 4092,
          message: 'Invalid action',
        };
      }

      user.plantLevel = newPlantLevel.toString(); // 문자열로 저장
      await user.save();

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
        status: 4095,
        data: null,
      };

      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        returnData.status = 4092;
        return returnData;
      }

      const topScores = await models.score.findAll({
        where: { user_id: user.num },
        order: [['date', 'DESC']],
        limit: 4,
      });

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
