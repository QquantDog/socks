const COOKIE_SETTINGS = {
    REFRESH_TOKEN_OPTIONS: {
        httpOnly: true,
        maxAge: process.env.REFRESH_TOKEN_EXPIRES || 12e4,
    },
};

export {COOKIE_SETTINGS}