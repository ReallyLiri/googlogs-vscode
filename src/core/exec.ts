import { exec } from 'child_process';
import { promisify } from "util";

const _execAsync = promisify(exec);

export const execAsync = async (command: string): Promise<string> =>
  (await _execAsync(command)).stdout.trim();
