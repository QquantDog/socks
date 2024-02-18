// import pkg from "pg";
// const { Pool } = pkg;

// const pool = new Pool({
//     user: "kekich",
//     password: "",
//     host: "localhost",
//     port: 5432, // default Postgres port
//     database: "userbase",
// });

// export default pool;
import { Sequelize } from "sequelize";
import initModels from "./models/init-models.js";

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
});

export async function connectToDB() {
    try {
        await sequelize.authenticate();
    } catch (e) {
        console.log("DB/ROM error: ", e);
        process.exit(1);
    }
}

export const { refresh_sessions, test, users } = initModels(sequelize);
