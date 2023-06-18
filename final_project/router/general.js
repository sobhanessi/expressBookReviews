const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ username: username, password: password });
            return res.status(200).json({
                message: "User successfully registred. Now you can login",
            });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

const getAllBooks = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve(books);
        } catch (error) {
            reject(error);
        }
    });
};

const getIsbn = (isbn) => {
    let isbnNum = parseInt(isbn);
    return new Promise((res, rej) => {
        try {
            if (books[isbnNum]) {
                res(books[isbnNum]);
            } else {
                rej({ status: 404, message: "not found" });
            }
        } catch (err) {
            rej(err);
        }
    });
};

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    getAllBooks(books)
        .then((resp) => res.send(resp))
        .catch((err) => res.send(err));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    // if (isbn) {
    //     return res.send(books[isbn]);
    // }
    getIsbn(isbn)
        .then((resp) => res.send(resp))
        .catch((err) => res.send(err));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;
    // let list = [];
    // if (author) {
    //     for (let key in books) {
    //         if (books[key].author === author) {
    //             list.push(books[key]);
    //         }
    //     }
    //     return res.send(list);
    // }
    getAllBooks()
        .then((resp) => Object.values(resp))
        .then((books) => books.filter((book) => book.author === author))
        .then((filtered) => res.send(filtered))
        .catch((err) => res.send(err));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    // let list = [];
    // if (title) {
    //     for (let key in books) {
    //         if (books[key].title === title) {
    //             list.push(books[key]);
    //         }
    //     }
    //     return res.send(list);
    // }
    getAllBooks()
        .then((resp) => Object.values(resp))
        .then((books) => books.filter((book) => book.title === title))
        .then((filtered) => res.send(filtered))
        .catch((err) => res.send(err));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    if (isbn) {
        return res.send(books[isbn].reviews);
    }
});

module.exports.general = public_users;
