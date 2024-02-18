import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class forum_threads extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                threadId: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                type: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                categoryId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "categories",
                        key: "categoryId",
                    },
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "default rules",
                },
            },
            {
                sequelize,
                tableName: "forum_threads",
                schema: "public",
                timestamps: false,
                indexes: [
                    {
                        name: "forum_threads_pkey",
                        unique: true,
                        fields: [{ name: "threadId" }],
                    },
                ],
            }
        );
    }
}
