import { checkProcess } from './lib/utils/checkProcess';
import { logger } from './lib/utils/logger';
import { startUDP } from './lib/client';
import { F1TelemetryClient } from 'f1-telemetry-client';
import { Client } from 'discord-rpc';

let f1AppFound = false;
let f1ProcessType: Array<object>;

let initialStart = true;

let startTimestamp: number;

let udpClient: F1TelemetryClient;
let rpcClient: Client;

(async () => {
	// Check If Discord Is Running
	const stableProcess = await checkProcess('Discord');
	const canaryProcess = await checkProcess('DiscordCanary');

	if (canaryProcess.length === 0 && stableProcess.length === 0) {
		throw new Error('Please have Discord open before running this program!');
	} else {
		logger.log('info', 'Waiting for F1 2019...');

		setInterval(async () => {
			const f12019dx11 = await checkProcess('F1_2019');
			const f12019dx12 = await checkProcess('F1_2019_dx12');

			f1ProcessType = f12019dx11.length !== 0 ? f12019dx11 : f12019dx12;

			if (f1ProcessType.length !== 0) {
				if (!f1AppFound) {
					if (initialStart) {
						logger.log('info', 'F1 2019 Process Found!');

						const startClient = startUDP('728337846510813218');
						rpcClient = startClient.rpcClient.client;
						udpClient = startClient.client;
						startTimestamp = startClient.rpcClient.startTimestamp;

						initialStart = false;
					} else {
						rpcClient.setActivity({
							startTimestamp,
							details: 'Idling in F1 2019',
							instance: false,
						});
						udpClient.start();

						logger.log('info', 'F1 2019 Process found again!');
					}

					f1AppFound = true;
				}
			}

			if (f1ProcessType.length === 0) {
				if (f1AppFound) {
					f1AppFound = false;

					logger.log('info', 'Lost connection to the F1 2019 Process! Trying to reconnect...');

					udpClient.stop();
					rpcClient.clearActivity();
				}
			}
		}, 1000);
	}
})();
