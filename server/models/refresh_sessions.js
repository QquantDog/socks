import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class refresh_sessions extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                refreshToken: {
                    type: DataTypes.STRING(400),
                    allowNull: false,
                    unique: "refresh_sessions_refreshToken_key",
                },
                startTime: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
                expireTime: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                fingerprint: {
                    type: DataTypes.STRING(32),
                    allowNull: false,
                },
                isRevoked: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: "refresh_sessions",
                schema: "public",
                timestamps: false,
                indexes: [
                    {
                        name: "refresh_sessions_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                    {
                        name: "refresh_sessions_refreshToken_key",
                        unique: true,
                        fields: [{ name: "refreshToken" }],
                    },
                    {
                        name: "refresh_token_btreeidx",
                        unique: true,
                        fields: [{ name: "refreshToken" }],
                    },
                    {
                        name: "user_id_hashidx",
                        fields: [{ name: "userId" }],
                    },
                ],
            }
        );
    }
}
