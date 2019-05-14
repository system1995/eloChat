const asyncLoop = require('node-async-loop');
const {callbackFunction,customCallbackFunction,arrangeDates,
       arrangeDates2,arrangeDatesTest,dateRange,singularize,checkPlural,
       formatRangesWithNumbers} = require('./helpers');
const {revenueTotal,revenueTotalVersus,revenueByGender,revenueByCountry,revenueByEachDevice,revenueByOS,revenueOfBestCompaingnOrSourceOrBidder,
    revenueOfBestPerformingDailyDimension,testAggregate,aggregateExplanation,sessionsByAgeRange} = require('./metrics/revenues');
const {expenseTotal} = require('./metrics/expenses');
const {profitTotal} = require('./metrics/profit');
const {dailyBrief} = require('./metrics/dailyBrief');
const {pageVisibility} = require('./metrics/visibility');
const {fillRateOfBestPerformingDailyDimension,
    fillRateOfBestCompaingnOrSourceOrBidder} = require('./metrics/fillRate');

/*dailyBrief(1,'monthly').then(comments=>{
   console.log(comments)
})
.catch(err=>console.log(err))*/


/*revenueTotal(1000,arrangeDates,'2018-03',null,'adblade')
.then(({totalRevenue,startDate,endDate})=>{
    console.log(totalRevenue)
    console.log(startDate)
    console.log(endDate)
})*/


exports.intent = (event,context,callback) => {
        const intentName = event.currentIntent.name.toLowerCase();
        const userId = event.requestAttributes.user_id;
        const newUserId = parseInt(userId);


        if(intentName === "dailybrief"){
            const period = event.currentIntent.slots.Period.toLowerCase();


            dailyBrief(newUserId,period).then(comments => {
                 let message;
                 message=`your ${period} brief: `;
                 
                 asyncLoop(comments,function (item,next) {
                      message += item + '. ';
                      next();
                 },function () {
                     callbackFunction(callback, message, {redirectPage: 'dailybrief'});
                 });


            }).catch(err => {
                const message = err.toString();
                console.log("Step err")
                callbackFunction(callback, message, {});
            })

        }
        else if(intentName === "performancereport"){
            let Date1 = event.currentIntent.slots.Date;
            let Date2 = event.currentIntent.slots.DateTwo;
            let dimension = event.currentIntent.slots.DimensionPerformance.toLowerCase()
            let daterange = event.currentIntent.slots.DateRange
            let datenum = event.currentIntent.slots.NumDate
            let dimensionNum = event.currentIntent.slots.Num
            let Metric = event.currentIntent.slots.Metric


            if(daterange && datenum){
                const range = formatRangesWithNumbers(datenum,daterange.toLowerCase());
                if(range){
                    Date1 = range.startDate;
                    Date2 = range.endDate;
                }
                else{
                    const message="you gave an innapropriate number";
                    callbackFunction(callback,message, {});
                    return;
                }
            }
            
            if(dimension.includes("page")){
                pageVisibility(newUserId,arrangeDates,dateRange,Date1,Date2)
                .then(({topPerformance,startDate,endDate})=>{
                     let message;
                     if(dimension==="page" && !dimensionNum){
                        const topItem = topPerformance[0];
                        message = 'The best performing page is: ' + 
                                topItem._id + '. The visibility rate was: ' + 
                                topItem.visibility +'%';
                     }
                     else{
                        let topItems;
                        if(!dimensionNum){
                           topItems = topPerformance.slice(0,3);
                           message= 'the 3 best performing pages regarding visibility rate are: ';
                        }
                        else{
                            topItems = topPerformance.slice(0,dimensionNum);
                            message="the "+dimensionNum+" best performing pages regarding visibility rate are: ";
                        }

                        for(let i=0;i<topItems.length;i++){
                            let rank = (i+1).toString();
                            if(i===topItems.length-1){
                               message += rank + '. ' + topItems[i]._id +': ' + topItems[i].visibility +
                               '%'; 
                               break;
                            }

                            message += rank + '. ' + topItems[i]._id +': ' + topItems[i].visibility +
                              '% - '; 
                              
                        }
                     }

                     if(endDate){ 
                        callbackFunction(callback, message, {
                            redirectPage: 'sessions',
                            startDate: startDate
                                ? startDate.toString()
                                : endDate.toString(),
                            endDate: endDate.toString()
                        });
                     }
                     else{
                        callbackFunction(callback, message, {
                            redirectPage: 'sessions'
                            });
                     }
                })
                .catch(err=>{
                    const message = err.toString();
                    callbackFunction(callback, message, {});
                });
            }
            else if(dimension === "country"||dimension === "countries"||dimension.includes("device")||
              dimension.includes("os")||dimension.includes("browser")|| 
              dimension.includes("ad_unit")||dimension.includes("ad_size")){
                if(Metric && Metric.toLowerCase() === 'fill'){
                    fillRateOfBestPerformingDailyDimension(newUserId,dimension,dimensionNum,arrangeDates,dateRange,Date1,Date2)
                    .then(({topPerformance,startDate, endDate})=>{
                       let message;
                       if(Array.prototype.isPrototypeOf(topPerformance)){
                           message="your top " + topPerformance.length + 
                                   " performing " + dimension + " regarding fill rate are: ";
                                   
                            for(let i=0;i<topPerformance.length;i++){
                                let ranking = (i+1).toString();
                                if(i === topPerformance.length-1){
                                    message += ranking + '. ' + topPerformance[i]._id + ': ' + topPerformance[i].fillRate+ '%.';
                                    break;
                                }

                                message += ranking + ". " + topPerformance[i]._id + ": " + topPerformance[i].fillRate+"%. -";
                            } 
                       }
                       else{
                            message = "The top performing " + dimension+" was: " +
                            topPerformance._id+". Fill rate was: "+topPerformance.fillRate+ "%" ;
                       }

                        var redirectPage;
                        if (dimension === 'country' || dimension === "countries" || dimension.includes("browser")) redirectPage = 'revenue';
                        else redirectPage = 'sessions';


                        callbackFunction(callback, message, {
                            redirectPage: redirectPage,
                            startDate: startDate
                                ? startDate.toString()
                                : endDate.toString(),
                            endDate: endDate.toString()
                          });
                    })
                    .catch(err=>{
                        const message = err.toString();
                        callbackFunction(callback, message, {});
                    })
                }
                else{
                revenueOfBestPerformingDailyDimension(newUserId,dimension,dimensionNum,arrangeDates,dateRange,Date1,Date2)
                .then(({topPerformance,startDate, endDate}) => {
                    let message ;
 
                    if(Array.prototype.isPrototypeOf(topPerformance)){
                       message = "your top " + topPerformance.length + 
                             " performing " + dimension + " for the given period are: " ;
                            
                             for(let i=0;i<topPerformance.length;i++){
                                   let ranking = (i+1).toString();
                                   if(i === topPerformance.length-1){
                                       message += ranking + '. ' + topPerformance[i]._id + ': $' + topPerformance[i].revenue.toFixed(2)+ '.';
                                       break;
                                   }
                                   message += ranking + ". " + topPerformance[i]._id + ": $" + topPerformance[i].revenue.toFixed(2)+". -";
                             } 
                    }
                    else{
                       message = "your top performing " + dimension+" for the given period is: " +
                       topPerformance._id+". Revenue was: $"+topPerformance.revenue.toFixed(2)  ;
                    }

                    var redirectPage;
                    if (dimension === 'country' || dimension === "countries" || dimension.includes("browser")) redirectPage = 'revenue';
                    else redirectPage = 'sessions';


                    callbackFunction(callback, message, {
                      redirectPage: redirectPage,
                      startDate: startDate
                        ? startDate.toString()
                        : endDate.toString(),
                      endDate: endDate.toString()
                    });

                }).catch(err => {
                    const message = err.toString();
                    callbackFunction(callback, message, {});
                });
               }
            }
            else{
                if(Metric && Metric.toLowerCase()==='fill'){
                    fillRateOfBestCompaingnOrSourceOrBidder(newUserId,dimension,dimensionNum,arrangeDates,dateRange,Date1,Date2)
                    .then(({topPerformance,startDate,endDate})=>{
                       let message;
                       if(Array.prototype.isPrototypeOf(topPerformance)){
                           message="your top " + topPerformance.length + 
                                   " performing " + dimension.replace('utm_','') + " regarding fill rate are: ";
                                   
                            for(let i=0;i<topPerformance.length;i++){
                                let ranking = (i+1).toString();
                                if(i === topPerformance.length-1){
                                    message += ranking + '. ' + topPerformance[i]._id + ': ' + topPerformance[i].fillRate+ '%.';
                                    break;
                                }

                                message += ranking + ". " + topPerformance[i]._id + ": " + topPerformance[i].fillRate+"%. -";
                            } 
                       }
                       else{
                            message = "The top performing " + dimension.replace('utm_','')+" was: " +
                            topPerformance._id+". Fill rate was: "+topPerformance.fillRate + "%" ;
                       }

                       var redirectPage;
                       if (dimension === 'bidder') redirectPage = 'hbAnalytics';
                       else redirectPage = 'revenue';


                        callbackFunction(callback, message, {
                            redirectPage: redirectPage,
                            startDate: startDate
                                ? startDate.toString()
                                : endDate.toString(),
                            endDate: endDate.toString()
                          });
                    })
                    .catch(err => {
                        const message = err.toString();
                        callbackFunction(callback, message, {});
                    });
                }
                else{
                revenueOfBestCompaingnOrSourceOrBidder(newUserId,dimension,dimensionNum,arrangeDates,dateRange,Date1,Date2)
                .then(({topPerformance,startDate, endDate}) => {
                    let message;
                    if(Array.prototype.isPrototypeOf(topPerformance)){
                        message = 'your top ' + topPerformance.length + ' performing '+dimension.replace('utm_','')+' for the given period are: ';

                        for (let i = 0; i < topPerformance.length; i++) {
                          let ranking = (i + 1).toString();
                          if (i === topPerformance.length - 1) {
                            message += ranking + '. ' + topPerformance[i]._id + ': $' + topPerformance[i].revenue.toFixed(2) + '.';
                            break;
                          }
                          message += ranking + '. ' + topPerformance[i]._id + ': $' + topPerformance[i].revenue.toFixed(2) + '. -';
                        } 
                    }
                    else{
                         message = "your top performing " +dimension.replace('utm_','')+ " for the given period is: " +
                                    topPerformance._id + ". Revenue was: $" + 
                                    topPerformance.revenue.toFixed(2);
                    }
                    
                        var redirectPage;
                        if (dimension === 'bidder') redirectPage = 'hbAnalytics';
                        else redirectPage = 'revenue';

                       callbackFunction(callback,message, {redirectPage : redirectPage, 
                                startDate: (startDate) ? startDate.toString() : endDate.toString(),
                                endDate: endDate.toString()});

                }).catch(err => {
                    const message = err.toString();
                    callbackFunction(callback, message, {});
                });
               }
            }
        }
        else if(intentName === "showreporttwo"){
            let metricTwo = event.currentIntent.slots.MetricTwo.toLowerCase();
            let Date1 = event.currentIntent.slots.FirstDate;
            let Date2 = event.currentIntent.slots.SecondDate;
           
            if(metricTwo === "revenue"){
                revenueTotalVersus(newUserId,arrangeDates2,dateRange,null,Date1,Date2)
                .then(({totalRevenue1,totalRevenue2,range1,range2}) => {
                    let progression = 
                       (totalRevenue2 - totalRevenue1)/totalRevenue1 * 100;
                    let message = "";

                    if(range2.date2 && range1.date2){
                       message = 'total revenue from '+range1.date2 +  ' to ' + 
                              range1.date1 +': $' + totalRevenue1 + '. \n' + 
                             'total revenue from '+range2.date2 +  ' to ' + 
                              range2.date1 +': $' + totalRevenue2 + '. \n' +
                             'Progression: ' + progression.toFixed(2) + "%";
                    }
                    else if(range2.date2 && !range1.date2){
                        message = 'total revenue in '+ range1.date1 + ' is: $' + totalRevenue1 + '. \n' + 
                             'total revenue from '+range2.date2 +  ' to ' + 
                              range2.date1 +': $' + totalRevenue2 + '. \n' +
                             'Progression: ' + progression.toFixed(2) + "%";
                    }
                    else if(!range2.date2 && range1.date2){
                        message = 'total revenue from '+range1.date2 +  ' to ' + 
                              range1.date1 +': $' + totalRevenue1 + '.\n' + 
                             'total revenue in '+range2.date1+  ' is: $'
                             + totalRevenue2 + '.\n' +
                             'Progression: ' + progression.toFixed(2) + "%";
                    }
                    else {
                        message = 'total revenue in '+range1.date1 +  ' is: $' + totalRevenue1 + '.\n' + 
                             'total revenue in '+range2.date1+  ' is: $'
                             + totalRevenue2 + '.\n' +
                             'Progression: ' + progression.toFixed(2) + "%";
                    }
                             
                        

                    
                    callbackFunction(callback, message, {});
                }).catch(err => {
                    const message = err.toString();
                    callbackFunction(callback, message, {});
                });
            }
            else if(metricTwo === "expense"){
              console.log('expense')
              callbackFunction(callback, "expense", {});
            }
            else if(metricTwo === "profit"){
                console.log('profit')
              callbackFunction(callback, "profit", {});
            }
            else{
                const message = "I can't identify this metric";
                callbackFunction(callback,message,{});
            }
        }
        else if(intentName === "showreport" ){
            
            let metric = event.currentIntent.slots.Metric.toLowerCase() ;
            let Date1 = event.currentIntent.slots.Date;
            let Date2 = event.currentIntent.slots.DateTwo;
            let dimension = event.currentIntent.slots.Dimension;
            let Network = event.currentIntent.slots.ADNetwork;
            let Gender = event.currentIntent.slots.Gender;
            let Device = event.currentIntent.slots.Device;
            let os = event.currentIntent.slots.Os;
            let daterange = event.currentIntent.slots.DateRange;
            let number = event.currentIntent.slots.Num;

            if(metric && daterange && number){
                    const range = formatRangesWithNumbers(number,daterange.toLowerCase());
                    if(range){
                        Date1 = range.startDate;
                        Date2 = range.endDate;
                    }
                    else{
                        const message="you gave an innapropriate number";
                        callbackFunction(callback,message, {});
                        return;
                    }
            }
                
            

            if(metric === "revenue" ){
                if(!dimension) {
                    if(Gender){
                        revenueByGender(newUserId,arrangeDates,dateRange,Date1,Date2)
                        .then(({totalRevenueFemale,totalRevenueMale,startDate,endDate})=>{
                                var message = ""
                                if(Gender.toLowerCase() === "female")
                                   message = 'your total revenue for female gender for the '+
                                   'given period was: $'+totalRevenueFemale;
                                else 
                                   message = 'your total revenue for male gender for the '+
                                   'given period was: $'+totalRevenueMale;

                                callbackFunction(callback, message, {
                                    redirectPage: 'sessions',
                                    startDate: (startDate)? startDate.toString() : endDate.toString(),
                                    endDate: endDate.toString()
                                });
                        })
                        .catch(err=>{
                            const message = err.toString();
                            callbackFunction(callback, message, {});
                        });

                    }
                    else if(Device){
                        
                        revenueByEachDevice(newUserId,arrangeDates,dateRange,Date1,Date2)
                        .then(({revenues,startDate,endDate})=>{
                            
                             let message = "";
                             let revenueDesktop=0,revenueTablet=0,revenueMobile=0;
                             for(let i=0;i<revenues.length;i++){
                                 if(revenues[i]._id.toLowerCase() === 'desktop' )
                                    revenueDesktop = revenues[i].revenue.toFixed(2);
                                 
                                 if(revenues[i]._id.toLowerCase() === 'mobile')
                                    revenueMobile = revenues[i].revenue.toFixed(2);
                                 
                                 if(revenues[i]._id.toLowerCase() === 'tablet')
                                    revenueTablet = revenues[i].revenue.toFixed(2);
                             }

                             switch (Device.toLowerCase()) {
                                 case 'desktop':
                                    message = "your total revenue from desktop device for the "+
                                    "given period was: $" + revenueDesktop;
                                    break;
                                 case 'mobile':
                                    message = "your total revenue from mobile device for the "+
                                    "given period was: $" + revenueMobile;
                                    break;
                                 case 'tablet':
                                    message = "your total revenue from tablet device for the "+
                                    "given period was: $" + revenueTablet;
                                    break;
                                 default:
                                    message = "sorry didn't find the device you're looking for "+
                                    "in our database";
                                    break;
                             }

                             callbackFunction(callback,message,{
                                redirectPage: 'sessions',
                                startDate: (startDate) ? startDate.toString() : endDate.toString(),
                                endDate: endDate.toString()
                             });
                        })
                        .catch(err=>{
                            const message = err.toString();
                            callbackFunction(callback, message, {});
                        })
                    }
                    else if(os){
                        revenueByOS(newUserId,arrangeDates,dateRange,Date1,Date2)
                        .then(({revenues,startDate,endDate})=>{
                            
                             let message = "";
                             let revenueMac=0,revenueWindows=0,revenueLinux=0;
                             for(let i=0;i<revenues.length;i++){
                                 if(revenues[i]._id.toLowerCase().includes('mac') )
                                    revenueMac += revenues[i].revenue;
                                 
                                 if(revenues[i]._id.toLowerCase().includes('windows'))
                                    revenueWindows += revenues[i].revenue;
                                 
                                 if(revenues[i]._id.toLowerCase().includes('linux'))
                                    revenueLinux += revenues[i].revenue;
                             }

                             switch (os.toLowerCase()) {
                                 case 'mac':
                                    message = "your total revenues from mac os for the "+
                                    "given period was: $" + revenueMac.toFixed(2);
                                    break;
                                 case 'windows':
                                    message = "your total revenues from windows os for the "+
                                    "given period was: $" + revenueWindows.toFixed(2);
                                    break;
                                 case 'linux':
                                    message = "your total revenues from linux os for the "+
                                    "given period was: $" + revenueLinux.toFixed(2);
                                    break;
                                 default:
                                    message = "sorry didn't find the os you're looking for "+
                                    "in our database";
                                    break;
                             }

                             callbackFunction(callback,message,{
                                redirectPage: 'revenue',
                                startDate: (startDate) ? startDate.toString() : endDate.toString(),
                                endDate: endDate.toString()
                             });
                        })
                        .catch(err=>{
                            const message = err.toString();
                            callbackFunction(callback, message, {});
                        })
                    }
                    else{
                        console.log('network:' + Network)
                        revenueTotal(newUserId, arrangeDates, Date1, Date2, Network)
                        .then(({totalRevenue, startDate, endDate}) => {
                            const message = 'your total revenue for the given period is : $' +
                                totalRevenue;

                            
                            callbackFunction(callback, message, {
                                redirectPage: 'revenue',
                                startDate: (startDate) ? startDate.toString() : endDate.toString(),
                                endDate: endDate.toString()
                            });
                        }).catch(err => {
                            const message = err.toString();
                            callbackFunction(callback, message, {});
                        });
                    }  
                }
                else {
                    if(dimension.toLowerCase() === 'gender'){
                        revenueByGender(newUserId,arrangeDates,dateRange,Date1,Date2)
                            .then(({totalRevenueFemale,totalRevenueMale, startDate, endDate}) => {
                                const message = 'your total revenue by gender for the given period is:\n' +
                                    'female: $' + totalRevenueFemale + '\n' +
                                    'male: $' + totalRevenueMale ;

                                callbackFunction(callback, message, {
                                    redirectPage: 'sessions',
                                    startDate: (startDate) ? startDate.toString() : endDate.toString(),
                                    endDate: endDate.toString()
                                });

                            }).catch(err=> {
                            const message = err.toString();
                            callbackFunction(callback,message,{});
                            });
                    }

                    if(dimension.toLowerCase() === 'age'){
                        sessionsByAgeRange(newUserId,arrangeDates,dateRange,Date1,Date2)
                          .then(({sessions,startDate,endDate})=> {
                            var message = 'the sessions by age range:\n ';
                            for(let i=0;i<sessions.length;i++){
                                if(i === sessions.length -1){
                                    message += sessions[i]._id + ': ' + sessions[i].sessions ; 
                                    break;
                                }
                                message += sessions[i]._id + ': ' + sessions[i].sessions + '- ' ;  
                            }
                               

                            callbackFunction(callback, message, {
                                redirectPage: 'sessions',
                                startDate: (startDate) ? startDate.toString() : endDate.toString(),
                                endDate: endDate.toString()
                            });

                          }).catch(err=>{
                            const message = err.toString();
                            callbackFunction(callback,message,{});
                          });
                    }
                    
                    if(dimension.toLowerCase() === 'device'){
                        revenueByEachDevice(newUserId,arrangeDates,dateRange,Date1,Date2)
                           .then(({revenues,startDate,endDate})=>{
                               var message = "";
                               
                               if(!Device){
                                
                                    for(let i=0;i<revenues.length;i++){
                                        if(i === revenues.length -1){
                                                message += revenues[i]._id + ": $" + revenues[i].revenue.toFixed(2);
                                                break;
                                        }

                                        message += revenues[i]._id + ": $" + revenues[i].revenue.toFixed(2) + " -"; 
                                    }
                               }
                               else{
                               
                                    var revenueDesktop=0,revenueTablet=0,revenueMobile=0;
                                    for(let i=0;i<revenues.length;i++){
                                        if(revenues[i]._id.toLowerCase() === 'desktop' )
                                        revenueDesktop = revenues[i].revenue.toFixed(2);
                                        
                                        if(revenues[i]._id.toLowerCase() === 'mobile')
                                        revenueMobile = revenues[i].revenue.toFixed(2);
                                        
                                        if(revenues[i]._id.toLowerCase() === 'tablet')
                                        revenueTablet = revenues[i].revenue.toFixed(2);
                                    }
    
                                    switch (Device.toLowerCase()) {
                                        case 'desktop':
                                        message = "your total revenue from desktop device for the "+
                                        "given period was: $" + revenueDesktop;
                                        break;
                                        case 'mobile':
                                        message = "your total revenue from mobile device for the "+
                                        "given period was: $" + revenueMobile;
                                        break;
                                        case 'tablet':
                                        message = "your total revenue from tablet device for the "+
                                        "given period was: $" + revenueTablet;
                                        break;
                                        default:
                                        message = "sorry didn't find the device you're looking for "+
                                        "in our database";
                                    
                                    }
                                }

                               callbackFunction(callback,message,{
                                    redirectPage: 'sessions',
                                    startDate: (startDate) ? startDate.toString() : endDate.toString(),
                                    endDate: endDate.toString()
                               });
                           })
                           .catch(err=>{
                            const message = err.toString();
                            callbackFunction(callback,message,{});
                           });
                    }
                    
                    if(dimension.toLowerCase() === 'country'){
                        revenueByCountry(newUserId,arrangeDates,dateRange,Date1,Date2)
                        .then(({revenues,startDate,endDate})=>{
                            const topRevenues = revenues.slice(0,5);
                            let message = "your revenues by top countries were: ";
                            for(let i=0;i<topRevenues.length;i++){
                                const rank = (i+1).toString()
                                if(i===topRevenues.length-1){
                                    message += rank + ". " + topRevenues[i]._id + 
                                   ": $" + topRevenues[i].revenue.toFixed(2);
                                   break;
                                }

                                message += rank + ". " + topRevenues[i]._id + 
                                   ": $" + topRevenues[i].revenue.toFixed(2)+" - ";
                                   
                            }

                            callbackFunction(callback,message,{
                                redirectPage: 'revenue',
                                startDate: (startDate) ? startDate.toString() : endDate.toString(),
                                endDate: endDate.toString()
                            });
                        })
                        .catch(err=>{
                            const message = err.toString();
                            callbackFunction(callback,message,{});
                        });
                    }

                }


            }
            else if(metric === "expense" && !Gender && !Device ){
                expenseTotal(newUserId,arrangeDates,Date1,Date2,Network).then(({totalExpense, startDate, endDate}) => {
                    const message = 'your total expenses for the given period is : $' +
                        totalExpense;
                    callbackFunction(callback,message,{redirectPage : 'revenue',
                        startDate:(startDate)? startDate.toString() : endDate.toString(),
                        endDate: endDate.toString() });
                }).catch(err => {
                    const message = err.toString();
                    callbackFunction(callback,message,{redirectPage : 'revenue'});
                });
            }
            else if(metric === "profit" && !Gender && !Device ){
                profitTotal(newUserId,arrangeDates,Date1,Date2,Network).then(({totalProfit,startDate, endDate}) => {
                    const message = 'your total profil for the given period is : $' +
                        totalProfit;
                    callbackFunction(callback,message,{redirectPage : 'revenue',
                        startDate: (startDate)? startDate.toString() : endDate.toString(),
                        endDate: endDate.toString() });
                }).catch(err => {
                    const message = err.toString();
                    callbackFunction(callback,message,{redirectPage : 'revenue'});
                });
            }
            else{
                const message = "I can't identify what you are looking for :(";
                callbackFunction(callback,message,{});
            }
        }
        else {
           callbackFunction(callback,"couldn't recognize your intent", {});
        }



}








