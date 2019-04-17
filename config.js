const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-bdd';
const JWT_KEY = process.env.JWT_KEY || 'notes-api';
const PORT = process.env.PORT || 3000;
const dbName = process.env.DBNAME ||'notes-api';

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const jwt = require('jsonwebtoken');
const md5 = require('md5');

function dateNow(){
    var dateNow = new Date();
    var day = dateNow.getDate();
    var month = dateNow.getMonth();
    var year = dateNow.getFullYear();
    var hour = dateNow.getHours();
    var minutes = dateNow.getMinutes();
    var seconds = dateNow.getSeconds();
    month += 1;
    const dateFormatted = formatDigits(day) + '/' + formatDigits(month) + '/' + year + ' ' + formatDigits(hour) + ':' + formatDigits(minutes) + ':' + formatDigits(seconds);
    return dateFormatted;
}

function formatDigits(number){
    if(number < 10) {
        number = ('0' + number);
    }
    return number;
}

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
    ObjectId,
    MongoClient,
    MONGODB_URI,
    dbName,
    JWT_KEY,
    PORT,
    jwt,
    md5,
    isUsernameValid,
    dateNow
};