var mongoConnect = require('../mongoConfig');
var {arrangeDatesTest,checkPlural} = require('../helpers');

module.exports.pageVisibility = (user_id,arrangeDates,dateRange,startDate=null,endDate=null)=>{
      return new Promise((resolve,reject) => {
        mongoConnect().then(({client,db}) => {
            const {date1,date2} = arrangeDates(startDate,endDate);
            const range = dateRange(date1,date2);
            let query = {'user_id' : 1};
            if(range)
                query = {'user_id' : 1,'day': range};
            
            db.collection('hbreportpage').aggregate([
                {'$match' : query},
                {'$group' : {'_id' : '$page' , 'v_impressions': { '$sum':'$v_impressions'},
                             'impressions' : {'$sum':'$impressions' } }}
            ],function(err,cursor){
                if(err)
                  reject("there's no performing page for this period.");
                cursor.get((err,list)=>{
                    client.close();
                    if (err) reject("there's no performing page for this period.");
                    console.log(list)
                    if(list && list.length){
                        for(let i=0;i<list.length;i++){
                            const impressions = parseInt(list[i].impressions)
                            const v_impressions = parseInt(list[i].v_impressions)
                            if(impressions === 0){
                               list[i].visibility = 0;
                               continue;
                            }

                            let visibility = (v_impressions/impressions)*100;
                            list[i].visibility = visibility.toFixed(2);
                        }

                        list.sort((a,b)=>{
                          return b.visibility - a.visibility
                        });
                        
                       resolve({topPerformance:list,startDate:date2,endDate:date1});  
                    } 

                    reject('there\'s no results for this period');
                });     
            })

        })
        .catch(err=> reject(err));

    });
}