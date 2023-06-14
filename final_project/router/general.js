const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//let users = []

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Get all books, Yet to be implemented"});
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',  (req, res) => {
     const author = req.params.author;

//     let bookISBNs = Object.keys(books)
     let bookDetails = Object.values(books)

//     console.log(bookISBNs);
     console.log(bookDetails);

//     let filteredISBNs = bookISBNs.filter(key => key.length > 1 );
     let filteredBooks = bookDetails.filter(book => book.author === author);

//     console.log("ids",filteredISBNs);
//     console.log("filtered",filteredBooks);

  return res.status(300).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
       let bookDetails2 = Object.values(books)
       console.log(bookDetails2);
       let filteredBooks2 = bookDetails2.filter(book => book.title === title);
  
  return res.status(300).json(filteredBooks2);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = parseInt(req.params.isbn) - 1;
  
  let bookDetails3 = Object.values(books)
  the_review = (bookDetails3[ISBN]);
  console.log(the_review);
  //let filteredBooks3 = bookDetails3.filter(book => book.title === title);
  //res.send(filteredBooks3[isbn]);
  res.send(the_review.reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
