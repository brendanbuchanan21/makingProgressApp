import { Router } from "express";

const practiceRouter = Router();


practiceRouter.get("/html", (req, res) => {
    res.render("practice", { message: "EJS rocks your socks bruh"});
});

export default practiceRouter;
