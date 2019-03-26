
//Test Branche
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017/api-bdd';
const dbName = 'notes-api';

/* GET notes JSON */
router.get('/', async function(req, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('notes');
        console.log('Connected\n');

        //Display all datas of the collection
        console.log('Displaying datas\n');
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
        const col = db.collection('notes');
        console.log('Connected\n');

        //INSERT ONE DOCUMENT
        let userID = req.body.userID;
        let content = req.body.content;
        let createdAt = Date.now();
        let lastUpdatedAt = null;
        await col.insertOne({
            userID: userID,
            content: content,
            createdAt: createdAt,
            lastUpdatedAt: lastUpdatedAt
        });
        res.send('Note added');
/*
      //DELETING ONE DOCUMENT
        console.log('Deleting One element');
        col.deleteMany({content: 'test'});
*/
    } catch (err) {
        res.send(err);
    }
    client.close();
});

module.exports = router;
