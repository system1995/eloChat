const {delegate,elicitSlot,elicitIntent,confirmIntent,closeIntent} = require('./lexResponses');
const {buildResponseMessage,checkConfirmationStatus} = require('./helpers');
const showReportInitialization = require('./slots/showReportSlotsInitialization')
const performanceReportInitialization = require('./slots/performaceReportslotsInitialization')
const moment = require('moment');

exports.validateShowReportIntent = (intentReq) => {
    const slots = intentReq.currentIntent.slots;
    const text = intentReq.inputTranscript;
    const intentName = intentReq.currentIntent.name;
    const confStatus = intentReq.currentIntent.confirmationStatus;
    const sessionAttributes = intentReq.sessionAttributes;

    if(!sessionAttributes || !sessionAttributes['processingValidation']){
        showReportInitialization(text,slots)
    }

    const checkResult=checkConfirmationStatus(confStatus,sessionAttributes,slots);
    if(checkResult !== 'nothingChecked')
       return checkResult;
    
    if(slots.Metric){
        console.log('metric 1');
        const m = slots.Metric.toLowerCase();

        if(slots.ADNetwork && (slots.Gender||slots.Device||slots.Os)){
            const message = buildResponseMessage(`you can\'t have informations about 
                                  Ad network and another dimesion type at the same time :(`)
            return closeIntent({},'Failed',message)
        }

        if((slots.Device||slots.Gender) && slots.Dimension ){
            slots['Dimension'] = null;
        }

        if(!slots.Date && !slots.DateRange && !slots.Num){
            const message = buildResponseMessage(`would you like to see yesterday's ${m}?`);
            const yesterday = moment().set('day',moment().day()-1).format('Y-MM-DD');
            slots['Date'] = yesterday.toString();
            let attributes = {}
            attributes['yesterdayMetric']= true;
            attributes['processingValidation']=true
            return confirmIntent(attributes,intentName,slots,message);
        }
        else if(slots.Date && slots.DateRange){
            const message = buildResponseMessage('You provided two different dates. Include vs for comparaison');
            //sessionAttributes['compareDates']= true;
            return closeIntent({},'Failed',message);
        }
        else if(slots.Num && !slots.DateRange){
            if(slots.Date){
                slots['Num'] = null;
                return delegate({},slots)
            }
            
            const message = buildResponseMessage('you didn\'t provide a date range' + 
              '(exemple: what is my revenue in the 2 last months?)');

            let attributes={};
            attributes['processingValidation']=true
            return elicitSlot(attributes,intentName,slots,'DateRange',message);
        }
        else if(slots.DateRange && !slots.Num && !slots.Date){
            const message = buildResponseMessage(`can you please confirm or reconfirm the number of
                                    ${slots.DateRange}s`);
            let attributes={};
            attributes['processingValidation']=true
            return elicitSlot(attributes,intentName,slots,'Num',message);
        }
        else{
            console.log(slots);
            return delegate({},slots);
        }
    }
    else{
       
        return delegate({},slots)
    }
}

exports.validateVisibilityReportIntent = (intentReq)=>{
    const slots = intentReq.currentIntent.slots;
    const text = intentReq.inputTranscript;
    const confStatus = intentReq.currentIntent.confirmationStatus;
    const sessionAttributes = intentReq.sessionAttributes;
    const intentName = intentReq.currentIntent.name;

    if(!sessionAttributes || !sessionAttributes['processingValidation']){
        performanceReportInitialization(text,slots)
    }


    const checkResult = checkConfirmationStatus(confStatus, sessionAttributes, slots);
    if (checkResult !== 'nothingChecked') return checkResult;
    
    if(slots.DimensionPerformance){
        if(slots.Metric && slots.DimensionPerformance.toLowerCase().includes("page") && 
        slots.Metric.toLowerCase() !== "visibility" ){
            
            const message=buildResponseMessage(`sorry, we can\'t provide informations about
                                ${slots.Metric} metric for page dimension :(`); 
            return closeIntent({},'Failed',message);
        }
        
        if(!slots.Date){
            let message;
            if(slots.DimensionPerformance.toLowerCase().includes('page'))
                message = buildResponseMessage('would you like to see the total visibility best performance?')
            else{
                const yesterday = moment().set('day',moment().day()-1).format('Y-MM-DD');
                slots['Date'] = yesterday.toString();
                if(slots.Num)
                message=buildResponseMessage(`would you like to see yesterday's  
                            performance of best ${slots.Num} ${slots.DimensionPerformance.replace('utm_','')}?`)

                message = buildResponseMessage(`would you like to see yesterday's  
                            performance of best ${slots.DimensionPerformance.replace('utm_','')}?`)
            }
            
            let attributes={}
            attributes['performanceDateRange']=true;
            attributes['processingValidation']=true
            return confirmIntent(attributes,intentName,slots,message);
        }
    }

    return delegate({},slots);
}

exports.validateAnyIntent = (intentReq) => {
    const slots = intentReq.currentIntent.slots;
    return delegate({},slots)
}