import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class categories extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                categoryId: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                type: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "-",
                },
            },
            {
                sequelize,
                tableName: "categories",
                schema: "public",
                timestamps: false,
                indexes: [
                    {
                        name: "categories_pkey",
                        unique: true,
                        fields: [{ name: "categoryId" }],
                    },
                ],
            }
        );
    }
}
