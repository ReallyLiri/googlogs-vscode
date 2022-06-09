import { exec } from 'child_process';

export const execAsync = async (command: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(
      command,
      (error, stdout) => {
        if (error) {
          reject(error);
        }
        resolve(stdout.trim());
      }
    );
  });
