const {DimensionPerformanceTypes} = require('./performanceReportSlots');
const {MetricTypes,checkNum} = require('./generalSlots')

module.exports = (userText,slots)=>{
    let newUserText = userText.toLowerCase()
    let dimensions = DimensionPerformanceTypes;
    let metrics = MetricTypes;

    for(let i=0;i<dimensions.length;i++){
        if(newUserText.includes(dimensions[i].name)){
            slots['DimensionPerformance']=dimensions[i].name;
            break;
        }

        if(dimensions[i].synonyms){
            let syns = dimensions[i].synonyms;
            for(let i=0;i<syns.length;i++){
                if(newUserText.includes(syns[i])){
                    slots['DimensionPerformance']=dimensions[i].name;
                    break;
                }
            }
        }
    }

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

    if(slots['DimensionPerformance']){
        let num=checkNum(newUserText,slots['DimensionPerformance'])
            if(num)
              slots['Num']=num
    }

    //return slots
    
}