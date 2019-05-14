

exports.delegate = (sessionAttributes,slots)=>{
    return {
        sessionAttributes,
        "dialogAction" : {
            "type": "Delegate",
            slots

        }
    }
}

exports.elicitSlot = (sessionAttributes,intentName,slots,slotToElicit,message)=>{
    return{
        sessionAttributes,
        "dialogAction":{
            "type": "ElicitSlot",
            intentName,
            slots,
            slotToElicit,
            message
        }
    }
}

exports.elicitIntent = (sessionAttributes,message)=>{
    if(message){
        return{
            sessionAttributes,
            "dialogAction":{
                "type":"ElicitIntent",
                message
            }
        }
    }
    else{
        return{
            sessionAttributes,
            "dialogAction":{
                "type":"ElicitIntent"
            }
        }
    }
}

exports.confirmIntent = (sessionAttributes,intentName,slots,message=null)=>{
    if(message)
        return{
            sessionAttributes,
            "dialogAction":{
                "type":"ConfirmIntent",
                intentName,
                slots,
                message
            }
        }
    else 
       return{
            sessionAttributes,
            "dialogAction":{
                "type":"ConfirmIntent",
                intentName,
                slots
            }
       }
}

exports.closeIntent = (sessionAttributes,fulfillmentState,message)=>{
    return{
        sessionAttributes,
        "dialogAction":{
            "type":"Close",
            fulfillmentState,
            message
        }
    }
}