export const isCommandNotFound = (error: Error): boolean =>
  error.message.includes("command not found");

export const isNotAuthenticated = (error: Error): boolean =>
  error.message.includes("You do not currently have an active account selected");

export const isAuthFailed = (error: Error): boolean =>
  error.message.includes("MissingCodeError") || error.message.includes("timeout");
