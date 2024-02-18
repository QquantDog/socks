export const accessToken_OPTIONS = {
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "30s",
};

export const refreshToken_OPTIONS = {
    algorithm: "HS256",
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "120s",
};