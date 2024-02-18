// import pool from "../pg_connect.js";
import { Router } from "express";
import { AuthValidator } from "../validators/auth.js";
import { AuthController } from "../controllers/AuthController.js";

const authRouter = new Router();

// ALSO ADD ROLE 
authRouter.post("/sign-in", AuthValidator.signIn, AuthController.signIn);
// сделать адекватную проверку регистрации
authRouter.post("/sign-up", AuthValidator.signUp, AuthController.signUp);

authRouter.post("/logout", AuthValidator.logout, AuthController.logout);
// authRouter.get("/restricted-admin/users", async (req, res) => {
//     const query = await pool.query("select * from users");
//     const result = query.rows;
//     console.log("get at /users worked");
//     console.log(result);
//     res.json(result);
// });

export { authRouter };
