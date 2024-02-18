import { Router } from "express";

const routerDefault = new Router();

router.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

router.put("/", (req, res) => {
    res.end("put succescc");
});
router.post("/", (req, res) => {
    res.end("put succescc");
});

export { routerDefault };
