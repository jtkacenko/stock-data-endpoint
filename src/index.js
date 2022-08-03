const express = require('express')
const app = express()

const stockData = require('./stock_data/routes/stockData')

require('dotenv').config()


app.use(express.json())
app.use(stockData)


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listnening on port ${port}...`))





