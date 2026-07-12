import axios from 'axios';

export const useAxios = () => {
  // TODO: Implement custom Axios request/response interceptors
  // - Attach session token automatically on headers
  // - Intercept HTTP 401/403 status to trigger user logout
  return axios;
};
