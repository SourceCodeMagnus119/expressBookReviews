const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async(req, res) => {
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  res
  .status(200)
  .send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res
        .status(200)
        .json(book);
    } else {
        res
        .status(404)
        .json({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    if (filteredBooks.length > 0) {
        res
        .status(200)
        .json(filteredBooks);
    } else {
        res
        .status(404)
        .json({ message: "No books found for the given author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    if (filteredBooks.length > 0) {
        res
        .status(200)
        .json(filteredBooks);
    } else {
        res
        .status(404)
        .json({ message: "No books found for the given title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
        res
        .status(200)
        .json(book.reviews);
    } else {
        res
        .status(404)
        .json({ message: "No reviews found for the given ISBN" });
    }
});

module.exports.general = public_users;