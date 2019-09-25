const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require ('knex');

const register = require('./controller/register');
const signin = require('./controller/signin');
const profile = require('./controller/profile');
const image = require('./controller/image');

const db = knex ({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: '',
        password: '',
        database: 'smart-brain'
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("working");
})

app.post('/signin', (req, res) => signin.signinHandler(req, res, db, bcrypt))

app.post('/register', (req, res) => register.handleregister(req, res, db, bcrypt))

app.get('/profile/:userId', (req, res) => profile.profileHandeler(req, res, db))

app.put('/image', (req, res) => image.imageHandler(req, res, db))

app.listen(3030, () => {
    console.log("app is running on port 3030");
});