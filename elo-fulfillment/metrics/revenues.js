var mongoConnect = require('../mongoConfig');
var asyncLoop = require('node-async-loop');
const {formatRanges,arrangeDatesTest,checkPlural,singularize,filterResultList,mapResultList} = require('../helpers');


//expense
//revenue
//profit

function revenueTotal(user_id,arrangeDates,startDate= null,endDate = null,network=null) {
     return new Promise((resolve,reject) => {

         const {date1,date2} = arrangeDates(startDate,endDate);
         //const {date1,date2} = arrangeDatesTest(startDate,endDate);
         //const dates = arrangeDates(startDate,endDate);
         let query = {};
         if(date1 === "Invalid date" || date2 === "Invalid date"){
             console.log('dkhaal invalid');
             reject('you entered invalid dates. Give it another try');
         }
         else if(date1 && date2) {
             console.log('dkhal1');
             console.log(date1 + "   " + date2);
             query = {
                 "user_id":user_id,
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
             //console.log('yes yes network')
             query.ad_network = network.replace(' ','_').toUpperCase();
         }

         console.log('reached this point of execution');

         mongoConnect().then(({client, db}) => {
                 db.collection('revenue').find(query).toArray((err, results) => {
                    client.close();

                     if (err)
                         reject('network connection failed. Try again');

                     var totalRevenue = 0 ;
                     if(results.length) {
                        //console.log('reached this point of execution 2');
                        //console.log('results length: ' +results.length);
                        
                         totalRevenue = results.map(item => item.revenue).reduce(
                             (accumulator, currentValue) => {
                                 return accumulator + currentValue;
                             });
                     }

                     
                     resolve({totalRevenue:totalRevenue.toFixed(2),
                        startDate:date2,endDate:date1});
                 });
         }).catch(err => {
             console.log('network connection failed. Try again');
             reject('network connection failed. Try again');
         });
     });
}

module.exports.revenueTotal = revenueTotal;


module.exports.revenueTotalVersus = (user_id,arrangeDates2,dateRange,network,startDate=null,endDate=null)=>{

        return new Promise((resolve,reject)=>{
            let query1 = {}, query2 = {};
            const {range1,range2} = arrangeDates2(startDate,endDate)
            let daterange1 = dateRange(range1.date1,range1.date2);
            query1 = {
                "user_id": user_id,
                "date": daterange1
            };
            
            let daterange2 = dateRange(range2.date1,range2.date2);
            query2 = {
                "user_id": user_id,
                "date": daterange2
            }

            if(network){
                query1.ad_network = network.replace(' ','_');
                query2.ad_network = network.replace(' ','_');
            }

            mongoConnect().then(({client, db}) => {
                db.collection('revenue').find(query1).toArray((err, results1) => {
                    if (err)
                        reject('network connection failed. Try again');

                    db.collection('revenue').find(query2).toArray((err,results2)=>{
                        client.close();
                        if (err)
                            reject('network connection failed. Try again');

                        var totalRevenue1 = 0 ;
                        if(results1.length) {
                        
                            totalRevenue1 = results1.map(item => item.revenue).reduce(
                                (accumulator, currentValue) => {
                                    return accumulator + currentValue;
                                });
                            
                        }

                        var totalRevenue2 = 0 ;
                        if(results2.length) {
                        
                            totalRevenue2 = results2.map(item => item.revenue).reduce(
                                (accumulator, currentValue) => {
                                    return accumulator + currentValue;
                                });
                            
                        }
                        
                       
                        const {range1Formated,range2Formated} = formatRanges(range1,range2);
                        resolve({totalRevenue1:totalRevenue1.toFixed(2),
                                 totalRevenue2:totalRevenue2.toFixed(2),
                            range1:range1Formated,range2:range2Formated});
                    })

                });
            }).catch(err => {
                console.log('network connection failed. Try again');
                reject('network connection failed. Try again');
            });
        });
}

/*module.exports.revenueByGenderTypes = (user_id,gender,arrangeDates,dateRange,startDate=null,endDate=null)=>{
    return new Promise((resolve,reject)=>{
        mongoConnect().then(({client,db})=>{
            const {date1,date2} = arrangeDates(startDate,endDate);
            const range = dateRange(date1,date2);
            let query = {'userId' : user_id,'gender':};
            if(range)
                query = {'userId' : user_id,'date': range};

            db.collection('audiencereport')
        });
    });
}*/

module.exports.revenueByGender = function (user_id,arrangeDates,dateRange,startDate=null,endDate=null) {

    return new Promise((resolve,reject) => {
        mongoConnect().then(({client, db}) => {

            const {date1,date2} = arrangeDates(startDate,endDate);
            const range = dateRange(date1,date2);
            let query = {'userId' : user_id};
            if(range)
                query = {'userId' : user_id,'date': range};

            db.collection('audiencereport').group(['gender'],
                query,
                {'total' : 0},
                "function(curr,result){  result.total += parseInt(curr.sessions) }",
                 function(err,result) {
                    client.close();

                    if(err){
                        console.log(err);
                        reject(err);
                    }

                    this.genderData = result;
    

                    revenueTotal(user_id,arrangeDates,startDate,endDate).then(res => {
                        console.log(JSON.stringify(this.genderData));
                        if(!this.genderData.length){
                            resolve({
                                totalRevenueFemale: 0,
                                totalRevenueMale: 0,
                                startDate: res.startDate, endDate: res.endDate
                            })
                        }
                        if(this.genderData.length === 1){

                            if(this.genderData[0].gender = 'female') {
                                resolve({
                                    totalRevenueFemale: res.totalRevenue,
                                    totalRevenueMale: 0,
                                    startDate: res.startDate, endDate: res.endDate
                                })
                            }
                            else{
                                resolve({
                                    totalRevenueFemale: 0,
                                    totalRevenueMale: res.totalRevenue,
                                    startDate: res.startDate, endDate: res.endDate
                                })
                            }
                        }

                        const total = this.genderData[0].total + this.genderData[1].total;
                        this.genderData[0].revenue = (res.totalRevenue * (this.genderData[0].total / total)).toFixed(2);
                        this.genderData[1].revenue = (res.totalRevenue * (this.genderData[1].total / total)).toFixed(2);

                        var revenueFemale = ( this.genderData[0].gender.toLowerCase() === 'female' ) ?
                        this.genderData[0].revenue : this.genderData[1].revenue ;

                        var revenueMale = (this.genderData[0].gender.toLowerCase() === 'male')?
                        this.genderData[0].revenue : this.genderData[1].revenue ;

                        resolve({totalRevenueFemale: revenueFemale,
                            totalRevenueMale : revenueMale,
                            startDate:res.startDate,endDate:res.endDate})
                    }).catch(err =>{
                        console.log('error total'); 
                        reject(err)});

                })
        });
    });
}

module.exports.sessionsByAgeRange = (user_id,arrangeDates,dateRange,startDate=null,endDate=null)=>{
    return new Promise((resolve,reject)=>{
        mongoConnect().then(({client, db}) => {
            const {date1,date2} = arrangeDates(startDate,endDate);                        
            //const dates = arrangeDates(startDate,endDate);
            const range = dateRange(date1,date2);
            let query = {'userId' : 1};
            console.log(range)
            if(range)
                query = {'userId' : 1,'date': range};

            db.collection('audiencereport').aggregate([
                {'$match' : query},
                {'$group' : {'_id' : '$age','sessions' :{'$sum': '$sessions'}}},
                {'$sort' : {'sessions' : -1}}
            ],function(err,cursor){
                if(err)
                   reject("no sessions by age range were found");

                cursor.get((err,list)=>{
                    client.close();
                    if(err)
                      reject("no sessions by age range were found");
                    
                    if(list.length){
                       resolve({sessions:list,startDate:date2,endDate:date1})
                    }
 
                    reject("no sessions by age range were found");
                });

            });
        });

    });
}

module.exports.revenueByEachDevice = (user_id,arrangeDates,dateRange,startDate=null,endDate=null)=>{
    return new Promise((resolve,reject) => {
        mongoConnect().then(({client, db}) => {
            const {date1,date2} = arrangeDatesTest(startDate,endDate);                        
            const dates = arrangeDates(startDate,endDate);
            const range = dateRange(date1,date2);
            let query = {'user_id' : 1};
            if(range)
                query = {'user_id' : 1,'day': range};

            
            db.collection('hbreportdaily').aggregate([
                {'$match' : query},
                {'$group' : {'_id' : '$device','revenue' : {'$sum' : '$revenue'}}},
                {'$sort' : {'revenue' : -1}}
            ],function(err,cursor){
                
                if(err)
                   reject("no revenue was found");
                
                
                cursor.get((err,list)=>{
                   client.close();
                   if(err){
                     reject("no revenue was found");
                   }
                   
                   if(list.length){
                      resolve({revenues:list,startDate:dates.date2,endDate:dates.date1})
                   }

                   reject("no revenue was found");
                });
            })
        });

    });
}


module.exports.revenueByCountry = (user_id,arrangeDates,dateRange,startDate=null,endDate=null)=>{
    return new Promise((resolve,reject) => {
        mongoConnect().then(({client, db}) => {
            const {date1,date2} = arrangeDatesTest(startDate,endDate);                        
            const dates = arrangeDates(startDate,endDate);
            const range = dateRange(date1,date2);
            let query = {'user_id' : 1};
            if(range)
                query = {'user_id' : 1,'day': range};

            
            db.collection('hbreportdaily').aggregate([
                {'$match' : query},
                {'$group' : {'_id' : '$country','revenue' : {'$sum' : '$revenue'}}},
                {'$sort' : {'revenue' : -1}}
            ],function(err,cursor){
                
                if(err)
                   reject("no revenue was found");
                
                
                cursor.get((err,list)=>{
                   client.close();
                   if(err){
                     reject("no revenue was found");
                   }

                   if(list.length){
                    resolve({revenues:list,startDate:dates.date2,endDate:dates.date1})
                   }

                   reject("no revenue was found");
                })

            })

        })
    })
}

module.exports.revenueByOS = (user_id,arrangeDates,dateRange,startDate=null,endDate=null)=>{
    return new Promise((resolve,reject) => {
        mongoConnect().then(({client, db}) => {
            const {date1,date2} = arrangeDatesTest(startDate,endDate);                        
            const dates = arrangeDates(startDate,endDate);
            const range = dateRange(date1,date2);
            let query = {'user_id' : 1};
            if(range)
                query = {'user_id' : 1,'day': range};

            
            db.collection('hbreportdaily').aggregate([
                {'$match' : query},
                {'$group' : {'_id' : '$os','revenue' : {'$sum' : '$revenue'}}},
                {'$sort' : {'revenue' : -1}}
            ],function(err,cursor){
                
                if(err)
                   reject("no revenue was found");
                
                
                cursor.get((err,list)=>{
                   client.close();
                   if(err){
                     reject("no revenue was found");
                   }
                   
                   if(list.length){
                      resolve({revenues:list,startDate:dates.date2,endDate:dates.date1})
                   }

                   reject("no revenue was found");
                });
            })
        });

    });
}

module.exports.revenueOfBestCompaingnOrSourceOrBidder = (user_id,dimension,dimensionNum,arrangeDates,dateRange,startDate=null,endDate=null) => {

    return new Promise((resolve,reject) => {
        mongoConnect().then(({client,db}) => {
            const {date1,date2} = arrangeDatesTest(startDate,endDate);
            const dates = arrangeDates(startDate,endDate);
            const range = dateRange(date1,date2);
            let query = {'user_id' : 1};
            if(range){
                console.log(range);
                query = {'user_id' : 1,'day': range};
            }
            else
                reject("there's no performing "+dimension.replace('utm_','')+ " for this period.")
            
            
            const queryDimension = singularize(dimension)
            
            db.collection('hbreportpage').aggregate([
                {'$match' : query},
                {'$group' : {'_id' : '$' + queryDimension,'revenue' : {'$sum' : '$revenue'}}},
                {'$sort' : {'revenue' : -1}}
            ],function(err,cursor){

                if(err)
                   reject("there's no performing "+dimension.replace('utm_','')+ " for this period.");

                cursor.get((err,list)=> {
                    client.close();
                    if(err)
                       reject("there's no performing "+dimension.replace('utm_','')+ " for this period.");
                    
                    if(list.length){
                        
                        if(checkPlural(dimension) || dimensionNum){
                            let newList = [];
                            if(dimension.includes('utm_source')){
                                newList= mapResultList(list)
                            }   
                            else{
                               newList= filterResultList(list)
                            }


                            if(!newList.length)
                                reject(`no performance information can be provided about ${dimension.replace('utm_','')} for this period`)

                            if(dimensionNum)
                                resolve({topPerformance:newList.slice(0,dimensionNum),
                                    startDate:dates.date2,endDate:dates.date1})

                            resolve({topPerformance:newList.slice(0,3),
                                     startDate:dates.date2,endDate:dates.date1})
                        }


                        if(list[0]._id === null && dimension === "utm_source"){
                            const revenue = list[0].revenue;
                            const _id = "organic";
                            resolve({topPerformance:{_id,revenue},startDate:dates.date2,endDate:dates.date1});
                        }

                        const newList = list.filter(item=>item._id !== null);
                        
                        if(!newList.length)
                            reject(`no performances to provide about ${dimension.replace('utm_','')} for this period`);
                        else if(newList[0].revenue === 0 )
                            reject("all "+dimension.replace('utm_','')+" items still at 0$ threshold");
                        else 
                          resolve({topPerformance:newList[0],startDate:dates.date2,endDate:dates.date1});
                    }
                    else{
                       reject("there's no performing "+dimension.replace('utm_','')+ " for this period.")
                    }
                      
                    
                });
            });
                    
        });
    });
}


module.exports.revenueOfBestPerformingDailyDimension = (user_id,dimension,dimensionNum,arrangeDates,dateRange,startDate=null,endDate=null) => {

    return new Promise((resolve,reject) => {
        mongoConnect().then(({client,db}) => {
            const {date1,date2} = arrangeDatesTest(startDate,endDate);
            const dates = arrangeDates(startDate,endDate);
            const range = dateRange(date1,date2);
            let query = {'user_id' : 1};
            if(range)
                query = {'user_id' : 1,'day': range};
            else
                reject("there's no performing "+dimension.replace('utm_','')+ " for this period.")
                
            
            const queryDimension = singularize(dimension);
            db.collection('hbreportdaily').aggregate([
                {'$match' : query},
                {'$group' : {'_id' : '$' + queryDimension,'revenue' : {'$sum' : '$revenue'}}},
                {'$sort' : {'revenue' : -1}}
            ],function(err,cursor){
                if(err)
                  reject("there's no performing "+dimension+ " for this period.");
                 cursor.get((err,list)=> {
                    client.close();
                    if(err)
                       reject("there's no performing "+dimension+ " for this period.");
                    
                    const newList = filterResultList(list);
                    if (newList.length) {
                      if (newList[0]._id === null) reject("there's no performing " + dimension + ' for this period.');

                      if (newList[0].revenue === 0) reject('all ' + dimension + ' items still at 0$ threshold');
                      
                      if(dimensionNum){
                        resolve({
                            topPerformance: newList.slice(0, dimensionNum),
                            startDate: dates.date2,
                            endDate: dates.date1
                        });
                      }

                      if(checkPlural(dimension)) {
                        
                        resolve({
                          topPerformance: newList.slice(0, 3),
                          startDate: dates.date2,
                          endDate: dates.date1
                        });
                      }

                      resolve({
                        topPerformance: newList[0],
                        startDate: dates.date2,
                        endDate: dates.date1
                      });
                    }
                    else 
                       reject("there's no performing "+dimension+ " for this period.");
                 });
            });          
        });
    });
} 


const topPerformance = (array,dimension) => {
    let topItem = {total:0};

    return new Promise((resolve,reject) => {
        if(array.length){
            for(let i = 0 ; i < array.length ; i++){
                console.log(array[i]);
                if(topItem.total <= array[i].total && array[i][dimension] === null && 
                   dimension === "utm_source"){
                       topItem = array[i];
                       topItem.utm_source = 'organic';
                       continue;
                   }

                if(topItem.total <= array[i].total && array[i][dimension] !== null){
                    topItem = array[i] ;
                    //next();
                }
            }

            resolve(topItem);
        }
        else{
            console.log('array null');
            reject(null);
        }
    });

}

module.exports.testAggregate = (user_id,arrangeDates,dateRange,startDate=null,endDate=null) => {
    return new Promise((resolve,reject) => {
        mongoConnect().then(({client,db}) => {
            const {date1,date2} = arrangeDates(startDate,endDate);
            const range = dateRange(date1,date2);
            let query = {'user_id' : user_id};
            if(range)
                query = {'user_id' : user_id,'day': range};

            console.log(range);

            db.collection('hbreportdaily').aggregate([
                {'$match' : query},
                {'$group' : {'_id' : '$country','revenue' : {'$sum' : '$revenue'}}},
                {'$sort' : {'revenue' : -1}}
            ],function(err,results){
                client.close();
                if(err)
                  reject(err);

                resolve(results);
            });
        })
    });
}
