import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { connectToDB } from "./pg_connect.js";
import Fingerprint from "express-fingerprint";
import { ErrorUtils } from "./utils/error_utils.js";

await connectToDB();

const app = express();
const port = process.env.SERVER_PORT;

// дописать в конце error middleware - с тех пор как сейчас он не работает(остутсвует)
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(
    Fingerprint({
        parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
    })
);
app.use("/", authRouter);
app.use(ErrorUtils.catchAndSendError)

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});

// app.use("/:val", add2);
// app.use("/:val", mult5);
