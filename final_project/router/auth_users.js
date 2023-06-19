const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}



const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records. 'users[]'
      let validusers = users.filter((user)=>{
          return (user.username === username && user.password === password)
      });
      
      if(validusers.length > 0){
          return true;
      } else {
          return false;
      }        
  }



//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60  });
    //console.log(accessToken);
    req.session.authorization = {
      accessToken, username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const myIsbn = parseInt(req.params.isbn);
  const myReview = req.query.review;
  const myUsername = req.session.authorization.username;

  if (!books[myIsbn].reviews) {
    books[myIsbn].reviews = {};
  }

  // Retain the existing reviews while adding a new one
  books[myIsbn].reviews = {
    ...books[myIsbn].reviews,
    [myUsername]: myReview
  };

  req.session.books = books;

  let accessToken = jwt.sign({
    data: myUsername
  }, 'access', { expiresIn: 60*5 });

  req.session.authorization.accessToken = accessToken;

  return res.status(300).send(books);
});


// Delete a book review by using isbn and username on the end point
//   regd_users.delete("/auth/review/:isbn/:username", (req, res) => {
//     const myIsbn = parseInt(req.params.isbn);
//     const myUsername = req.params.username;
  
//     if (books[myIsbn].reviews && books[myIsbn].reviews.hasOwnProperty(myUsername)) {
//       delete books[myIsbn].reviews[myUsername];
//       req.session.books = books;
//       return res.status(200).send("Review deleted successfully.");
//     } else {
//       return res.status(404).send("Review not found.");
//     }
//   });
// }


// Delete a book review by using isbn from parameter and filtering by username
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const myIsbn = parseInt(req.params.isbn);
    const myUsername = req.session.authorization.username;
  
    if (books[myIsbn].reviews && books[myIsbn].reviews.hasOwnProperty(myUsername)) {
      delete books[myIsbn].reviews[myUsername];
      req.session.books = books;
      return res.status(200).send(books);
    } else {
      return res.status(404).send("Review not found or you don't have permission to delete this review.");
    }
  });
//}


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
