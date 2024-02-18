// import Fingerprint from "express-fingerprint";
import { COOKIE_SETTINGS } from "../options/cookie_settings.js";
import { AuthService } from "../services/AuthService.js";

class AuthController {
    static async signIn(req, res, next) {
        const { email, password } = req.body;
        const { fingerprint } = req;
        try {
            const { accessToken, refreshToken, accessTokenExpiration } = await AuthService.signIn({
                email,
                password,
                fingerprint,
            });
            res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN_OPTIONS);
            //
            // await sequelize.transaction
            // { transaction: t });
            //
            // на фронте поменять на accesstokenexpiration
            //
            console.log("BEFORE SUCCESS SIGN IN");
            return res.status(200).json({ accessToken, accessTokenExpiration });
        } catch (err) {
            console.log("CATCH WORKED");
            next(err);
            // ErrorUtils.catchAndSendError(res, err, "Error while signing-up");
        }
    }

    static async signUp(req, res, next) {
        const { email, password, nickname } = req.body;
        // default role set
        let role;
        req.body.role != undefined ? (role = req.body.role) : (role = "user");
        const { fingerprint } = req;

        try {
            const { accessToken, refreshToken, accessTokenExpiration } = await AuthService.signUp({
                nickname,
                email,
                password,
                role,
                fingerprint,
            });
            res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN_OPTIONS);
            return res.status(200).json({ accessToken, accessTokenExpiration });
        } catch (err) {
            next(err);
        }
    }

    // 1. delete refreshToken from base for current fingerprint
    // 2. delete refreshToken from cookie(res.clearCookie)
    // 3. from client - delete access token from memory
    // 4. from client - redirect either to homepage as guest || redirect to signin/signup page as guest
    static async logout(req, res, next) {
        const refreshToken = req.cookies.refreshToken;
        try {
            await AuthService.logout(refreshToken);

            res.clearCookie("refreshToken");
            return res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }
    // refresh tokens are tested against unique_id(user_id) + fingerprint - so different fingerprints give us different devices(in most cases)
    // 1. check if refreshToken present and valid
    // 2. if refreshToken is expired / status = expired(when already token is revoked) - reset(delete) all tokens to user_id
    // !!! anyway all devices would be logged in till accessJWT expires
    // 3. update old token status - expired
    // 4. insert new token with same email, user_id,
    // 5. update cookie - return accessJwt and accessJWT expiration time
    static async refresh(req, res, next) {
        const { fingerprint } = req;
        const currentRefreshToken = req.cookies.refreshToken;

        try {
            const { accessToken, refreshToken, accessTokenExpiration } = AuthService.refresh({
                fingerprint,
                currentRefreshToken,
            });

            res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN_OPTIONS);
            return res.status(200).json({ accessToken, accessTokenExpiration });
        } catch (err) {
            next(err);
        }
    }
}

export { AuthController };
