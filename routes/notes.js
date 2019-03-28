var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const url = 'mongodb://localhost:27017/api-bdd';
const dbName = 'notes-api';

/* GET NOTES */
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

/* PUT A NOTE */
router.put('/', async function(req, res) {
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

/* PATCH A NOTE */
router.patch('/:id', async function(req, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('notes');
        console.log('Connected\n');

        //INSERT ONE DOCUMENT
        let id_note = req.params.id;
        let content = req.body.content;
        let lastUpdatedAt = Date.now();
        let insertResult = await col.updateOne(
            { _id : ObjectId(id_note) },
            { $set: { content: content, lastUpdatedAt: lastUpdatedAt }
            });
        if(insertResult.matchedCount){
            res.send('YES');
        }
        else {
            res.status(404).send('Cet identifiant est inconnu');
        }
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
