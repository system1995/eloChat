var {MongoClient} = require('mongodb');

const USER = 'root';
const PASSWORD = 'eyP3kt6b7z95BNN';
const HOST = 'dashboardcenter.win';
const PORT = '27017';
const DB_NAME = 'prod';
const URL = 'mongodb://' + USER +':'+ PASSWORD + '@' + HOST + ':'+ PORT + '/' + DB_NAME;


const connectToMongodb = () => {
    return new Promise((resolve,reject) => {
        MongoClient.connect(URL,function (err,client) {
            if(err) {
                console.log(err);
                reject('network connection failed. Try again');
            }

            db = client.db(DB_NAME);

            resolve({client,db});


        });
    });

}

module.exports = connectToMongodb;



