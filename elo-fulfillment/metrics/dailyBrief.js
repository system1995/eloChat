var mongoConnect = require('../mongoConfig');
var moment = require('moment');



module.exports.dailyBrief = function (user_id,period) {

    let newDate = new Date();
    let dateRange;
    if(period === 'daily')
        dateRange = { '$eq': moment(newDate).set('day',moment(newDate).day() - 1).format('Y-MM-DD')}
    else if(period === 'monthly'){
        dateRange = {'$lte': moment().format('Y-MM-DD'), 
                '$gte': moment().set('month',moment().month()-1).format('Y-MM-DD')}
    }
    else if(period === 'weekly'){
        dateRange = {'$lte': moment().format('Y-MM-DD'), 
                '$gte': moment().set('day',moment().day()-7).format('Y-MM-DD')}
    }
    else{
        dateRange={}
    }

    console.log(dateRange)


    let query = {
        "user_id": user_id,
        "Day": dateRange
    }

    console.log('query :'+ JSON.stringify(query) );

    return new Promise((resolve,reject) => {
        mongoConnect().then(({client,db}) => {
            db.collection('signaux').find(query).toArray((err,results) => {

                client.close();
                if(err)
                    reject(err);
                //console.log("  resutls :" + results);
                if(!results.length)
                    reject(`the ${period} brief is not available for now`);
                    
                let listOfComments = results.map(item => item.comments) ;
                
                resolve(listOfComments.filter(comment=>comment && comment.length ));
                
                
            });

        }).catch(err => reject(err));
    });
}