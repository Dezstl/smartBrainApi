const express = require('express');
const bodyParser = require('body-parser');
const bycrypt = require('bcrypt');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());


const dataBase = [
    {
        id: 123,
        name: 'john',
        email: 'john@gmail.com',
        password: 'password',
        entries: 5,
        joined: new Date()
    },
    {
        id: 789,
        name: 'sally',
        email: 'sally@gmail.com',
        password: 'password',
        entries: 9,
        joined: new Date()
    }
]

app.get('/', (req, res) => {
    res.send("working");
})

app.post('/signin', (req, res) => {

    if (req != null && req.body != null) {
        res.status(200).json(req.body)
    } else {
        res.status(400).json("Error Logging In");
    }
})


app.post('/register', (req, res) => {

    if (req != null && req.body != null) {

        req.body.id = 24124;
        req.body.joined = new Date();
        req.body.entries = 0;

        dataBase.push(req.body);

        res.status(200).json(dataBase[dataBase.length-1]);
    } else {
        res.status(400).json("Error Register");
    }

})

app.get('/profile/:userId', (req, res) => {

    let found = false;

    if(req.params.userId != null) {
        dataBase.forEach(user => {
            if (user.id == req.params.userId) {
                console.log(user);
                found = true;
                return res.json(user);
            }
        })
    } else {
        res.status(400);
    }

    if (!found) {
        return res.status(404).send("Not found");
    }

})

app.put('/image', (req, res) => {

    let found = false;

    dataBase.forEach(user => {
        if (user.id == req.body.id) {
            console.log(user);
            user.entries++;
            found = true;
            return res.json(user.entries);
        }
    })

    if (!found) {
        return res.status(404).send("Not found");
    }
})

app.listen(3030, () => {
    console.log("app is running on port 3030");
});