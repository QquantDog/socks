import { Error400 } from "./errors.js";

export class ErrorUtils {
    static catchAndSendError(err, _, res, __) {
        // console.log(err);
        if (err instanceof Error400) res.status(err.status).json({ err: err.message });
        return res.status(500).json({ err: err.message });
    }
}
