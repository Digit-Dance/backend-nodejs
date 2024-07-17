/* sequelize에서 테이블 정의 */
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define(
        'user', // 테이블 이름과 동일하게 설정
        /* DB 속성 정의 */
        {
            num: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true, 
            },
            id: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: '',
            },
            pw: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: '',
            },
            age: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment:'',
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: '',
            },
            coin: {
                type: DataTypes.STRING(255),
                allowNull:false,
                comment:'',
            },
            plantLevel: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: '',
            },
            experience: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment:'',
            }
            

        },
        /* 부가 설정 */
        {
            tableName: 'user',      // DB에 저장될 테이블 이름
            freezeTableName: false,
            underscored: false,
            timestamps: false,      // createdAt, updatedAt 자동 설정
        }
    );

    /* 관계 설정 */

    user.associate = models => {
        user.hasMany(models.score, { 
            foreignKey: 'user_id',
            sourceKey:'num'
        });
    };

    return user;
};
