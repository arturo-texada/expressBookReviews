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
    
    req.session.authorization = {
      accessToken, username
  }
 
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});
//  return res.status(300).json({message: "Yet to be implemented"});
//});

const reviewerlist = [];
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
// isbn
  const isbn = parseInt(req.params.isbn) - 1;
  console.log(isbn);
// new review
  let myReview = {};
  myReview = req.query.review;
  console.log(myReview);

// book array with details
  let bookDetails4 = Object.values(books)
  console.log(bookDetails4);

//  username retrieved  from session
  nombreusuario = req.session.authorization.username;
  console.log(nombreusuario);

  bookDetails4[isbn].reviews = myReview;
  console.log(bookDetails4);
  isbnreal = isbn + 1; 

  const reviewer = reviewerlist.find((reviewer) => reviewer.username === nombreusuario);
  
  if (!reviewer) {
    reviewerlist.push({isbnreal, myReview, nombreusuario});
  }

  console.log(reviewerlist);

  let accessToken = jwt.sign({
    data: isbnreal
  }, 'access', { expiresIn: 60*3  });
  
  //console.log(accessToken);

  
  req.session.authorization = {
    accessToken, nombreusuario
}


  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
