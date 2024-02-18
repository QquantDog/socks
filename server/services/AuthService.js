import { UserNotFound, UserAlreadyExists, InternalServerError, InvalidPassword } from "../utils/errors.js";
import { TokenService } from "./token_service.js";
import bcrypt from "bcrypt";
// import { Op } from "@sequelize/core";
import { refresh_sessions, users } from "../pg_connect.js";

export class AuthService {
    // rigth now ONLY USER are created - not admins
    static async signIn({ email, password, fingerprint }) {

        const UserFindByEmailResult = await users.findOne({
            where: {
                email: email,
            },
        });
        if (UserFindByEmailResult == null) throw new UserNotFound();

        const isPasswordValid = await bcrypt.compare(password, UserFindByEmailResult.dataValues.hashed);
        if (!isPasswordValid) throw new InvalidPassword();

        const payload = {
            email: UserFindByEmailResult.dataValues.email,
            role: UserFindByEmailResult.dataValues.role,
            id: UserFindByEmailResult.dataValues.id,
            fingerprint: fingerprint.hash
        };
        const accessToken = TokenService.generateAccessJWT(payload);
        const refreshToken = TokenService.generateRefreshJWT(payload);

        const endDate = new Date();
        console.log("ASSASAS", process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS);
        endDate.setSeconds(endDate.getSeconds() + process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS);
        // console.log("date time", endDate.toISOString());
        console.log("END DATE", endDate.toISOString());
        const RefreshTokenInsertResult = await refresh_sessions.create({
            userId: UserFindByEmailResult.dataValues.id,
            refreshToken,
            expireTime: endDate.toISOString(),
            fingerprint: fingerprint.hash,
            isRevoked: false,
        });
        if (RefreshTokenInsertResult === null) throw new InternalServerError();

        return { accessToken, refreshToken, accessTokenExpiration: endDate.toISOString() };
    }
    //
    //
    // поменять коннект
    //
    //

    // РЕАЛИЗОВАТЬ ЮЗЕР ЛОГИН
    // РЕАЛИЗОВАТЬ КУКИ ПО ГАЙДУ
    static async signUp({ email, password, nickname, role, fingerprint }) {
        const findOneUserRequest = await pool.query("select * from users where email = $1", [email]);
        if (findOneUserRequest.rowCount !== 0) {
            throw new UserAlreadyExists();
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const CreateUserResult = await pool.query(
            "insert into users(nickname, email, hashed, role) values ($1,$2,$3,$4)",
            [nickname, email, hashedPassword, role]
        );

        // probably pack CreateUserResult.rows[0].id
        if (!CreateUserResult.rows[0].id) throw new CreatingUserError();
        const id = CreateUserResult.rows[0].id;

        const payload = { email, role, id };
        const accessToken = TokenService.generateAccessJWT(payload);
        const refreshToken = TokenService.generateRefreshJWT(payload);

        const endDate = new Date();
        endDate.setSeconds(endDate.getSeconds + process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS);
        // тут должны быть проблемы со вставкой времени
        //
        const RefreshTokenInsertResult = await pool.query(
            "insert into refresh_sessions(user_id, refresh_token, expire_time, fingerprint) values($1, $2, $3, $4)",
            [id, refreshToken, Date.toString(), fingerprint]
        );

        return { accessToken, refreshToken, accessTokenExpiration: endDate.toString() };
    }

    static async logout(refreshToken) {
        await pool.query("delete from refresh_sessions where refresh_token = $1", [refreshToken]);
    }

    static async refresh({ fingerprint, currentRefreshToken }) {
        if (!currentRefreshToken) throw new Unauthorized();
        // for the same token who is already expired
        const CheckRefreshTokenValidity = await pool.query("select * from refresh_session where refresh_token = $1", [
            currentRefreshToken,
        ]);
        if (CheckRefreshTokenValidity.rowCount == 0) throw new Unauthorized();
        const { user_id, expire_time, finger_print, isRevoked } = CheckRefreshTokenValidity.rows[0];
        if (isRevoked === true) {
            // reset all
            throw new AlreadyRevoked();
        }
        // if(expire_time)
    }

    static async reset(refreshToken) {
        // delete only all refresh tokens for user with bound id
        await pool.query(
            "delete from refresh_sessions where user_id in (select user_id from refresh_sessions where refresh_token = $1)",
            [refreshToken]
        );
    }
}
