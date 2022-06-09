import { exec } from 'child_process';

export const execAsync = async (command: string, timeoutInSeconds?: number): Promise<string> =>
  new Promise((resolve, reject) => {
    let callback = false;
    const child = exec(
      command,
      (error, stdout) => {
        callback = true;
        if (error) {
          reject(error);
        }
        resolve(stdout.trim());
      }
    );
    if (timeoutInSeconds) {
      setTimeout(() => {
        if (!callback) {
          console.error(`killing process after ${ timeoutInSeconds } sec timeout`);
          child.kill();
          reject(Error("timeout"));
        }
      }, timeoutInSeconds * 1000);
    }
  });
