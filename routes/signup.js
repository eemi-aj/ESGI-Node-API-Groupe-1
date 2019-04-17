var express = require('express');
var router = express.Router();
const {MongoClient} = require('../config');
const {MONGODB_URI} = require('../config');
const {JWT_KEY} = require('../config');
const {dbName} = require('../config');
const {jwt} = require('../config');
const {md5} = require('../config');
const {isUsernameValid} = require('../config');

/* SIGN UP A USER */
router.post('/', async function(req, res) {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('users');
        console.log('Connected\n');
        let data = await col.find({}).toArray();
        if(req.body.password.length <= 3) {
            res.status(400).send({error: 'Le mot de passe doit contenir au moins 4 caractères'});
        } else if(!isUsernameValid(req.body.username)) {
            res.status(400).send({error: 'Votre identifiant ne doit contenir que des lettres minuscules non accentuées'});
        } else if(req.body.username.length < 2 || req.body.username.length > 20) {
            res.status(400).send({error: 'Votre identifiant doit contenir entre 2 et 20 caractères'});
        }
        else if (data.some(data => data.username === req.body.username)) {
            res.status(400).send({error: 'Cet identifiant est déjà associé à un compte'});
        } else {
            //INSERT ONE DOCUMENT
            await col.insertOne({
                username: req.body.username,
                password: md5(req.body.password)
            });
            let result = await col.find({username: req.body.username, password: md5(req.body.password)}).toArray();
            jwt.sign({
                _id: result[0]._id,
                username: result[0].username,
                password: req.body.password
            }, JWT_KEY, { expiresIn: '24h' },(err, token) => {
                if(err) {
                    res.send({message: 'error'});
                }
                else {
                    res.send(token);
                }
            });
        }
    } catch (err) {
        res.send(err);
    }
    client.close();
});

module.exports = {router};
