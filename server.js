const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require ('knex');

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

app.post('/signin', (req, res) => {

    if (req != null && req.body != null) {
        db.select('email', 'hash').from('login')
            .where('email', '=', req.body.email)
            .then(data => {

                var isValid = bcrypt.compareSync(req.body.password, data[0].hash);

                if(isValid) {
                    return db.select('*').from('users')
                            .where('email', '=', data[0].email)
                            .then(user => {
                                res.json(user[0])
                            })
                            .catch(err => {
                                res.status(400).json('Unable to get user')
                        })
                } else {
                    res.status(400).json("Wrong Credentials")
                }
            })
            .catch(err => {
                res.status(400).json("Wrong Credentials")
            })
    } else {
        res.status(400).json("Error Logging In");
    }
})


app.post('/register', (req, res) => {

    if (req != null && req.body != null) {

        const { email, name, password } = req.body;

        var hash = bcrypt.hashSync(password, 10);

        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.status(200).json(user);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })    
        .catch(err => {
            res.status(400).json("Error while Register");
        })
        
    } else {
        res.status(400).json("Error Register");
    }

})

app.get('/profile/:userId', (req, res) => {

    if(req.params.userId != null) {
        db.select('*').from('users').where({
            id: req.params.userId
        })
        .then(user => {

            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(404).json("User Not Found")
            }     
        })
        .catch(err => {
            res.status(500).json("System Error");
        })
    } else {
        res.status(400);
    }

})

app.put('/image', (req, res) => {

    const { id } = req.body;

    db('users').where('id', '=', id).increment('entries', 1)
    .returning('entries')
    .then(entires => {
        res.status(200).json(entires);
    })
    .catch(err => res.status(400).json('Unable to increase entries'))
})

app.listen(3030, () => {
    console.log("app is running on port 3030");
});