if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path')
const morgan = require('morgan')



// const bodyparser=require('body-parser')

const connectDB = require('./server/database/connection')

const PORT = process.env.PORT || 8080;


const users = []
// View engine EJS
app.set('view-engine', 'ejs')

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false

}))

app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
// app.use(morgan('tiny'))

// MongoDB connection
connectDB();



// app.use(bodyparser.urlencoded({extended:true}))

// Cache 
const cacheTime = 60;
app.use((req, res, next) => {
    // res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
    res.setHeader("Cache-Control", `public,no-store, must-revalidate, max-age=${cacheTime}`);
    res.setHeader("Pragma", "no-cache");  
    next()
})

// Routes

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
}) 

// Login
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

// Register
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs',{taken:false})

})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    // console.log(users)
    
})
// userLogout
app.delete('/logout', (req, res) => {
    req.logOut()          
    req.session.destroy();
    res.redirect('/login')

})




// custom
function checkAuthenticated(req, res, next) {


    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }

    next()
}



// Load Admin Routers
app.use('/',require('./server/routes/router'))

   


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

