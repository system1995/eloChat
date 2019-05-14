var mongoConnect = require('../mongoConfig');

//expense
//revenue
//profit

module.exports.expenseTotal = function (user_id,arrangeDates,startDate= null,endDate = null,network=null) {
    return new Promise((resolve,reject) => {

        const {date1,date2} = arrangeDates(startDate,endDate);
        var query = {};

        if(date1 === "Invalid date" || date2 === "Invalid date"){
            console.log('dkhaal invalid');
            reject('you entered invalid dates. Give it another try');
        }
        else if(date1 && date2) {
            console.log('dkhal1');
            query = {
                "user_id": user_id,
                "date": {'$lte': date1, '$gte': date2}
            };

        }
        else if(date1){
            console.log('dkhal2');
            query = {
                "user_id" : user_id,
                "date" : {'$eq' : date1 }
            }
        }
        else{
            console.log('dkhal3');
            query = {
                "user_id": user_id
            }
        }

        if(network){
            //query["ad_network"] =
            console.log('network:' +network);
            query.ad_network = network.replace(' ','_');
        }

        mongoConnect().then(({client, db}) => {

                db.collection('expense').find(query).toArray((err, results) => {
                    client.close();
                    if (err)
                        reject('data not retrieved');

                    var totalExpense = 0;
                    if(results.length){
                        totalExpense = results.map(item => item.expense).reduce(
                            (accumulator,currentValue) => {
                                return accumulator + currentValue;
                            });
                    }

                
                    resolve({totalExpense : totalExpense.toFixed(2),startDate:date2,endDate:date1});
                });
        }).catch(err => {
            console.log('connection failed');
            reject(err);
        });
    });
}