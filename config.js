const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-bdd';
const JWT_KEY = process.env.JWT_KEY || 'notes-api';
const PORT = process.env.PORT || 3000;
const dbName = process.env.DBNAME ||'notes-api';

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const jwt = require('jsonwebtoken');
const md5 = require('md5');


function isUsernameValid(str){
    if(typeof(str)!== 'string'){
        return false;
    }
    for(var i=0;i<str.length;i++){
        if(str.charCodeAt(i)>122 || str.charCodeAt(i)<97){
            return false;
        }
    }
    return true;
}

module.exports = {
    md5,
    jwt,
    dbName,
    ObjectId,
    MongoClient,
    MONGODB_URI,
    JWT_KEY,
    PORT,
    isUsernameValid
};