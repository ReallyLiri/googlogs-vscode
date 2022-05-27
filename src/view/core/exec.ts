import { exec } from 'child_process';

const promisify = require('util.promisify');
const _execAsync = promisify(exec);

export const execAsync = async (command: string): Promise<string> =>
  (await _execAsync(command)).stdout.trim();
