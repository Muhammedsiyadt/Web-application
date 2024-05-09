const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
})



// BCRYPT PASSWORD

schema.pre('save', async function (next) {
    try {
      // Check if the password is modified or a new user is being created
      if (!this.isModified('password')) {
        return next();
      }
  
      // Hash the password with bcrypt
      const hashedPassword = await bcrypt.hash(this.password, 10);
  
      // Set the hashed password back to the field
      this.password = hashedPassword;
  
      next();
    } catch (error) {
      return next(error);
    }
  });

  

const Userdb = mongoose.model('userdb',schema)

module.exports = Userdb;