// logger.js
const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = format.printf(
  info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
);

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [
    new transports.File({
      filename: path.join(logDir, 'app.log'),
      level: 'info',
      format: format.combine(format.uncolorize(), logFormat)
    }),
  ]
});

  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    )
  }));


module.exports = logger;
