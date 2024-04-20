import _ from "axios";

export const axios = _.create({
  baseURL: `http://192.168.1.171:3000/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeoutErrorMessage: "Connection timeout, try again later",
  timeout: 5000,
});
