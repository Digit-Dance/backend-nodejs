import { Service, Inject } from "typedi"; // typedi 라이브러리에서 Service와 Inject를 임포트한다.
import models from "../../models"; // '../../models' 경로에서 models를 임포트한다.

export default class UserService {
  // UserService 클래스를 정의하고 기본적으로 export한다.
  constructor() {} // 빈 생성자를 정의한다.

  /**
   * 회원가입
   */
  async SignUp(userInfo) {
    // SignUp 메소드를 비동기로 정의하고 userInfo 매개변수를 받는다.
    try {
      // 에러 처리를 위한 try 블록을 시작한다.
      const returnData = {
        // 반환할 데이터 객체를 초기화한다.
        status: 4095, // 기본 상태 코드를 4095로 설정한다.
        data: null, // data 속성을 null로 초기화한다.
      };

      // 구조 분해 할당을 이용하여 원하는 변수만 추출하여 사용할 수 있다.
      const { id, pw, age, name } = userInfo; // userInfo 객체에서 id, pw, age를 추출한다.

      // age를 int형으로 변환한다.
      const ageInt = parseInt(age, 10);
      const cleanId = id.trim().replace(/\u200B/g, ""); // 아이디 입력값 정리
      // 프론트에서 값이 제대로 넘어오지 않을 수 있기 때문에 이에 관한에러 처리를 해준다.

      // id 검사
      if (!cleanId || cleanId === "") {
        // id가 없는 경우
        // 임의의 값을 정하여 에러 결과를 반환한다.
        returnData.status = 4092; // 입력값 오류 상태 코드.
        return returnData; // returnData 객체를 반환한다.
      }

      // pw 검사
      const cleanPw = pw.trim().replace(/\u200B/g, ""); // 비밀번호 입력값 정리
      if (!cleanPw || cleanPw === "") {
        // pw가 없는 경우
        returnData.status = 4093; // 상태 코드를 4093으로  설정한다.
        return returnData; // returnData 객체를 반환한다.
      }
      // name 검사
      const cleanName = name.trim().replace(/\u200B/g, ""); // 이름 입력값 정리
      if (!cleanName || cleanName === "") {
        // name이 없는 경우
        returnData.status = 4096; // 상태 코드를 4094로 설정한다.
        return returnData; // returnData 객체를 반환한다.
      }

      if (!ageInt) {
        // age가 없는 경우
        returnData.status = 4095; // 상태 코드를 4094로 설정한다.
        return returnData; // returnData 객체를 반환한다.
      }

      // 기존 사용자 확인
      const testUser = await models.user.findOne({
        // id로 사용자 찾기
        where: {
          // 키 값과 변수 명이 같으므로 아래와 같이 콜론 없이도 사용할 수 있다.
          // id
          id: cleanId, // id를 조건으로 설정한다.
        },
      });

      if (!testUser) {
        // 새로운 사용자 생성
        const user = await models.user.create({
          id: cleanId,
          pw: cleanPw,
          age: ageInt.toString(), // 나이를 문자열로 변환
          name: cleanName,
          coin: "0", // 코인을 문자열로 초기화
          plantLevel: "0", // 식물 레벨을 문자열로 초기화
          experience: "0",
          depositCoin: 0
        });

        returnData.status = 4091; // 상태 코드를 4091로 설정한다.
        returnData.data = user; // 생성된 사용자 데이터를 설정한다.
        return returnData; // returnData 객체를 반환한다.
      }

      returnData.status = 4094; // 사용자가 이미 존재하는 경우 상태 코드를 4094로 설정한다.
      return returnData; // returnData 객체를 반환한다.
    } catch (err) {
      // 에러가 발생한 경우
      // 콘솔 메시지를 이용하여 개발자에게 어디에서 오류가 났는지 알려준다
      console.log("[User] SignUp Service Error!" + err); // 에러 메시지를 콘솔에 출력한다.
      throw err; // 에러를 다시 던진다.
    }
  }

  /**
   * 로그인
   */
  async SignIn(userInfo) {
    // SignIn 메소드를 비동기로 정의하고 userInfo 매개변수를 받는다.
    try {
      // 에러 처리를 위한 try 블록을 시작한다.
      const returnData = {
        // 반환할 데이터 객체를 초기화한다.
        status: 4095, // 기본 상태 코드를 4095로 설정한다.
        data: null, // data 속성을 null로 초기화한다.
      };

      const { id, pw } = userInfo; // userInfo 객체에서 id와 pw를 추출한다.

      // id로 사용자 정보 확인
      const user = await models.user.findOne({
        where: {
          // 변수 명과 키 값이 같기 때문에 id: id을 아래와 같이 간단하게 작성 가능하다.
          id, // id을 조건으로 설정한다.
        },
      });

      if (!user) {
        // 사용자가 없는 경우
        returnData.status = 4092; // 사용자 없음 상태 코드
        return returnData; // returnData 객체를 반환한다.
      }
      // console.log(user.pw + " : " + pw); // 비밀번호 확인을 위한 디버깅 로그

      const cleanPw = pw.trim().replace(/\u200B/g, ""); // 비밀번호 입력값 정리한 뒤 cleanPw에 저장하고 비교한다.
      if (user.pw != cleanPw) {
        // 비밀번호가 일치하지 않는 경우
        returnData.status = 4093; // 비밀번호 불일치 상태 코드
        // console.log("not pw");
        return returnData; // returnData 객체를 반환한다.
      }

      returnData.status = 4091; // 성공 상태 코드.
      returnData.data = {
        id: user.id,
        age: user.age,
        coin: user.coin,
        plantLevel: user.plantLevel,
        experience: user.experience,
      }; // 사용자 데이터를 설정한다.

      return returnData; // returnData 객체를 반환한다.
    } catch (err) {
      // 에러가 발생한 경우
      console.log("[User] SignIn Service Error!" + err); // 에러 메시지를 콘솔에 출력한다.
      throw err; // 에러를 다시 던진다.
    }
  }

  /**
   * Cognition 점수기록
   */
  async RecordScore(userId, score) {
    try {
      const returnData = {
        status: 4095, // 기본 상태 코드
        data: null,
      };

      // 사용자 정보 확인
      const user = await models.user.findOne({
        where: {
          id: userId,
        },
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
      // Fetch all scores for the user, sorted by date DESC to get the latest scores first
      const allScores = await models.score.findAll({
        where: { user_id: user.num },
        order: [["date", "DESC"]],
      });

      // Limit to top 3 latest scores
      const topScores = allScores.slice(0, 3);

      // The most recent score is simply the first in the sorted list
      const mostRecentScore = topScores[0];

      returnData.status = 4091; // 성공 상태 코드
      returnData.data = {
        topScores: topScores.map((score) => ({
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
      console.error("[User] RecordScore Service Error:", err.message);
      throw err;
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
        where: {
          id: userId,
        },
      });

      if (!user) {
        returnData.status = 4092; // 사용자 없음 상태 코드
        return returnData;
      }

      // 상위 4개의 점수 가져오기
      // Fetch top 4 scores for the user, sorted by date DESC to get the latest scores first
      const topScores = await models.score.findAll({
        where: { user_id: user.num },
        order: [["date", "DESC"]],
        limit: 4,
      });

      returnData.status = 4091; // 성공 상태 코드
      returnData.data = {
        topScores: topScores.map((score) => ({
          score: score.score,
          date: score.date,
        })),
      };

      return returnData;
    } catch (err) {
      console.error("[User] GetScores Service Error:", err.message);
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
      console.log(
        `[User] DepositCoin called with userId: ${userId}, amount: ${amount}`
      );

      // 사용자 정보 확인
      const user = await models.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        returnData.status = 4092; // 사용자 없음 상태 코드
        returnData.message = "User not found";
        return returnData;
      }

      // amount 값 검증 및 디버깅 로그 추가
      if (amount == null || isNaN(amount)) {
        console.error(
          "[User] DepositCoin Error: Amount is null or not a number"
        );
        returnData.status = 4092; // 잘못된 입력 상태 코드
        returnData.message = "Amount cannot be null or non-numeric";
        return returnData;
      }

      const amountInt = parseInt(amount, 10); // amount 값을 정수로 변환
      const currentCoin = parseInt(user.coin, 10); // 현재 코인을 정수로 변환
      const newCoin = currentCoin + amountInt; // 새로운 코인 값 계산
      const depositCoin = currentCoin + amountInt; //랭킹을 위한 코인 적립
      user.depositCoin = depositCoin; //랭킹을 위한 코인 적립
      user.coin = newCoin.toString(); // 코인을 문자열로 저장
      await user.save();

      returnData.status = 4091; // 성공 상태 코드
      returnData.data = {
        userId: user.id,
        coins: user.coin,
        amount: amountInt,
      };

      return returnData;
    } catch (error) {
      console.error("[User] DepositCoin Service Error:", error.message); // 에러 로그 출력
      return { status: 4093, message: error.message }; // 에러 상태 코드 반환
    }
  }

  /**
   * 랭킹 조회
   */
  async Rank(userId, depositCoin) {
    try {
      const returnData = {
        status:4095,
        data: null,
      }
      
      if(!user){
        returnData.status = 4092;
        return returnData;
      }

      const topRank = await models.user.findAll({
        order:[["rank","DESC"]],
        limit: 3,
      });
      return topRank;
    } catch(err) {
      console.error("[User] RecordRank Service Error:", err.message);
      throw err;
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
      console.error("[User] UseCoin Service Error:", error.message); // 에러 로그 출력
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

      // 현재 식물 레벨 및 경험치를 정수로 변환
      let newPlantLevel = parseInt(user.plantLevel, 10);
      let experience = parseInt(user.experience, 10) || 0;

      // 액션에 따른 경험치 증가
      if (action === "water") {
        experience += 30; // 물주기 액션 시 경험치 20 증가
      } else if (action === "fertilize") {
        experience += 50; // 비료주기 액션 시 경험치 50 증가
      } else {
        return {
          status: 4092,
          message: "Invalid action", // 잘못된 액션 시 오류 반환
        };
      }

      // 경험치가 100 이상이면 레벨 증가
      while (experience >= 100) {
        newPlantLevel += 1;
        experience -= 100; // 경험치를 100만큼 차감
      }

      // 새로운 식물 레벨 및 경험치를 저장
      user.plantLevel = newPlantLevel.toString();
      user.experience = experience.toString();
      await user.save();

      returnData.status = 4091; // 성공 상태 코드
      returnData.data = {
        userId: user.id,
        plantLevel: user.plantLevel,
        experience: user.experience,
      };

      return returnData;
    } catch (error) {
      console.error("[User] PlantLevel Service Error:", error.message); // 에러 로그 출력
      return { status: 4093, message: error.message }; // 에러 상태 코드 반환
    }
  }

  /**
   * Cognition Score 오래된 날짜순으로 12개 가져오기
   */
  async GetScoresOldDate(userId) {
    try {
      const returnData = {
        status: 4095,
        data: null,
      };

      const user = await models.user.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        returnData.status = 4092; // 사용자 없음 상태 코드
        return returnData;
      }

      // 상위 12개의 점수 가져오기
      const topScores = await models.score.findAll({
        where: { user_id: user.num },
        order: [["date", "ASC"]],
        limit: 12,
      });

      returnData.status = 4091; // 성공 상태 코드
      returnData.data = {
        topScores: topScores.map((score) => ({
          score: score.score,
          date: score.date,
        })),
      };

      return returnData;
    } catch (err) {
      console.error("[User] GetScores Service Error:", err.message);
      throw err;
    }
  }
}
