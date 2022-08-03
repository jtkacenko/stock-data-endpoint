
const Joi = require('joi').extend(require('@joi/date'));
const express = require('express')
const axios = require('axios');

const logger = require('../../utils/logger');

const avServices = require('../services/alphavantageAPI');
const polyServices = require('../services/polygonAPI');
const stockServices = require('../services/stockData');
const helperFunc = require('../services/helpersFunc');

require('dotenv').config();

const router = express.Router()


router.get("/api/stock-data", async (req, res) => {
    
    logger.info(`Request params: ${JSON.stringify(req.body)}`)
    let reqParams = stockServices.reqSchema.validate(req.body)

    if(reqParams.error) return res.status(400).send(reqParams.error.details)

    const dayDiff = helperFunc.getDayDiff(new Date(), new Date(reqParams.value.date))
    reqParams.value = avServices.addOutputsizeParam(reqParams.value, dayDiff)
    
    let avParams = avServices.avParamsSchema.validate(reqParams.value)
    let polyQuery = polyServices.polyQuerySchema.validate(reqParams.value)
    let polyParams = polyServices.polyParamsSchema.validate(reqParams.value)


    if(avParams.error || polyQuery.error || polyParams.error){
        logger.error(
            `ERROR: Check API settings.
            avParamsErrors: ${avParams.error}
            polyQueryErrors: ${polyQuery.error}
            polyParamsErrors: ${polyParams.error}
            `
            )
        return res.status(500).send({"error": "Something went wrong with data request."})
    } 

    let polyUrl = polyServices.getPolygonUrl(polyQuery)   

    avParams.value.apikey = process.env.ALPHAVANTAGE_API_KEY
    polyParams.value.apiKey = process.env.POLYGON_API_KEY


    axios.all([
        axios.get(process.env.ALPHAVANTAGE_URL, {params: avParams.value}),
        axios.get(polyUrl, {params: polyParams.value})
    ]).then(
        axios.spread(({data: stockData}, {data: currencyData}) => {

            if(stockData['Error Message'] || (currencyData.resultsCount == 0 & reqParams.value.currencyCode != process.env.DEFAULT_CURRENCY)){
                logger.error(
                    `ERROR: API SERVICE ERROR.
                    avMessage: ${stockData['Error Message']}
                    polyMessage:
                    `
                )
                return res.status(400).send({"error": "Something went wrong with data request."})
            }

            const currencyRate = polyServices.getCurrencyRate(currencyData, reqParams.value.currencyCode)

            const stockDateData = stockData[Object.keys(stockData)[1]][reqParams.value.date]
            const stockDataResult = stockServices.getStockDataResult(
                stockDateData,
                currencyRate,
                reqParams.value.currencyCode,
                reqParams.value
            )
            
            res.status(200).send({data: stockDataResult})
        })
    ).catch((error) => {
        logger.error( `Error details: ${error}`)
        return res.status(400).send({"error": "Something went wrong with data request."})
    })

})




module.exports = router