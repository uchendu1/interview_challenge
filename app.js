// imported all my modules
const express = require('express');
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const app = express();
const path = require('path');


// connected my db(mongodb)
var db =     "mongodb+srv://linda_1:lindy@yelpcamp-zn65v.mongodb.net/linter?retryWrites=true&w=majority";

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('connected to database ' + db);
});

mongoose.connection.on('error', (err) => {
    console.log('database error ' + err);
})

// use middlewares 
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true}));

// import all schemas
const User = require('./models/user');
const Task = require('./models/task');

// user auth 
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const auth = async(req, res, next) => {
    try {
        const token = await req
            .header("Authorization")
            .replace("Bearer ", "")
            .replace("Bearer", "");
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, 'thisismysecret')
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send(
            {message:'No auth'}
        )
    }
}

// routes
app.get('/', (req, res) => {
    res.sendfile('landing-page.html')
});


app.post("/signup", async(req, res) => {
    try {
        console.log(req.body);
        let signupData = req.body;
        console.log(signupData);
        let user = await new User(signupData).save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})    } 
        catch (e) {
            res.status(400).send(error.message)
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


// add a new task when a user is loggedIn
app.post("/addtask", auth, async(req, res) => {
    try {
        let task = await new Task({...req.body, owner: req.user._id }).save()
        res.status(200).send({
            msg: 'Task was added successfully',
            task
        })
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// gets all task for a specific user
app.get("/mytasks", auth, async(req, res) => {
    try {
        let tasks = await Task.find({ owner: req.user._id })
        res.status(200).send({tasks})
    } catch (e) {
        res.status(400).send({message: e.message})
    }
})

app.post("/deletetask/:taskID", auth, async(req, res)=> {
    try{
        const task =  await Task.findByIdAndRemove(req.params.taskID)
        if(!task) return res.status(404).send({message: "Not found"})
        res.status(200).send({message: "TO-DO deleted", task})
    }catch(e){
        res.send({message: e.message})
    }
})




// declared my server port
const port = process.env.PORT || 3000
// started server here
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

