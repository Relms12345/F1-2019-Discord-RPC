import findProcess from 'find-process';

export const checkProcess = async (processName: string) => {
	return findProcess('name', processName, true);
};
