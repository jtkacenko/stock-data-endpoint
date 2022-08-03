 /**
 * Configurations of logger.
 */

const winston = require('winston');
const DailyRotateFile = require("winston-daily-rotate-file");

require('dotenv').config()

const timezoned = () => {
  return new Date().toLocaleString('en-US', {
      timeZone: process.env.TIMEZONE
  });
}

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: timezoned }),
  winston.format.align(),
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}`,
),);

const transport = new DailyRotateFile({
  filename: process.env.LOG_FOLDER + process.env.LOG_FILE,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles:'14d',
  prepend: true,
  level: "info"
});


const logger = winston.createLogger({
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({
      level: "info",}),
]});



module.exports = logger;