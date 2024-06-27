import { RequestMethods } from "../types/requests";
import { AxiosResponse } from "axios";
import api from "./api";
import { errorHandler } from "./errorHandler";

export const sendRequest = (
  method: RequestMethods,
  url: string,
  data: object,
  responseHandler: (response: AxiosResponse) => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  console.log("send request for ", url);
  // setting error and loading states
  setIsLoading(true);
  setError(false);

  // sending request based on method type
  if (method !== "post") {
    api[method](url).then(
      (response) => {
        responseHandler(response);
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        setError(true);
        errorHandler(err);
      }
    );
  } else {
    api.post(url, data).then(
      (response) => {
        responseHandler(response);
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        setError(true);
        errorHandler(err);
      }
    );
  }
};
