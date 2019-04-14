var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/api-bdd';
const dbName = 'notes-api';
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_KEY || 'secret';

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

/* GET NOTES */
router.get('/', middleToken, async function(req, res) {
    jwt.verify(req.token, secret, async (err, data) => {
        if (err) {
            res.status(401).send('Utilisateur non connecté');
        } else {
            const client = new MongoClient(url, {useNewUrlParser: true});
            try {
                await client.connect();
                const db = client.db(dbName);
                const col = db.collection('notes');
                console.log('Connected\n');
                //Display all datas of the collection
                console.log('Displaying datas\n');
                let results = await col.find({ userID: data._id}).sort({ _id: -1}).toArray();
                res.send(results);
            } catch (err) {
                res.send(err);
            }
            client.close();
        }
    })
});

/* PUT A NOTE */
router.put('/', middleToken, async function(req, res) {
    jwt.verify(req.token, secret, async (err, data) => {
        if (err) {
            res.status(401).send('Utilisateur non connecté');
        } else {
            const client = new MongoClient(url, {useNewUrlParser: true});
            try {
                await client.connect();
                const db = client.db(dbName);
                const col = db.collection('notes');
                console.log('Connected\n');

                //INSERT ONE DOCUMENT
                let userID = data._id;
                let content = req.body.content;
                let createdAt = Date.now();
                let lastUpdatedAt = null;
                let resInsert = await col.insertOne({
                    userID,
                    content,
                    createdAt,
                    lastUpdatedAt
                });
                let note = resInsert.ops[0];
                res.send({
                    error: null,
                    note
                });
            } catch (err) {
                res.send(err);
            }
            client.close();
        }
    })
});

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
                const id_note = req.params.id;
                const content = req.body.content;
                const lastUpdatedAt = Date.now();
                //NoteResults dont exist if i find with _id
                let noteResults = await col.find().toArray();
                let resultForEach = 0;
                let noteToBeModified;
                noteResults.forEach(function (resForEach) {
                    if(resForEach._id.equals(id_note)){
                        resultForEach = 1;
                        noteToBeModified = resForEach;
                    }
                });
                if(resultForEach === 0) {
                    res.status(404).send({error: 'Cet identifiant est inconnu'});
                } else if(noteToBeModified.userID !== data._id){
                    res.status(403).send({error: 'Accès non autorisé à cette note'})
                } else {
                    let insertResult = await col.updateOne(
                        {_id: ObjectId(id_note)},
                        {
                            $set: {
                                content,
                                lastUpdatedAt
                            }
                        });
                    let note = await col.find({ _id: ObjectId(id_note) }).toArray();
                    res.send({
                        error: null,
                        note
                    });
                }
            } catch (err) {
                res.send(err);
            }
            client.close();
        }
    });
});

/* DELETE a note */
router.delete('/:id', middleToken, async function(req, res) {
    jwt.verify(req.token, secret, async (err, data) => {
        if (err) {
            res.send('ERROR AUTHENTIFICATION');
        } else {
            const client = new MongoClient(url, {useNewUrlParser: true});
            try {
                await client.connect();
                const db = client.db(dbName);
                const col = db.collection('notes');
                //DELETE ONE DOCUMENT
                let id_note = req.params.id;
                let noteResults = await col.find().toArray();
                let resultForEach = 0;
                let noteToBeDeleted;
                noteResults.forEach(function (resForEach) {
                    if(resForEach._id.equals(id_note)){
                        resultForEach = 1;
                        noteToBeDeleted = resForEach;
                    }
                });
                if(resultForEach === 0) {
                    res.status(404).send({error: 'Cet identifiant est inconnu'});
                } else if(noteToBeDeleted.userID !== data._id){
                    res.status(403).send({error: 'Accès non autorisé à cette note'})
                } else {
                    await col.deleteOne({_id: noteToBeDeleted._id});
                    res.send({error: null});
                }
            } catch (err) {
                res.send(err);
            }
            client.close();
        }
    });
});

module.exports = router;
