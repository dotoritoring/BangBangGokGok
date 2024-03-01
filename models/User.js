// 유저 관련 모델
const User = (Sequelize, DataTypes) => {
    return Sequelize.define(
        "User",
        {
            u_seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            id: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            pw: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(36),
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING(36),
            },
        },
        {
            tableName: "user",
            freezeTableName: true,
            timestamps: false,
        }
    );
};

module.exports = User;
