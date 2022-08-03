
const Joi = require('joi').extend(require('@joi/date'));

require('dotenv').config();

let polyQuerySchema = Joi.object({
    currencyCode: Joi.string().uppercase().min(3).max(3).required(),
    date: Joi.date().format("YYYY-MM-DD").raw().required()
})
.options({ stripUnknown: true })


let polyParamsSchema = Joi.object({
    adjusted: Joi.string().valid('true','false').default('true'),
    sort: Joi.string().valid('asc','desc').default('asc'),
    limit: Joi.number().default(120)
})
.options({ stripUnknown: true })


function getPolygonUrl (polyQuery){
    return `${process.env.POLYGON_URL}/v2/aggs/ticker/C:USD${polyQuery.value.currencyCode}/range/1/day/${polyQuery.value.date}/${polyQuery.value.date}`
}

function getCurrencyRate(polygonData, requestCurrencyCode){
    let currencyRate = 1
    if(requestCurrencyCode != process.env.DEFAULT_CURRENCY){
        currencyRate = polygonData.results[0].vw
    }
    return currencyRate
}

module.exports = {
    polyQuerySchema,
    polyParamsSchema,
    getPolygonUrl,
    getCurrencyRate
}