import { Client } from 'discord-rpc';

import { logger } from './utils/logger';

export const startRPCClient = (id: string) => {
	const client = new Client({ transport: 'ipc' });

	const startTimestamp = Date.now();

	client.on('ready', () => {
		logger.log('verbose', 'RPC Client is ready!');

		client.setActivity({
			startTimestamp,
			details: 'Idling in F1 2019',
			instance: false,
		});
	});

	client.on('connected', () => {
		logger.log('verbose', 'Connected to Discord!');
	});

	client.login({ clientId: id });

	return { client, startTimestamp };
};
