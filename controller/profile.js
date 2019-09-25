
const profileHandeler = (req, res, db) => {
    if (req.params.userId != null) {
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

}

module.exports = {
    profileHandeler: profileHandeler
}