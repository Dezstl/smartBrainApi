
const signinHandler = (req, res, db, bcrypt) => {
    if (req != null && req.body != null) {
        db.select('email', 'hash').from('login')
            .where('email', '=', req.body.email)
            .then(data => {

                var isValid = bcrypt.compareSync(req.body.password, data[0].hash);

                if (isValid) {
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
}



module.exports = {
    signinHandler: signinHandler
}