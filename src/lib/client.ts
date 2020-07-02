import { F1TelemetryClient, constants } from 'f1-telemetry-client';
import {
	PacketSessionData,
	PacketLapData,
} from 'f1-telemetry-client/build/src/parsers/packets/types';

import { startRPCClient } from './startRPCClient';
import { logger } from './utils/logger';

let currentSessionData: PacketSessionData;

export const startUDP = (clientID: string) => {
	// Start RPC Client
	const rpcClient = startRPCClient(clientID);

	const { PACKETS, TRACKS, SESSION_TYPES } = constants;

	const client = new F1TelemetryClient({
		port: 41234,
	});

	client.on(PACKETS.session, (data: PacketSessionData) => {
		logger.log('debug', data);

		currentSessionData = data;
	});

	client.on(PACKETS.lapData, (data: PacketLapData) => {
		logger.log('debug', data);

		const playersCar = data.m_header.m_playerCarIndex;

		if (data.m_lapData[playersCar].m_driverStatus === 0) {
			rpcClient.client.setActivity({
				startTimestamp: rpcClient.startTimestamp,
				details: `Currently in garage`,
				state: `Racing at ${TRACKS[currentSessionData.m_trackId].name}`,
			});
		} else {
			if (currentSessionData.m_sessionType !== 10) {
				rpcClient.client.setActivity({
					startTimestamp: rpcClient.startTimestamp,
					details: `Currently racing at ${TRACKS[currentSessionData.m_trackId].name}. (${
						SESSION_TYPES[currentSessionData.m_sessionType]
					})`,
					state: `Estimated Time Left In Session: ${Math.floor(
						currentSessionData.m_sessionTimeLeft / 60,
					)}/${Math.floor(currentSessionData.m_sessionDuration / 60)}`,
				});
			} else {
				rpcClient.client.setActivity({
					startTimestamp: rpcClient.startTimestamp,
					details: `Currently racing at ${TRACKS[currentSessionData.m_trackId].name}. (${
						SESSION_TYPES[currentSessionData.m_sessionType]
					})`,
					state: `Lap ${data.m_lapData[playersCar].m_currentLapNum}/${currentSessionData.m_totalLaps}. Position ${data.m_lapData[playersCar].m_carPosition}/${data.m_lapData.length}`,
				});
			}
		}
	});

	client.start();

	return { rpcClient, client };
};
