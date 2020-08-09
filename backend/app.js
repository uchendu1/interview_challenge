// imported all my modules
const express = require('express');
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const app = express();
const path = require('path');

// declared my server port
const port = 3000

// connected my db(mongodb)
mongoose.connect("mongodb://localhost/linter", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('connected to database ' + "mongodb://localhost/linter");
});

mongoose.connection.on('error', (err) => {
    console.log('database error ' + err);
})

// use middlewares 
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

// import all schemas
const User = require('./models/user');

// routes
app.get('/', (req, res) => {
    res.sendfile('landing-page.html')
});


app.post("/signup", async(req, res) => {
    try {
        console.log(req);
        let signupData = req.body;
        console.log(signupData);
        let newUser = await new User(signupData).save()
        res.send(newUser)
    } catch (e) {
        console.log(e.message);
    }
})

// user login
app.post('/login', async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// started server here
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

