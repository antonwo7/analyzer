import {format, parse} from 'date-format-parse';

export function isToday (date: Date) {
    const todayDate = new Date()
    return date.setHours(0,0,0,0) == todayDate.setHours(0,0,0,0)
}

// export function prettyDate (dateString: string) {
//     const date = parse(dateString, 'YYYY-MM-DD HH:mm:ss')
//     return format(date, )
// }
