// catchAndSendError - last in middlewares
export class ErrorUtils {
    static catchAndSendError(err, _, res, __) {
        // console.log(err);
        if(err instanceof Error400) res.status(err.status).json({ err: err.message });
        return res.status(500).json({err: "Some error hmm"})
    }
}
