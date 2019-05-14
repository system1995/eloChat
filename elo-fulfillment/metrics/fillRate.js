var mongoConnect = require('../mongoConfig');
const {formatRanges,arrangeDatesTest,checkPlural,singularize,filterResultList,
       mapResultList} = require('../helpers');

exports.fillRateOfBestCompaingnOrSourceOrBidder = (user_id,dimension,dimensionNum,arrangeDates,dateRange,startDate=null,endDate=null)=>{
    
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
                {'$group' : {'_id' : '$' + queryDimension,'request' : {'$sum' : '$requests'},
                             'imps': {'$sum':'$impressions'}}}
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

                            for(let i=0;i<newList.length;i++){
                                if(newList[i].request=== 0 || newList[i].imps=== 0){
                                    newList[i].fillRate= 0
                                    continue
                                }
                                
                                let impressions= parseFloat(newList[i].imps)
                                let requests = parseFloat(newList[i].request)
                                let fillRate= (impressions/requests)*100
                                newList[i].fillRate= fillRate.toFixed(2)
                            }

                            newList.sort((a,b)=>{
                                return b.fillRate - a.fillRate
                            });


                            if(!newList.length)
                                reject(`no performance information can be provided about ${dimension.replace('utm_','')} for this period`)
                            
                            
                            if(dimensionNum)
                                resolve({topPerformance:newList.slice(0,dimensionNum),
                                    startDate:dates.date2,endDate:dates.date1})

                            resolve({topPerformance:newList.slice(0,3),
                                     startDate:dates.date2,endDate:dates.date1})
                        }

                        list.sort((a,b)=>{
                            return b.fillRate - a.fillRate
                        });


                        if(list[0]._id === null && dimension === "utm_source"){
                            let fillRate= (newList[0].imps/newList[0].request)*100
                            fillRate = fillRate.toFixed(2);
                            const _id = "organic";
                            resolve({topPerformance:{_id,fillRate},startDate:dates.date2,endDate:dates.date1});
                        }

                        const newList = list.filter(item=>item._id !== null);
                        
                        if(!newList.length)
                            reject(`no performances to provide about ${dimension.replace('utm_','')} for this period`);
                        else{
                          for(let i=0;i<newList.length;i++){
                            if(newList[i].request===0||newList[i].imps===0){
                                newList[i].fillRate=0
                                continue;
                            }

                            let fillRate= (newList[i].imps/newList[i].request)*100
                            newList[i].fillRate=fillRate.toFixed(2)
                          }

                          newList.sort((a,b)=>{
                            return b.fillRate - a.fillRate
                          });
                          
                          if(newList[0].fillRate===0)
                            reject("all "+dimension.replace('utm_','')+" items still at 0$ threshold");
                          else 
                            resolve({topPerformance:newList[0],startDate:dates.date2,endDate:dates.date1});
                        }
                    }
                    else{
                       reject("there's no performing "+dimension.replace('utm_','')+ " for this period.")
                    }
                      
                    
                });
            });
                    
        });
    });
}

exports.fillRateOfBestPerformingDailyDimension = (user_id,dimension,dimensionNum,arrangeDates,dateRange,startDate=null,endDate=null) => {

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
                {'$group' : {'_id' : '$' + queryDimension,'request' : {'$sum' : '$requests'},
                             'imps': {'$sum':'$impressions'}}},
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
                      
                      for(let i=0;i<newList.length;i++){
                        if(newList[i].request===0 || newList[i].imps===0){
                            newList[i].fillRate = 0
                            continue
                        }
                        
                        let fillRate = (newList[i].imps/newList[i].request)*100
                        newList[i].fillRate= fillRate.toFixed(2)
                      }

                      if (newList[0].fillRate === 0) reject('all ' + dimension + ' items still at 0$ threshold');
                      
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