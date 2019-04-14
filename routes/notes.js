var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const url = 'mongodb://localhost:27017/api-bdd';
const dbName = 'notes-api';
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_KEY || 'secret';

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

function middleToken(req, res, next){
    const xaccesstokenHeader = req.headers['authorization'];
    if(typeof xaccesstokenHeader !== 'undefined'){
        const xaccesstoken = xaccesstokenHeader.split(' ');
        req.token = xaccesstoken[1];
        next();
    } else {
        res.sendStatus(403);
    }
}

/* PATCH A NOTE */
router.patch('/:id', middleToken, async function(req, res) {
    jwt.verify(req.token, secret, async (err, data) => {
        if (err) {
            res.send('ERROR AUTHENTIFICATION');
        } else {
            const client = new MongoClient(url, {useNewUrlParser: true});
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
                    {_id: ObjectId(id_note)},
                    {
                        $set: {content: content, lastUpdatedAt: lastUpdatedAt}
                    });
                if (insertResult.matchedCount) {
                    res.send('YES');
                } else {
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
        }
    });
});

/* DELETE a note */
router.delete('/:id', async function(req, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('notes');
        //DELETE ONE DOCUMENT
        let id_note = req.params.id;
        console.log(id_note);
        let deleteResult = await col.deleteOne({_id : ObjectId(id_note)});
        if(deleteResult.result.n != 0){
            res.send('note deleted');
        }
        else {
            res.status(404).send('id not found');
        }
    } catch (err) {
        res.send(err);
    }
    client.close();
});

module.exports = router;
