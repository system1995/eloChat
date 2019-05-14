//var mongoConnect = require('../mongoConfig');
const {revenueTotal} = require('./revenues');
const {expenseTotal} = require('./expenses');


module.exports.profitTotal = function (user_id,arrangeDates,startDate= null,endDate = null,network=null) {

    return new Promise((resolve,reject) => {
        revenueTotal(user_id,arrangeDates,startDate,endDate,network).then((totalRevenue,startDate1,endDate1) => {
            expenseTotal(user_id,arrangeDates,startDate,endDate,network).then((totalExpense,startDate2,endDate2) => {
                resolve({totalProfit:(totalRevenue - totalExpense).toFixed(2),startDate:startDate1,endDate:endDate1});
            }).catch(err => reject(err));
        }).catch(err => reject(err));

    });

}