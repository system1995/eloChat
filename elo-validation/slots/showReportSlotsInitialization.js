const {AdNetworkTypes,DimensionTypes,DeviceTypes,OsTypes,GenderTypes} = require('./showReportSlots');
const {MetricTypes,DateTypes,checkNum} = require('./generalSlots')

module.exports = (userText,slots)=>{
    let newUserText = userText.toLowerCase()
    let networks = AdNetworkTypes;
    let dimensions= DimensionTypes;
    let devices = DeviceTypes;
    let os = OsTypes;
    let genders = GenderTypes;
    let metrics = MetricTypes;
    let dates = DateTypes;

    for(let i=0;i<metrics.length;i++){
        
        if(newUserText.includes(metrics[i].name)){
            slots['Metric']=metrics[i].name;
            break;
        }
        if(metrics[i].synonyms){
            let syns=metrics[i].synonyms;
            for(let i=0;i<syns.length;i++){
                if(newUserText.includes(syns[i])){
                    slots['Metric']=metrics[i].name
                    break;
                }
            }
        }
    }

    for(let i=0;i<dates.length;i++){
        
        if(newUserText.includes(dates[i].name)){
            slots['DateRange']=dates[i].name;
            break;
        }
        if(dates[i].synonyms){
            let syns=dates[i].synonyms;
            for(let i=0;i<syns.length;i++){
                if(newUserText.includes(syns[i])){
                    slots['DateRange']=dates[i].name
                    break;
                }
            }
        }
    }

    for(let i=0;i<networks.length;i++){
        if(newUserText.includes(networks[i].name)){
            slots['ADNetwork']=networks[i].name;
            break;
        }

        if(networks[i].synonyms){
            let syns = networks[i].synonyms;
            for(let i=0;i<syns.length;i++){
                if(newUserText.includes(syns[i])){
                    slots['ADNetwork']=networks[i].name;
                    break;
                }
            }
        }
    }

    for(let i=0;i<dimensions.length;i++){
        if(newUserText.includes(dimensions[i].name)){
            slots['Dimension']=dimensions[i].name;
            break;
        }

        if(dimensions[i].synonyms){
            let syns = dimensions[i].synonyms;
            for(let i=0;i<syns.length;i++){
                if(newUserText.includes(syns[i])){
                    slots['Dimension']=dimensions[i].name;
                    break;
                }
            }
        }
    }

    for(let i=0;i<devices.length;i++){
        if(newUserText.includes(devices[i].name)){
            slots['Device']=devices[i].name;
            break;
        }

        if(devices[i].synonyms){
            let syns = devices[i].synonyms;
            for(let i=0;i<syns.length;i++){
                if(newUserText.includes(syns[i])){
                    slots['Device']=devices[i].name;
                    break;
                }
            }
        }
    }

    for(let i=0;i<os.length;i++){
        if(newUserText.includes(os[i].name)){
            slots['Os']=os[i].name;
            break;
        }

        if(os[i].synonyms){
            let syns = os[i].synonyms;
            for(let i=0;i<syns.length;i++){
                if(newUserText.includes(syns[i])){
                    slots['Os']=os[i].name;
                    break;
                }
            }
        }
    }

    for(let i=0;i<genders.length;i++){
        if(newUserText.includes(genders[i].name)){
            slots['Gender']=genders[i].name;
            break;
        }

        if(genders[i].synonyms){
            let syns = genders[i].synonyms;
            for(let i=0;i<syns.length;i++){
                if(newUserText.includes(syns[i])){
                    slots['Gender']=genders[i].name;
                    break;
                }
            }
        }
    }

    if(slots['DateRange']){
        console.log(slots['DateRange'].toLowerCase())
        let num=checkNum(newUserText,slots['DateRange'].toLowerCase())
        if(typeof num === 'number'){
            console.log(num)
            console.log(slots['Num'])
            slots['Num']=num
        }
    }

    //return slots;
}