const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require ('knex');
const register = require('./controller/register');
const signin = require('./controller/signin');
const profile = require('./controller/profile');
const image = require('./controller/image');

const DB_URL = process.env.DATABASE_URL;

const db = knex ({
    client: 'pg',
    connection: {
        connectionString: DB_URL,
        ssl: true
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

app.post('/image', (req, res) => image.apiCallHandler(req, res))


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("app is running on port " + PORT);
});