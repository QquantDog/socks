import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class topics extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                topicId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                threadId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "forum_threads",
                        key: "threadId",
                    },
                },
                topicStarterId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                lastUserPostId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                lastActivity: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
                messCount: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 1,
                },
            },
            {
                sequelize,
                tableName: "topics",
                schema: "public",
                timestamps: false,
                indexes: [
                    {
                        name: "topics_pkey",
                        unique: true,
                        fields: [{ name: "topicId" }],
                    },
                ],
            }
        );
    }
}
