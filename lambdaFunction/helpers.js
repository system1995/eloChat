var moment = require('moment');


exports.callbackFunction = (callback,resultMessage,sessionAttributes) => {
    
    callback(null, {
        "sessionAttributes" :sessionAttributes,
        "dialogAction" : {
            "type" : "Close",
            "fulfillmentState" : "Fulfilled",
            "message" : {
                "contentType" : "PlainText",
                "content" : resultMessage
            }
        }
    });
}

exports.arrangeDates2 = (date1,date2) => {
    if(date1 && date2){
        var formatedDate1 = null;
        var formatedDate2 = null;

        if(date1) {
            if(date1.includes('W')){
                formatedDate1 = moment(date1).format('Y-MM-DD');
            }
            else{
                formatedDate1 = moment(new Date(date1)).format('Y-MM-DD');
            }

        }

        if(date2) {
            if(date2.includes('W')){
                formatedDate2 = moment(date2).format('Y-MM-DD');
            }
            else {
                formatedDate2 = moment(new Date(date2)).format('Y-MM-DD');
            }
        }

        var range1 = {};
        var range2 = {};
        if(date1.length === 8 && date1.includes('W')){
            console.log('dkhaaal 8');
            range1 = {date1 : moment(formatedDate1).set('day',moment(formatedDate1).day() + 7).format('Y-MM-DD'),
                date2 : formatedDate1}
        }
        else if(date1.length === 7){
            console.log('dkhaaal 7');
            range1 = {date1 : moment(formatedDate1).set('month',moment(formatedDate1).month() + 1).format('Y-MM-DD'),
                date2 : formatedDate1}
        }
        else if(date1.length === 4 ){
            console.log('dkhaaal 4');
            range1 = {date1 : moment(formatedDate1).set('year',moment(formatedDate1).year() + 1).format('Y-MM-DD'),
               date2 : formatedDate1 }
        }
        else{
        
            range1 = {date1}
        }

        
        if(date2.length === 8 && date2.includes('W')){
            console.log('dkhaaal 8');
            range2= {date1 : moment(formatedDate2).set('day',moment(formatedDate2).day() + 7).format('Y-MM-DD'),
                date2 : formatedDate2}
        }
        else if(date2.length === 7){
            console.log('dkhaaal 7');
            range2= {date1 : moment(formatedDate2).set('month',moment(formatedDate2).month() + 1).format('Y-MM-DD'),
                date2 : formatedDate2}
        }
        else if(date2.length === 4 ){
            console.log('dkhaaal 4');
            range2= {date1 : moment(formatedDate2).set('year',moment(formatedDate2).year() + 1).format('Y-MM-DD'),
               date2 : formatedDate2 }
        }
        else 
            range2= {date1:date2}

        
        return {range1,range2}
 
    }
}

exports.arrangeDates = (date1,date2) => {

    var formatedDate1 = null;
    var formatedDate2 = null;

    if(!date1 && !date2){
        return {date1 : null, date2: null}
    }

    if(date1) {
        if(date1.includes('W')){
            formatedDate1 = moment(date1).format('Y-MM-DD');
        }
        else{
            formatedDate1 = moment(new Date(date1)).format('Y-MM-DD');
        }

    }

    if(date2) {
        if(date2.includes('W')){
            formatedDate2 = moment(date2).format('Y-MM-DD');
        }
        else {
            formatedDate2 = moment(new Date(date2)).format('Y-MM-DD');
        }
    }


    if(date1.length === 8 && date1.includes('W')){
        console.log('dkhaaal 8');
        return {date1 : moment(formatedDate1).set('day',moment(formatedDate1).day() + 7).format('Y-MM-DD'),
            date2 : formatedDate1}
    }
    if(date1.length === 7){
        console.log('dkhaaal 7');
        return {date1 : moment(formatedDate1).set('month',moment(formatedDate1).month() + 1).format('Y-MM-DD'),
            date2 : formatedDate1}
    }
    else if(date1.length === 4 ){
        console.log('dkhaaal 4');
        return {date1 : moment(formatedDate1).set('year',moment(formatedDate1).year() + 1).format('Y-MM-DD'),
           date2 : formatedDate1 }
    }
    else if(formatedDate1 && formatedDate2){
        if(formatedDate1 > formatedDate2)
            return {date1 : formatedDate1, date2 : formatedDate2}
        else
            return {date1 : formatedDate2, date2 : formatedDate1}
    }
    else if(formatedDate1){
        return {date1 : formatedDate1, date2 : null}
    }
    else
        return {date1 : null, date2: null}

}

exports.arrangeDatesTest = (date1,date2) => {

    var formatedDate1 = null;
    var formatedDate2 = null;

    if(!date1 && !date2){
        return {date1 : null, date2: null}
    }

    

    if(date1) {
        if(date1.includes('W')){
            formatedDate1 = moment(date1).format('Y-MM-DD');
            formatedDate1 = moment(new Date(formatedDate1) - 3600*24*90*1000).format('Y-MM-DD')
        }
        else{
            formatedDate1 = moment(new Date(date1)).format('Y-MM-DD');
            formatedDate1 = moment(new Date(formatedDate1) - 3600*24*90*1000).format('Y-MM-DD')
        }

    }

    if(date2) {
        if(date2.includes('W')){
            formatedDate2 = moment(date2).format('Y-MM-DD');
            formatedDate2 = moment(new Date(formatedDate2) - 3600*24*90*1000).format('Y-MM-DD')
        }
        else {
            formatedDate2 = moment(new Date(date2)).format('Y-MM-DD');
            formatedDate2 = moment(new Date(formatedDate2) - 3600*24*90*1000).format('Y-MM-DD')
        }
    }


    if(date1.length === 8 && date1.includes('W')){
        console.log('dkhaaal 8');
        return {date1 : moment(formatedDate1).set('day',moment(formatedDate1).day() + 7).format('Y-MM-DD'),
            date2 : formatedDate1}
    }
    if(date1.length === 7){
        console.log('dkhaaal 7');
        return {date1 : moment(formatedDate1).set('month',moment(formatedDate1).month() + 1).format('Y-MM-DD'),
            date2 : formatedDate1}
    }
    else if(date1.length === 4 ){
        console.log('dkhaaal 4');
        return {date1 : moment(formatedDate1).set('year',moment(formatedDate1).year() + 1).format('Y-MM-DD'),
           date2 : formatedDate1 }
    }
    else if(formatedDate1 && formatedDate2){
        if(formatedDate1 > formatedDate2)
            return {date1 : formatedDate1, date2 : formatedDate2}
        else
            return {date1 : formatedDate2, date2 : formatedDate1}
    }
    else if(formatedDate1){
        return {date1 : formatedDate1, date2 : null}
    }
    else
        return {date1 : null, date2: null}

}

exports.dateRange = (date1,date2) => {
    var dateRange ;

    if(date1 === "Invalid date" || date2 === "Invalid date"){
        console.log('dkhaal invalid');
        return null;
    }

    if(date1 && date2){
        dateRange = {'$lte': date1, '$gte': date2}
    }
    else if(date1){
        dateRange = {'$eq' : date1 } ;
    }
    else {
        dateRange = null;
    }

    return dateRange;
}

exports.formatRanges = (range1,range2) => {
    range1.date1 = moment(range1.date1).format('MMMM Do YYYY');
    range1.date2 = moment(range1.date2).format('MMMM Do YYYY');
    range2.date1 = moment(range2.date1).format('MMMM Do YYYY');
    range2.date2 = moment(range2.date2).format('MMMM Do YYYY');
    return {range1Formated:range1,range2Formated:range2}
}

exports.formatRangesWithNumbers = (number,daterange) => {
   const endDate = moment().format('Y-MM-DD');
   var startDate = null;
   
   if(daterange === "day"){
       if(number>400 && number<=1)
         return null 
       
       startDate = moment(endDate).set('day',moment(endDate).day()-number).format('Y-MM-DD');
       
   }
   else if(daterange === "week"){
       if(number>55 && number <= 1)
         return null
        
        startDate=moment(endDate).set('week',moment(endDate).week()-number).format('Y-MM-DD');
   }
   else if(daterange === "month"){
      if(number>15 && number <= 1)
        return null

        startDate=moment(endDate).set('month',moment(endDate).month()-number).format('Y-MM-DD');
   }
   else if(daterange === "year"){
       if(number>3 && number <= 1)
        return null

        startDate=moment(endDate).set('year',moment(endDate).year()-number).format('Y-MM-DD');
   }
   else 
     return null;

   return {startDate,endDate};
}