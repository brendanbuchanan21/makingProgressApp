
import { Router } from "express";

const bookRouter = Router();

bookRouter.get('/', (req, res) => res.send("All books"));

bookRouter.get('/:bookId', (req, res) => {
    const { bookId } = req.params;
    res.send(`Book Id: ${bookId}`);
});

export default bookRouter;