'use strict';

const {validateShowReportIntent,validateAnyIntent,validateVisibilityReportIntent} = require('./validation');
const {delegate} = require('./lexResponses');
const {checkMonthExistence} = require('./helpers');
const {checkNum} = require('./slots/generalSlots')

console.log(checkNum('10 past weeks revenue','week'))




module.exports.intent = (event, context, callback) => {
  const currentIntentName = event.currentIntent.name.toLowerCase();
  const text = event.inputTranscript
  const invocation = event.invocationSource;
  const sessionAttributes = event.sessionAttributes


  console.log(`event.bot.name=${event.bot.name}`);
  if(currentIntentName === "showreport" || currentIntentName === "showreporttwo" || 
     currentIntentName === "performancereport" ){
    
    const {success,date} =checkMonthExistence(text);
    if(success){
       let slots = event.currentIntent.slots;
       slots['Date']=date;
       callback(null,delegate({},slots));
       return;
    }

    if(currentIntentName === "showreport"){
        console.log('validate intent show report')
        const res = validateShowReportIntent(event);
        callback(null,res);
    }
    else if(currentIntentName === "performancereport"){
        const res = validateVisibilityReportIntent(event);
        callback(null,res);
    }
    else{
      console.log('no intent');
      const res = validateAnyIntent(event);
      callback(null,res);
    }
  }
  else{
      console.log('no intent');
      const res = validateAnyIntent(event);
      callback(null, res);
  }
  
};
