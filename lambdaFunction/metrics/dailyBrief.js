var mongoConnect = require('../mongoConfig');
var moment = require('moment');



module.exports.dailyBrief = function (user_id) {

    let newDate = new Date();
    let yesterday = moment(newDate).set('day',moment(newDate).day() - 1).format('Y-MM-DD');




    let query = {
        "user_id": user_id,
        "Day": {'$eq': yesterday}
    }

    console.log('query :'+ JSON.stringify(query) );

    return new Promise((resolve,reject) => {
        mongoConnect().then(({client,db}) => {
            db.collection('signaux').find(query).toArray((err,results) => {

                client.close();
                if(err)
                    reject(err);
                console.log("  resutls :" + results);
                if(!results.length)
                    reject('the daily brief is not available yet');
                    
                let listOfComments = results.map(item => item.comments) ;     
                resolve(listOfComments);
                
                
            });

        }).catch(err => reject(err));
    });
}