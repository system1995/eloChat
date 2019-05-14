const {delegate,elicitSlot,elicitIntent,confirmIntent,closeIntent} = require('./lexResponses');
const moment = require('moment');

function buildResponseMessage(message){
    return {
        "contentType" : "PlainText",
        "content" : message
    }
}

exports.validateShowReportIntent = (intentReq) => {
    const slots = intentReq.currentIntent.slots;
    const intentName = intentReq.currentIntent.name;
    const confStatus = intentReq.currentIntent.confirmationStatus;
    const inputText = intentReq.currentIntent.inputTranscript;
    const sessionAttributes = intentReq.sessionAttributes;

    console.log(inputText);

    if(slots.Metric){
        console.log('metric 1');
        const m = slots.Metric.toLowerCase();

        if(!slots.Date && !slots.DateRange){
            const message = buildResponseMessage(`would you like to see yesterday's ${m}?`);
            const yesterday = moment().set('day',moment().day()-1).format('Y-MM-DD');
            slots['Date'] = yesterday.toString();
            sessionAttributes['yesterdayMetric']= true;
            return confirmIntent(sessionAttributes,intentName,slots,message);
        }
        else if(slots.Date && slots.DateRange){
            const message = buildResponseMessage('You provided two different dates. Include vs for comparaison');
            //sessionAttributes['compareDates']= true;
            return closeIntent(sessionAttributes,'Failed',message);
        }
        else if(slots.Num && !slots.DateRange){
            if(slots.Date){
                console.log('reached this');
                slots['Num'] = null;
                return delegate({},slots);
            }

            const message = buildResponseMessage('you didn\'t enter the date type (day, week or month)');
            return elicitSlot({},intentName,slots,'DateRange',message);
        }
        else{

            if(confStatus === "Confirmed"){
                return delegate({},slots);
            }
            else if(confStatus === "Denied"){
                const message = buildResponseMessage('Ok. You can question about something else')
                return closeIntent({},'Failed',message);
            }
            else if(confStatus === "None" && sessionAttributes['yesterdayMetric']){
                sessionAttributes['yesterdayMetric'] = false;
                const message = buildResponseMessage('I couldn\'t understand what you\'ve just typed')
                return closeIntent({},'Failed',message);
            }
            else {
                return delegate({},slots);
            }
            
        }
    }
    else{
       
        //const message = buildResponseMessage('what metric?');
        //return elicitSlot({},intentName,slots,'Metric',message);
        return delegate({},slots)
    }
}

exports.validateAnyIntent = (intentReq) => {
    const slots = intentReq.currentIntent.slots;
    delegate({},slots)
}