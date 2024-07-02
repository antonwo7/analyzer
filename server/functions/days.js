const date = require('date-and-time')

function isWeekend(d) {
    const day = d.getDay()
    return (day === 6 || day === 0)
}

function dateFormat(dateValue) {
    return date.format(dateValue, 'DD-MM-YYYY')
}

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('es-LA', { month: 'long' });
}

function getMonthLastDay(month) {
    const d = new Date()
    d.setHours(2, 0, 0);
    d.setMonth(month)
    d.setDate(0)
    return d
}

function getMonthFirstDay(month) {
    const d = new Date()
    d.setHours(2, 0, 0);
    d.setMonth(month - 1)
    d.setDate(1)
    return d
}

function getDates(month) {
    const dates = []
    const firstDate = getMonthFirstDay(month)
    const lastDate = getMonthLastDay(month)

    while (firstDate <= lastDate) {
        dates.push({ date: new Date(firstDate.getTime()), weekend: isWeekend(firstDate) })
        firstDate.setDate(firstDate.getDate() + 1)
    }

    return dates
}

function paramToDate(date) {
    const dayDate = new Date()
    dayDate.setMonth(parseInt(date.split('-')[1]) - 1)
    dayDate.setFullYear(parseInt(date.split('-')[2]))
    dayDate.setDate(parseInt(date.split('-')[0]))
    dayDate.setHours(12, 0, 0)
    return dayDate
}

module.exports = {isWeekend, dateFormat, getDates, paramToDate, getMonthName}