const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});



// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books,null,4));
// });



// // Get the book list available in the shop 
// // using async-await with Axios.
// public_users.get('/', async (req, res) => {
//   try {
//     const response = await axios.get('http://localhost:5000/books/books');
//     //const response = await axios.get('./booksdb/books');
//     const booksData = response.data;
//     const booksList = Object.values(booksData);    
//     res.json(booksList);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });



// Get the book list available in the shop -> using promise/callbacks 
public_users.get('/', (req, res) => {
  getBooks()
    .then(booksList => res.json(booksList))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

function getBooks() {
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous process
    process.nextTick(() => {
      try {
        const booksList = Object.values(books);
        resolve(booksList);
      } catch (error) {
        reject(error);
      }
    });
  });
}




// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
//   res.send(books[isbn]);
//   //return res.status(300).json({message: "Yet to be implemented"});
// });


// Get book details based on ISBN -> using promise/callbacks 
public_users.get('/isbn/:isbn', (req, res) => {
  const myIsbn = req.params.isbn;
  
  getBookDetails(myIsbn)
    .then(book => {
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

function getBookDetails(key) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      try {
        const book = books[key];
        resolve(book);
      } catch (error) {
        reject(error);
      }
    });
  });
}




// // Get book details based on author
// public_users.get('/author/:author',  (req, res) => {
//     const author = req.params.author;

//      //let bookISBNs = Object.keys(books)
//     let bookDetails = Object.values(books)

//      //console.log(bookISBNs);
//     console.log(bookDetails);

//      //let filteredISBNs = bookISBNs.filter(key => key.length > 1 );
//     let filteredBooks = bookDetails.filter(book => book.author === author);

// //     console.log("ids",filteredISBNs);
// //     console.log("filtered",filteredBooks);
//   return res.status(300).json(filteredBooks);
// });



// Get book details based on author -> using promise/callbacks 
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  getBookDetailsByAuthor(author, (error, book) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred' });
    }

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  });
});

function getBookDetailsByAuthor(author, callback) {
  process.nextTick(() => {
    try {
      const book = Object.values(books).find(book => book.author === author);
      callback(null, book);
    } catch (error) {
      callback(error, null);
    }
  });
}



// // Get all books based on title -> using promise/callbacks 
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//       let bookDetails2 = Object.values(books)
//       console.log(bookDetails2);
//       let filteredBooks2 = bookDetails2.filter(book => book.title === title);
  
//   return res.status(300).json(filteredBooks2);
// });



// Get book details based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  getBookDetailsByTitle(title, (error, book) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred' });
    }

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  });
});

function getBookDetailsByTitle(title, callback) {
  process.nextTick(() => {
    try {
      const book = Object.values(books).find(book => book.title === title);
      callback(null, book);
    } catch (error) {
      callback(error, null);
    }
  });
}



//  Get book review by isbn
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
