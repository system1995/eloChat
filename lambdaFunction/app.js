const asyncLoop = require('node-async-loop');
const {callbackFunction,arrangeDates,arrangeDates2,arrangeDatesTest,dateRange,formatRangesWithNumbers} = require('./helpers');
const {revenueTotal,revenueByGender,revenueByEachDevice,revenueOfBestCompaingnOrSourceOrBidder,
    revenueOfBestPerformingDailyDimension,testAggregate,aggregateExplanation,sessionsByAgeRange} = require('./metrics/revenues');
const {expenseTotal} = require('./metrics/expenses');
const {profitTotal} = require('./metrics/profit');
const {dailyBrief} = require('./metrics/dailyBrief');

/*revenueOfBestCompaingnOrSourceOrBidder(1,'bidder',arrangeDates,dateRange,'2018-03-26')
.then(({topPerformance,startDate, endDate}) => {
   console.log(topPerformance);
   console.log(startDate)
   console.log(endDate);
})
.catch(err=> console.log(err));*/

/*revenueByDevice(1,arrangeDates,dateRange,'2018-03')
.then(({revenues,startDate,endDate})=>{
    console.log(revenues);
    console.log(startDate);
    console.log(endDate)
}).catch(err=>console.log(err));*/

//console.log(formatRangesWithNumbers(7,'year'));




exports.handler = (event,context,callback) => {
        const intentName = event.currentIntent.name.toLowerCase();
        const userId = event.requestAttributes.user_id;
        const newUserId = parseInt(userId);

        if(intentName === "dailybrief"){

            dailyBrief(newUserId).then(comments => {
                 let message = 'your daily brief for yesterday:\n' ;

                 asyncLoop(comments,function (item,next) {
                      message += item + '.\n';
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
            const Date1 = event.currentIntent.slots.Date;
            const Date2 = event.currentIntent.slots.DateTwo;
            const dimension = event.currentIntent.slots.DimensionPerformance.toLowerCase();

            if(dimension === "country" || dimension === "device" || dimension === "os" || 
              dimension === "browser" || dimension === "ad_unit" || dimension === "ad_size"){
                revenueOfBestPerformingDailyDimension(newUserId,dimension,arrangeDates,dateRange,Date1,Date2)
                .then(({topPerformance,startDate, endDate}) => {
                    const message = "your top performing " + dimension+" for the given period is: " +
                       topPerformance._id+". Revenue was: "+topPerformance.revenue.toFixed(2)+"$"  ;
                       
                       var redirectPage;
                       if(dimension === "country") redirectPage = 'revenue';
                       else redirectPage = 'sessions';

                       callbackFunction(callback,message, {redirectPage : redirectPage, 
                                startDate: (startDate) ? startDate.toString() : endDate.toString(),
                                endDate: endDate.toString()});

                }).catch(err => {
                    const message = err.toString();
                    callbackFunction(callback, message, {});
                });
            }
            else{
                revenueOfBestCompaingnOrSourceOrBidder(newUserId,dimension,arrangeDates,dateRange,Date1,Date2)
                .then(({topPerformance,startDate, endDate}) => {
                    const message = "your top performing " +dimension.replace('utm_','')+ " for the given period is: " +
                       topPerformance._id + ". Revenue was: " + 
                       topPerformance.revenue.toFixed(2) + "$";
                    
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
        else if(intentName === "showreporttwo"){
            let metricTwo = event.currentIntent.slots.MetricTwo.toLowerCase();
            let Date1 = event.currentIntent.slots.FirstDate;
            let Date2 = event.currentIntent.slots.SecondDate;
           
            if(metricTwo === "revenue"){
                revenueTotal(newUserId,arrangeDates,Date1,Date2,null,arrangeDates2,dateRange)
                .then(({totalRevenue1,totalRevenue2,range1,range2}) => {
                    let progression = 
                       (totalRevenue2 - totalRevenue1)/totalRevenue1 * 100;
                    let message = "";

                    if(range2.date2 && range1.date2){
                       message = 'total revenue from '+range1.date2 +  ' to ' + 
                              range1.date1 +': ' + totalRevenue1 + '$. \n' + 
                             'total revenue from '+range2.date2 +  ' to ' + 
                              range2.date1 +': ' + totalRevenue2 + '$. \n' +
                             'Progression: ' + progression.toFixed(2) + "%";
                    }
                    else if(range2.date2 && !range1.date2){
                        message = 'total revenue in '+ range1.date1 + ' is: ' + totalRevenue1 + '$. \n' + 
                             'total revenue from '+range2.date2 +  ' to ' + 
                              range2.date1 +': ' + totalRevenue2 + '$. \n' +
                             'Progression: ' + progression.toFixed(2) + "%";
                    }
                    else if(!range2.date2 && range1.date2){
                        message = 'total revenue from '+range1.date2 +  ' to ' + 
                              range1.date1 +': ' + totalRevenue1 + '$.\n' + 
                             'total revenue in '+range2.date1+  ' is: '
                             + totalRevenue2 + '$.\n' +
                             'Progression: ' + progression.toFixed(2) + "%";
                    }
                    else {
                        message = 'total revenue in '+range1.date1 +  ' is: ' + totalRevenue1 + '$.\n' + 
                             'total revenue in '+range2.date1+  ' is:'
                             + totalRevenue2 + '$.\n' +
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
                                   'given period was: '+totalRevenueFemale+'$';
                                else 
                                   message = 'your total revenue for male gender for the '+
                                   'given period was: '+totalRevenueMale+'$';

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
                        console.log('device1');
                        revenueByEachDevice(newUserId,arrangeDates,dateRange,Date1,Date2)
                        .then(({revenues,startDate,endDate})=>{
                             var message = "";
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
                                    "given period was: " + revenueDesktop + "$";
                                    break;
                                 case 'mobile':
                                    message = "your total revenue from mobile device for the "+
                                    "given period was: " + revenueMobile + "$";
                                    break;
                                 case 'tablet':
                                    message = "your total revenue from tablet device for the "+
                                    "given period was: " + revenueTablet + "$";
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
                    else{
                        revenueTotal(newUserId, arrangeDates, Date1, Date2, Network)
                        .then(({totalRevenue, startDate, endDate}) => {
                            const message = 'your total revenue for the given period is :' +
                                totalRevenue + '$';

                            
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
                                    'female: ' + totalRevenueFemale + '$' + '\n' +
                                    'male: ' + totalRevenueMale + '$' ;

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
                               console.log('device2');
                               if(!Device){
                                console.log('device3');
                                    for(let i=0;i<revenues.length;i++){
                                        if(i === revenues.length -1){
                                                message += revenues[i]._id + ": " + revenues[i].revenue.toFixed(2) + "$";
                                                break;
                                        }

                                        message += revenues[i]._id + ": " + revenues[i].revenue.toFixed(2) + "$ -"; 
                                    }
                               }
                               else{
                                console.log('device4');
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
                                        "given period was: " + revenueDesktop + "$";
                                        break;
                                        case 'mobile':
                                        message = "your total revenue from mobile device for the "+
                                        "given period was: " + revenueMobile + "$";
                                        break;
                                        case 'tablet':
                                        message = "your total revenue from tablet device for the "+
                                        "given period was: " + revenueTablet + "$";
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

                }


            }
            else if(metric === "expense" && !Gender && !Device ){
                expenseTotal(newUserId,arrangeDates,Date1,Date2,Network).then(({totalExpense, startDate, endDate}) => {
                    const message = 'your total expenses for the given period is :' +
                        totalExpense + '$';
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
                    const message = 'your total profil for the given period is :' +
                        totalProfit + '$';
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








