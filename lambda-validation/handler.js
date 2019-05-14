'use strict';

const {validateShowReportIntent,validateAnyIntent} = require('./validation');

module.exports.intents = (event, context, callback) => {

  console.log(`event.bot.name=${event.bot.name}`);
  if(event.currentIntent.name.toLowerCase() === "showreport"){
      console.log('validate intent show report')
      const res = validateShowReportIntent(event,callback);
      callback(null,res);
  }
  else{
    console.log('no intent');
    const res = validateAnyIntent(event,callback);
    callback(null,res);
  }
  
};
