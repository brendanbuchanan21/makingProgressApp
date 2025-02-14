

import { Router } from "express";
import { handleAuthorRequest } from "../controllers/authorController.js";

const authorRouter = Router();


authorRouter.get("/all", (req, res) => {
    res.send("ALl authors here!");
});

authorRouter.get("/:name", (req, res) => {
    res.render("author", {person: req.params.name});
})


authorRouter.get("/:authorId", handleAuthorRequest);


export default authorRouter;