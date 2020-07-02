import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
	level: 'debug',
	format: format.combine(
		format.colorize({ level: true }),
		format.timestamp(),
		format.align(),
		format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
	),
	transports: [new transports.Console()],
	exitOnError: false,
});
