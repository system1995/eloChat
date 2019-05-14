var moment = require('moment');
var pluralize = require('pluralize');


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

exports.customCallbackFunction = (callback,resultMessage,sessionAttributes)=>{
    callback(null,{
        "sessionAttributes" :sessionAttributes,
        "dialogAction" : {
            "type" : "Close",
            "fulfillmentState" : "Fulfilled",
            "message" : {
                "contentType" : "CustomPayload",
                "content" : resultMessage
            }
        }
    })
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
            let formatedMonth = moment(formatedDate1).set('month',moment(formatedDate1).month() + 1).format('Y-MM-DD');
            range1 = {date1 : moment(formatedMonth).set('day',moment(formatedMonth).day() - 1).format('Y-MM-DD'),
                date2 : formatedDate1}
        }
        else if(date1.length === 4 ){
            console.log('dkhaaal 4');
            let formatedYear = moment(formatedDate1).set('year',moment(formatedDate1).year() + 1).format('Y-MM-DD')
            range1 = {date1 : moment(formatedYear).set('day',moment(formatedYear).day() - 1).format('Y-MM-DD'),
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
            let formatedMonth2 = moment(formatedDate2).set('month',moment(formatedDate2).month() + 1).format('Y-MM-DD');
            range2= {date1 : moment(formatedMonth2).set('day',moment(formatedMonth2).day() - 1).format('Y-MM-DD'),
                date2 : formatedDate2}
        }
        else if(date2.length === 4 ){
            console.log('dkhaaal 4');
            let formatedYear2 = moment(formatedDate2).set('year',moment(formatedDate2).year() + 1).format('Y-MM-DD')
            range2= {date1 : moment(formatedYear2).set('year',moment(formatedYear2).day() - 1).format('Y-MM-DD'),
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
        let formatedMonth = moment(formatedDate1).set('month',moment(formatedDate1).month() + 1).format('Y-MM-DD');
        return {date1 : moment(formatedMonth).set('day',moment(formatedMonth).day() - 1).format('Y-MM-DD'),
            date2 : formatedDate1}
    }
    else if(date1.length === 4 ){
        console.log('dkhaaal 4');
        let formatedYear = moment(formatedDate1).set('year',moment(formatedDate1).year() + 1).format('Y-MM-DD')
        return {date1 : moment(formatedYear).set('day',moment(formatedYear).day() - 1).format('Y-MM-DD'),
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
        let formatedMonth = moment(formatedDate1).set('month',moment(formatedDate1).month() + 1).format('Y-MM-DD');
        return {date1 : moment(formatedMonth).set('day',moment(formatedMonth).day() - 1).format('Y-MM-DD'),
                date2 : formatedDate1}
    }
    else if(date1.length === 4 ){
        console.log('dkhaaal 4');
        let formatedYear = moment(formatedDate1).set('year',moment(formatedDate1).year() + 1).format('Y-MM-DD')
        return {date1 : moment(formatedYear).set('day',moment(formatedYear).day() - 1).format('Y-MM-DD'),
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

exports.checkMonthExistence = (text) => {
  let months = ['january','february','march','april','may','june','july', 
                  'august','september','october','november','december']

  for(let i= 0;i<months.length;i++){
    if(text.includes(months[i])){
       var currentYear = new Date().getFullYear().toString();
       const currentMonth = new Date().getMonth().toString();
       
       if(currentMonth < i)
          currentYear = currentYear - 1;
       const date = months[i] +" "+ currentYear;
       var part1 = text.slice(0,text.indexOf(months[i]));
       console.log(text.indexOf(months[i])+ months[i].length)
       var part2 = text.slice(text.indexOf(months[i])+ months[i].length,text.length);
       
       return part1.concat(date,part2);
    }
  }
  
  return text;
}

function checkPlural(dimension){
    if(pluralize.isSingular(dimension))
      return false;

    return true;
}

exports.checkPlural = checkPlural;

exports.singularize = (dimension)=>{
    if(checkPlural(dimension))
      return pluralize.singular(dimension)

    return dimension;
}

exports.filterResultList = (list) => {
    return list.filter(item => item._id !== null)
}

exports.mapResultList = (list) => {
    return list.map(item=>{
        if(!item._id){
           item._id = "organic";
           return item
        }
        return item
    })
}