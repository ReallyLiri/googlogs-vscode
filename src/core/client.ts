import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
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

  const retryAsync = async (): Promise<TOut | null> => {
    resetToken();
    return await httpAsyncWithRetry(url, method, requestBody, true);
  };

  let response: AxiosResponse<TOut>;
  try {
    response = await axios.request(config);
  } catch (e) {
    if (!isRetry) {
      console.log("failed, retrying", e);
      return await retryAsync();
    }
    console.error("failed", e);
    return null;
  }
  if (response.status === httpConstants.HTTP_STATUS_OK) {
    return response.data;
  }

  if (!isRetry) {
    console.log("failed, retrying", response);
    return await retryAsync();
  }
  console.error("failed", response);
  return null;
}
