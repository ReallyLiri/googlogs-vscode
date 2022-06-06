import axios, { AxiosRequestConfig } from "axios";
import { getAuthTokenAsync, resetToken } from "./auth";
import { constants as httpConstants } from "http2";

export async function httpAsync<TIn, TOut>(
  url: string,
  method: string,
  requestBody?: TIn
): Promise<TOut | null> {
  return await httpAsyncWithRetry(url, method, requestBody, false);
}

async function httpAsyncWithRetry<TIn, TOut>(
  url: string,
  method: string,
  requestBody: TIn,
  isRetry: boolean
): Promise<TOut | null> {
  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Authorization': `Bearer ${ await getAuthTokenAsync() }`,
      'Content-Type': 'application/json'
    },
    data: requestBody ? JSON.stringify(requestBody) : undefined
  };
  console.log(config);

  const response = await axios.request(config);
  if (response.status !== httpConstants.HTTP_STATUS_OK) {
    if (!isRetry) {
      resetToken();
      return await httpAsyncWithRetry(url, method, requestBody, true);
    }
    console.error("failed fetching logs", response);
    return null;
  } else {
    return response.data as TOut;
  }
}
