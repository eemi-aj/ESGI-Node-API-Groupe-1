var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const md5 = require('md5');
const url = 'mongodb://localhost:27017/api-bdd';
const dbName = 'notes-api';

/* GET notes JSON */
router.get('/', async function(req, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('users');
        console.log('Connected\n');

        //Display all datas of the collection
        console.log('Displaying users\n');
        let data = await col.find().toArray();
        res.send(data);

    } catch (err) {
        res.send(err);
    }
    client.close();
});

/* POST a note */
router.post('/', async function(req, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('users');
        console.log('Connected\n');

        //INSERT ONE DOCUMENT
        let username = req.body.username;
        let password = md5(req.body.password);
        await col.insertOne({
            username: username,
            password: password
        });
        res.send('token');
/*
      //DELETING ONE DOCUMENT
        console.log('Deleting One element');
        col.deleteMany({username: 'nassim2'});
*/
    } catch (err) {
        res.send(err);
    }
    client.close();
});

module.exports = router;
