import api, { apiConfig } from "./api";
import { ProtectedResponse } from "@mcqapp/types";

export const Protected = async () => {
  try {
    const response = await api[apiConfig.protected.type](
      apiConfig.protected.endpoint
    );
    const { data } = response.data as ProtectedResponse;
    return data;
  } catch (err) {
    return null;
  }
};
