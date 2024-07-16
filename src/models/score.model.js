const { DATE } = require("sequelize");

/* sequelize에서 테이블 정의 */
module.exports = (sequelize, DataTypes) => {

    const score = sequelize.define(
        'score',
        {
            date: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: '',
            },
            score: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: '',
            }
        },

        {
            tableName: 'score',         // DB에 저장될 테이블 이름
            freezeTableName: false,
            underscored: false,
            timestamps: false,          // createdAt, updatedAt 자동 설정
        }
    );

    /* 관계 설정 */
    score.associate = models => {
        score.belongsTo(models.user, { 
            foreignKey: 'user_id',      // user_id 필드 자동으로 생성됨
            targetKey: 'num'             //'user' 테이블 id 필드
        }); //1:N 관계
    };

    return score ;
};
