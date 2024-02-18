// import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { accessToken_OPTIONS, refreshToken_OPTIONS } from "../options/JWT_options.js";

// default jwt methods are SYNC - so probably this should be redone
export class TokenService {
    static generateAccessJWT(payload) {
        return jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, accessToken_OPTIONS);
    }
    static generateRefreshJWT(payload) {
        return jwt.sign(payload, process.env.REFRESH_SECRET_TOKEN, refreshToken_OPTIONS);
    }

    static verifyAccessToken(accessToken) {
        try {
            jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN);
            return true;
        } catch (err) {
            console.log(`error verifying access token ${err}`);
            return false;
        }
    }

    static async verifyRefreshToken(refreshToken) {
        try {
            jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN);
            return true;
        } catch (err) {
            console.log(`error verifying refresh token ${err}`);
            return false;
        }
    }

    // static async checkAccess(req, _, next) {
    //     const authHeader = req.headers.authorization;
    //     // Authorization: Bearer <token>
    //     const token = authHeader?.split(" ")?.[1];

    //     if (!token) {
    //         return new 
    //     }
    // }
}
