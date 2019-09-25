const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'b28e9e306cf345828fd230b1b79ef8e6'
});

const apiCallHandler = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Unable to access image'))
}

const imageHandler = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id).increment('entries', 1)
        .returning('entries')
        .then(entires => {
            res.status(200).json(entires);
        })
        .catch(err => res.status(400).json('Unable to increase entries'))
}

module.exports = {
    imageHandler: imageHandler,
    apiCallHandler: apiCallHandler
}