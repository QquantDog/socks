import * as yup from "yup";

// можно больше не перехватывать здесь а передавать некстом или возвращать прямо отсюда
async function validateRequest(req, res, next, schema) {
    try {
        if (schema) {
            await schema.validate(req);
        }
        return next();
    } catch (err) {
        console.log(err);
        res.status(403).json(err);
    }
}

// probably should be more loose
const roles = ["admin", "moder", "user"];

export const signUpSchema = yup.object({
    body: yup.object({
        nickname: yup.string().required("Name is required").min(3, "Minimal chars: 3").max(50, "Maximal chars: 50"),
        password: yup.string().required("Name is required").min(3, "Minimal chars: 3").max(50, "Maximal chars: 50"),
        email: yup.string().required().email(),
        role: yup.string().required().oneOf(roles, "Invalid role"),
    }),
});

export const signInSchema = yup.object({
    body: yup.object({
        email: yup.string().required().email(),
        password: yup.string().required("Name is required").min(3, "Minimal chars: 3").max(50, "Maximal chars: 50"),
    }),
});

export const logoutSchema = yup.object({
    cookie: yup.object({
        refreshToken: yup.string().required(),
    }),
});

class AuthValidator {
    static async signIn(req, res, next) {
        return validateRequest(req, res, next, signInSchema);
    }
    static async signUp(req, res, next) {
        return validateRequest(req, res, next, signUpSchema);
    }
    static async logout(req, res, next) {
        return validateRequest(req, res, next, logoutSchema);
    }
    static async refresh(req, res, next) {
        return validateRequest(req, res, next);
    }
}

export { AuthValidator };
