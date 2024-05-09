const express = require('express')
const route = express.Router()
const session = require('express-session');
const axios = require('axios')
const controller = require('../controller/controller')




admincred = {
    adminemail:"admin@gmail.com",
    adminpass:123
}

route.use((req, res, next) => {
    // res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
    res.setHeader("Cache-Control", `public,no-store, must-revalidate`);
    res.setHeader("Pragma", "no-cache");  
    next()
})


// Admin
route.get('/adminlogin',checkNotAuthenticatedAdmin,(req,res)=>{
    content={
        error:false,
    }
    res.render('adminlogin.ejs',{content})
})
route.post('/adminlogin',(req,res)=>{
    try{
        if(admincred.adminemail==req.body.email && admincred.adminpass==req.body.password){
            req.session.isAdminLoggedIn = true;
            res.redirect('/admindash')
        }
        else{
            content={
                error:true,
                value:"Invalid admin credentials"
            }
            res.render('adminlogin.ejs',{content})
        
        }
    }catch{
        
        res.render('adminlogin.ejs')
    }
 
    
})

route.get('/admindash',checkAuthenticatedAdmin,(req,res)=>{

    // Make a get request to api/users
    axios.get('http://localhost:3000/api/users')
        .then(function(response){
            // console.log(response.data);
            res.render('admindash.ejs',{users:response.data})
        })
        .catch(err=>{
            res.send(err);
        })

    // HomeRoute
    // res.render('admindash.ejs',{users:"New Data"})
})
// route.post('/adminloginpost',(req,res)=>{
//     res.render('adminlogin.ejs')

// })
// Add User
route.get('/adduser',checkAuthenticatedAdmin,(req,res)=>{
    res.render('adduser.ejs',{taken:false})
})
// Update User
route.get('/update-user',checkAuthenticatedAdmin,(req,res)=>{
    axios.get('http://localhost:3000/api/users',{params:{id:req.query.id}})
        .then(function(userdata){
            res.render('updateuser.ejs',{user:userdata.data})
        })
        .catch(err=>{
            res.send(err);
        })
})


route.delete('/logoutadmin', (req, res) => {
    req.session.destroy();
    res.redirect('/adminlogin')

})


function checkAuthenticatedAdmin(req, res, next) {


    if (req.session.isAdminLoggedIn) {
        return next()
    }
    res.redirect('/adminlogin')
}
function checkNotAuthenticatedAdmin(req, res, next) {


    if (req.session.isAdminLoggedIn) {
        
        res.redirect('/admindash')
    }
    return next()
}

// DB API
route.post('/api/users',controller.create)
route.get('/api/users',controller.find)
route.post('/api/users/:id',controller.update)
route.delete('/api/users/:id',controller.delete)
route.get('*',(req,res)=>{
    res.render('errorpage.ejs')
})


module.exports = route
