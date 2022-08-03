const Joi = require('joi');


let avParamsSchema = Joi.object({
    function: Joi.string().default('TIME_SERIES_DAILY'),
    symbol: Joi.string().uppercase().max(4).required(),
    outputsize: Joi.string().valid('compact', 'full').default('compact'),
    datatype: Joi.string().valid('json','csv').default('json')
})
.rename('stockSymbol', 'symbol')
.options({ stripUnknown: true })


function addOutputsizeParam (params, dayDiff, defaultDayDif=138){
    if(dayDiff > defaultDayDif) params.outputsize = "full"
    return params
}

module.exports = {
    avParamsSchema,
    addOutputsizeParam
}