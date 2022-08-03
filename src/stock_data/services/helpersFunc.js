

function getDayDiff(date_1, date_2){
    let difference = date_1.getTime() - date_2.getTime();
    let TotalDays = Math.floor(difference / (1000 * 3600 * 24));
    return TotalDays;
}

function convertPrice(price, rate, precision = 4){
    const pricePrecision = Math.round(price * 10**precision)
    const ratePrecision = Math.round(rate * 10**precision)
    const newPrice = Math.round(pricePrecision * ratePrecision / 10**precision) / 10**precision
    return String(newPrice)
}


module.exports ={
    getDayDiff,
    convertPrice
}