import axios from "axios";
import { getAuthorizationToken } from "./authToken";

export const api = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
    Authorization: getAuthorizationToken() || "",
  },
});

// dynamically allocate auth token
// axios.interceptors.request.use(
//   (config) => {
//     config.headers.Authorization = get || "";
//     return config;
//   },
//   (error) => {
//     console.log(error);
//   }
// );

export default api;
