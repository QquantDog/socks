import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class test extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "test",
                schema: "public",
                timestamps: false,
                indexes: [
                    {
                        name: "test_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
