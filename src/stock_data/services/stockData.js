
const Joi = require('joi').extend(require('@joi/date'));
const helperFunc = require('./helpersFunc');

require('dotenv').config();


let reqSchema = Joi.object({
    currencyCode: Joi.string().uppercase().min(3).max(3).required(),
    date: Joi.date().format("YYYY-MM-DD").raw().required(),
    stockSymbol: Joi.string().uppercase().max(4).required()
})


function convertStockPrices(stockData, currencyRate, currencyCode){
    let result = {}
    if(currencyCode != process.env.DEFAULT_CURRENCY){
        Object.entries(stockData).forEach((entry) => {
            let [key, value] = entry
            if(!key.includes('volume')){
                value = helperFunc.convertPrice(value, currencyRate)
            } 
            result[key] = value
        })
    } else {
        result = stockData
    }
    return result
}


function getStockDataResult(stockData, currencyRate, currencyCode, metaData){
    let result = convertStockPrices(stockData, currencyRate, currencyCode)
    result.MetaData = metaData
    return result
}


module.exports = {
    reqSchema,
    getStockDataResult
}
