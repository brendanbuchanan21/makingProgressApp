

const authors = [
    { id: 1, name: "Brendan"},
    { id: 2, name: "Jhanati"},
    { id: 3, name: "jack"},
];

async function getAuthorByIdInDb(authorId) {

    return authors.find((author) => author.id === authorId)
}

export default getAuthorByIdInDb;

