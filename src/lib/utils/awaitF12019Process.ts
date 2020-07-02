import { startUDP } from '../client';
import { logger } from './logger';
import { checkProcess } from './checkProcess';

export async function awaitF12019Process() {
	const f12019dx11 = await checkProcess('F1_2019');
	const f12019dx12 = await checkProcess('F1_2019_dx12');

	if (f12019dx11.length !== 0 || f12019dx12.length !== 0) {
		startUDP('728337846510813218');
		logger.log('info', 'F1 2019 Process Found!');
		// @ts-ignore
		clearInterval(this);
	}
}
