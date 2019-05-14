const {delegate,closeIntent} = require('./lexResponses');

function buildResponseMessage(message){
    return {
        "contentType" : "PlainText",
        "content" : message
    }
}


exports.buildResponseMessage = buildResponseMessage;


exports.checkConfirmationStatus= (status,sessionAttributes,slots)=>{
    if (status === 'Confirmed') {
      return delegate({}, slots);
    } 
    
    if (status === 'Denied') {
      const message = buildResponseMessage('Ok. You can question about something else');
      return closeIntent({}, 'Failed', message);
    } 
    
    if (status === 'None' && sessionAttributes && sessionAttributes['yesterdayMetric']) {
      sessionAttributes['yesterdayMetric'] = false;
      const message = buildResponseMessage('I couldn\'t understand the stuff you typed')
      return closeIntent({}, 'Failed',message);
    }

    if(status==='None' && sessionAttributes && sessionAttributes['performanceDateRange']){
      sessionAttributes['performanceDateRange'] = false;
      const message = buildResponseMessage('The stuff you typed makes no sense :(')
      return closeIntent({}, 'Failed',message);
    }

    return 'nothingChecked';
}


exports.checkMonthExistence = (text) => {
  let months = ['january','february','march','april','may','june','july', 
                  'august','september','october','november','december']

  for(let i= 0;i<months.length;i++){
    if(text.includes(months[i])){
       var currentYear = new Date().getFullYear().toString();
       const currentMonth = new Date().getMonth().toString();
       
       if(currentMonth < i)
          currentYear -= 1;

       var monthIndex = i + 1;
       if(monthIndex<10)
         monthIndex = "0" + monthIndex
       const date = currentYear + "-" + monthIndex;
       return {success:true,date:date};
    }
  }

  return {success:false};
}

exports.checkNumberExistence = (text)=>{
  return /\d/.test(text);
}

exports.getNumberOutOfText = (text)=>{
    let numb = text.match(/\d/g);
    return numb;
}