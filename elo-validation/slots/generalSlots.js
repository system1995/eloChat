exports.MetricTypes = [
    {
        name: 'revenue',
        synonyms:[
            'revenues'
        ]
    },
    {
        name : 'profit',
        synonyms:[
            'profit',
            'gain',
            'gains'
        ]
    },
    {
        name : 'expense',
        synonyms:[
            'expenses',
            'spent'
        ]
    }
]

exports.DateTypes = [
    {
        name:'month',
        synonyms:[
            'months'
        ]
    },
    {
        name:'week',
        synonyms:[
            'weeks'
        ]
    },
    {
        name:'day',
        synonyms:[
            'days'
        ]
    }
]


const DateSpecificationTypes=[
    {
        name:'last',
        synonyms:[
            'past',
            'previous'
        ]
    }
]

exports.DateSpecificationTypes = DateSpecificationTypes

exports.checkNum = (txt,slot)=>{
    console.log(txt)
    let parts=txt.split(slot)
    let firstParts = parts[0].split(' ');
    console.log(firstParts)
    let num=null;
    for(let i=0;i<firstParts.length;i++){
        let parsedEl = parseInt(firstParts[i]);
        if(!isNaN(parsedEl))
           num = parsedEl 
    }

    if(num){
        if(slot.toLowerCase().includes('day') || slot.toLowerCase().includes('week') || 
         slot.toLowerCase().includes('month')){
             for(let i=0;i<DateSpecificationTypes.length;i++){
                  if(firstParts.includes(DateSpecificationTypes[i].name)){
                      return num;
                  }

                  let syns = DateSpecificationTypes[i].synonyms;
                  for(let i=0;i<syns.length;i++){
                      if(firstParts.includes(syns[i])){
                          return num;
                      }
                  }
                      
             }

             return 'you didn\'t specify anything about which date range'
         }
         else
           return num
    }
    return null;
}