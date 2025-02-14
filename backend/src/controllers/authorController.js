import getAuthorByIdInDb from "../db/database.js";

    async function handleAuthorRequest(req, res) {

    const { authorId } = req.params;

    const author = await getAuthorByIdInDb(Number(authorId));

    if(!author) {
        res.status(404).send("Author not found");
        return;
    }

    res.send(`Author name: ${author.name}`);
}




export { handleAuthorRequest };