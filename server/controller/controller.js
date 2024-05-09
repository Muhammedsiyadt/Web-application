var Userdb = require('../model/model')
const bcrypt = require('bcrypt');
const axios = require('axios')
// Create and save new user
// exports.create = (req, res) => {
//     if (!req.body) {
//         res.status(400).send({ message: "Content cannot be empty!" })
//         return
//     }

//     // new user

//     const user = new Userdb(
//         {
//             name: req.body.name,
//             email:req.body.email,
//             password:req.body.password
//         }
//     )

  

//     // Save user in the DB
//     user
//         .save(user)
//         .then(data=>{
//             // res.send(data)
//             if(req.query.meth=='user'){
//                 res.redirect('/login')
//             }else{
//                 res.redirect('/adduser')
//             }
          
//         })
//         .catch(err=>{
//             res.status(500).send({
//                 message:err.message || "Some error occured while creating"
//             })
//         })


// }

// Create and save new user
// TEST
exports.create = (req, res) => {
  if (!req.body) {
      res.status(400).send({ message: "Content cannot be empty!" });
      return;
  }

  // Check if a user with the same email already exists
  Userdb.findOne({ email: req.body.email })
      .then(existingUser => {
          if (existingUser) {
              if (req.query.meth == 'user') {
                res.render('register.ejs',{taken:true});
            } else {
                res.render('adduser.ejs',{taken:true});
            }
          } else {
              // If the email is not already in use, create a new user
              const user = new Userdb({
                  name: req.body.name,
                  email: req.body.email,
                  password: req.body.password
              });

              // Save user in the DB
              user.save()
                  .then(data => {
                      if (req.query.meth == 'user') {
                          res.redirect('/login');
                      } else {
                          res.redirect('/adduser');
                      }
                  })
                  .catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while creating"
                      });
                  });
          }
      })
      .catch(err => {
          res.status(500).send({
              message: err.message || "Some error occurred while checking for existing user"
          });
      });
}

// TEST

// Retrieve and return all users / Retrieve and return a single user
exports.find = (req, res) => {

    if(req.query.id){
        // Single user
        const id = req.query.id;

        Userdb.findById(id)
            .then(data=>{
                if(!data){
                    res.status(404).send({message:"Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({message:"Error retrieving user with id" + id})
            })
    }else{
        Userdb.find()
        .then(user=>{
            res.send(user)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occured while retrieving User info"})
        })
    }

  
}




// Update a user
exports.update = (req, res) => {
  if(!req.body){
    return res
        .status(400)
        .send({message:"Data to update cannot be empty"})
  }


  const id =req.params.id;

const updatedUserData = req.body;

  // Check if there's a new password to hash
  if (updatedUserData.password) {
    // Hash the password
    bcrypt.hash(updatedUserData.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).send({ message: "Error hashing the password" });
      }
      // Update the password in the user data with the hashed value
      updatedUserData.password = hash;

      // Update the user in the database
      Userdb.findByIdAndUpdate(id, updatedUserData, { useFindAndModify: false })
        .then((data) => {
          if (!data) {
            res.status(404).send({ message: `Cannot update user with ${id}. Maybe user not found!` });
          } else {
            // res.send(data);
            res.redirect('/admindash')
          }
        })
        .catch((err) => {
          res.status(500).send({ message: "Error updating user information" });
        });
    });
  } else {
    // No password update, proceed to update other user data

    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: `Cannot update user with ${id}. Maybe user not found!` });
        } else {
          // res.send(data);
          res.redirect('/admindash')
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Error updating user information" });
      });
  }
};


// Delete a user with specified user id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:`Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message:"User was deleted succesfully"
                })
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Could not dlete User with id="+ id});
        });
}