var express = require('express');
var router = express.Router();
/* Connection database */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

/* GET home page. */
router.get('/', function(req, res, next) {
    (async function() {
        const url = 'mongodb://localhost:27017/api-bdd';
        const dbName = 'notes-api';
        const client = new MongoClient(url, { useNewUrlParser: true });

        try {
            await client.connect();
            const db = client.db(dbName);
            const col = db.collection('notes');
            console.log('Connected\n');

            //Display all datas of the collection
            console.log('Displaying datas\n');
            let data = await col.find().toArray();
            console.log(data);

            /*  //INSERT ONE DOCUMENT
                console.log('Inserting One element');
                var userID = 'Insert User _id here';
                var content = 'Content of the note';
                var createdAt = Date.now();
                var lastUpdatedAt = null;
                col.insertOne({
                  userID: userID,
                  content: content,
                  createdAt: createdAt,
                  lastUpdatedAt: lastUpdatedAt
                });
            */

            /*  //DELETING ONE DOCUMENT
                console.log('Deleting One element');
                col.deleteMany({content: 'Content of the note'});
            */
            res.send(data);
        } catch (err) {
            console.log(err.stack);
            res.send(err);
        }
        client.close();
    })();
});

module.exports = router;
