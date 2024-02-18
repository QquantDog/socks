import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class posts extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                postId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                postDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
                body: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                topicId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: "topics",
                        key: "topicId",
                    },
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                parentId: {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "posts",
                schema: "public",
                timestamps: false,
                indexes: [
                    {
                        name: "posts_pkey",
                        unique: true,
                        fields: [{ name: "postId" }],
                    },
                ],
            }
        );
    }
}
