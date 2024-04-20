import { useState } from "react";
import { axios } from "../utils/axiosInstance";

export const useFetch = (URL, method = "get") => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    e: false,
    message: "",
    statusCode: null,
  });

  const handleFetch = async (body, headers = {}) => {
    setLoading(true);
    clearError();
    try {
      const config = {
        method: method,
        headers: headers ? headers : {},
        data: body ? body : undefined,
      };

      const response = await axios[method.toLowerCase()](
        URL,
        method.toLowerCase() !== "get" && method.toLowerCase() !== "delete"
          ? body
          : config,
        config
      );

      setLoading(false);
      return response.data;
    } catch (e) {
      console.log(e.response.data);
      setError({
        e: true,
        message: e.response.data.message,
        statusCode: e.response.data.statusCode,
      });
      setLoading(false);
    }
  };

  const setLoadingFalse = () => setLoading(false);
  const clearError = () =>
    setError({
      e: false,
      message: "",
      statusCode: null,
    });

  return {
    loading,
    error,
    clearError,
    handleFetch,
    setLoadingFalse,
  };
};
