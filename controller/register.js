
const handleregister = (req, res, db, bcrypt) => {
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
                            res.status(200).json(user[0]);
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
}

module.exports = {
    handleregister: handleregister
}