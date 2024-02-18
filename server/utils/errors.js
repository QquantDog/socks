// РЕАЛИЗОВАТЬ ОШИБКИ
export class Error400 extends Error{
    constructor(){
        super();
    }
}

export class RefreshTokenExpired extends Error400 {
    constructor() {
        super();
        this.message = "Error: limit of accounts logged in / reached limit of tokens";
        this.status = 410;
    }
}

export class TokenLimitExceeded extends Error400 {
    constructor() {
        super();
        this.message = "Error: limit of accounts logged in / reached limit of tokens";
        this.status = 404;
    }
}

export class UserNotFound extends Error400 {
    constructor() {
        super();
        this.message = "Error: user not found";
        this.status = 422;
    }
}

export class Unauthorized extends Error400 {
    constructor() {
        super();
        this.message = "Error: unauthorized";
        this.status = 403;
    }
}

export class AlreadyRevoked extends Error400 {
    constructor() {
        super();
        this.message = "Error: already revoked";
        this.status = 403;
    }
}

export class UserAlreadyExists extends Error400 {
    constructor() {
        super();
        this.message = "Error: user already exists";
        this.status = 422;
    }
}
export class InvalidPassword extends Error400 {
    constructor() {
        super();
        this.message = "Error: invalid password";
        this.status = 401;
    }
}

// куда то ее надо запихнгуть - не помню куда
export class InternalServerError extends Error {
    constructor() {
        super();
        this.message = "Error: internal server error"
        this.status = 500;
    }
}

