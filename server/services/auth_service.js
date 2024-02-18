import {
    UserNotFound,
    UserAlreadyExists,
    InternalServerError,
    InvalidPassword,
    TokenLimitExceeded,
    RefreshTokenExpired,
    Unauthorized,
} from "../utils/errors.js";
import { TokenService } from "./token_service.js";
import bcrypt from "bcrypt";
// import { Op } from "@sequelize/core";
import { refresh_sessions, users } from "../pg_connect.js";
import { sequelize } from "../pg_connect.js";
import { IsolationLevel } from "@sequelize/core";


export class AuthService {
    // rigth now ONLY USER are created - not admins
    // проблема с табами - не будет кросс шеринга - пока так - потом подумаю
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
            fingerprint: fingerprint.hash,
        };
        const accessToken = TokenService.generateAccessJWT(payload);
        const refreshToken = TokenService.generateRefreshJWT(payload);
        // по хорошему чекнуть чтобы фингерпринт разный - но тогда нельзя зарегать одинаковые устройства за 1 ip
        const CheckNumberOfTokensPerUser = await refresh_sessions.count({
            where: {
                userId: payload.id,
            },
        });
        if (CheckNumberOfTokensPerUser >= 3) throw new TokenLimitExceeded();

        const endDate = new Date();
        endDate.setSeconds(endDate.getSeconds() + process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS);

        let RefreshTokenInsertResult;
        await sequelize.transaction(async (T_SaveRefresh) => {
            RefreshTokenInsertResult = await refresh_sessions.create(
                {
                    userId: UserFindByEmailResult.dataValues.id,
                    refreshToken,
                    expireTime: endDate.toISOString(),
                    fingerprint: fingerprint.hash,
                    isRevoked: false,
                },
                { transaction: T_SaveRefresh }
            );
            // transaction will rollback on error throw
        });

        if (RefreshTokenInsertResult === null) throw new InternalServerError();
        return { accessToken, refreshToken, accessTokenExpiration: endDate.toISOString() };
    }

    static async signUp({ email, password, nickname, role, fingerprint }) {
        let findOneUserRequest;
        await sequelize.transaction({ isolationLevel: IsolationLevel.READ_COMMITTED }, async () => {
            findOneUserRequest = await users.findOne({
                where: {
                    email,
                },
            });
        });

        if (findOneUserRequest != null) throw new UserAlreadyExists();

        const hashed = bcrypt.hashSync(password, 10);
        // возможно стоит перекидывать кастомные ошибки вместо
        let tr_result = {};
        // лучше в одной разбить на 2 nested - но пока так
        await sequelize.transaction({ isolationLevel: IsolationLevel.SERIALIZABLE }, async () => {
            let CreateUserResult = await users.create({
                nickname,
                email,
                hashed,
                role,
            });
            CreateUserResult = CreateUserResult.dataValues;
            const id = CreateUserResult.id;

            const payload = { email, role, id, fingerprint: fingerprint.hash };
            console.log(payload);
            const accessToken = TokenService.generateAccessJWT(payload);
            const refreshToken = TokenService.generateRefreshJWT(payload);

            const endDate = new Date();
            endDate.setSeconds(endDate.getSeconds() + process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS);

            const RefreshTokenInsertResult = await refresh_sessions.create({
                userId: id,
                refreshToken,
                expireTime: endDate.toISOString(),
                fingerprint: fingerprint.hash,
                isRevoked: false,
            });
            tr_result = { accessToken, refreshToken, accessTokenExpiration: endDate.toISOString() };
        });

        return tr_result;
    }

    static async logout(refreshToken) {
        await sequelize.transaction(async () => {
            await refresh_sessions.destroy({
                where: {
                    refresh_token: refreshToken,
                },
            });
        });
    }

    static async refresh({ fingerprint, currentRefreshToken }) {
        if (!currentRefreshToken) throw new Unauthorized();

        let verifyResult;
        if ((verifyResult = await TokenService.verifyRefreshToken())) throw new Unauthorized();
        // ПОСМОТРЕТЬ ФИНГЕРПРИНТ С РАЗНЫХ ВКЛАДОК БРАУЗЕРА

        let RefreshTokenFindOneResult;
        await sequelize.transaction({ isolationLevel: IsolationLevel.READ_COMMITTED }, async () => {
            RefreshTokenFindOneResult = await refresh_sessions.findOne({
                where: { refreshToken: currentRefreshToken },
            });
        });

        if (RefreshTokenFindOneResult === null) throw new Unauthorized();

        const { userId, expireTime, fingerPrint, isRevoked } = RefreshTokenFindOneResult;
        if (isRevoked === true) {
            // reset all - as there shouldn't be 2 RT's request for reset
            await sequelize.transaction({ isolationLevel: IsolationLevel.READ_COMMITTED }, async () => {
                await refresh_sessions.destroy({
                    where: { userId },
                });
            });
            throw new AlreadyRevoked();
        }
        // если время вышло - надо бы кинуть ошибку и редирект на основную/логин страницу
        // could be just expireTime < Date.now()
        if (new Date(expireTime) < new Date(Date.now())) {
            await sequelize.transaction({ isolationLevel: IsolationLevel.READ_COMMITTED }, async () => {
                await refresh_sessions.update(
                    { isRevoked: true },
                    {
                        where: { refreshToken: currentRefreshToken },
                    }
                );
            });
            throw new RefreshTokenExpired();
        }
        let GetUserDataById;
        await sequelize.transaction({ isolationLevel: IsolationLevel.READ_COMMITTED }, async () => {
            GetUserDataById = await users.findOne({
                where: {
                    id: verifyResult.id,
                },
            });
        });
        const payload = {
            email: GetUserDataById.email,
            role: GetUserDataById.role,
            id: GetUserDataById.id,
            fingerprint: GetUserDataById.fingerprint,
        };

        const accessToken = TokenService.generateAccessJWT(payload);
        const refreshToken = TokenService.generateRefreshJWT(payload);

        const endDate = new Date();
        endDate.setSeconds(endDate.getSeconds() + process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS);

        const RefreshTokenInsertResult = await refresh_sessions.create({
            userId: id,
            refreshToken,
            expireTime: endDate.toISOString(),
            fingerprint: fingerprint.hash,
            isRevoked: false,
        });
        return { accessToken, refreshToken, accessTokenExpiration: endDate.toISOString()};

    }

    // static async reset(refreshToken) {
    //     // delete only all refresh tokens for user with bound id
    //     await pool.query(
    //         "delete from refresh_sessions where user_id in (select user_id from refresh_sessions where refresh_token = $1)",
    //         [refreshToken]
    //     );
    // }
}
