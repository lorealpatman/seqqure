import axios from "axios";

let baseUrl = process.env.REACT_APP_WEB_API_DOMAIN || "";
baseUrl += "/api";

export const post = data => {
  const url = baseUrl + "/people";
  const config = {
    method: "POST",
    url: url,
    data: data,
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const getAll = () => {
  const url = baseUrl + "/people";
  const config = {
    method: "GET",
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const search = userName => {
  const url = baseUrl + "/people/search/?userName=" + userName;
  const config = {
    method: "GET",
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const getByTenantId = () => {
  const url = baseUrl + "/people/admin";

  const config = {
    method: "GET",
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const getPersonById = _id => {
  const url = baseUrl + "/people/" + _id;

  const config = {
    method: "GET",
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const put = person => {
  const url = baseUrl + "/people/" + person._id;
  const config = {
    method: "PUT",
    data: person,
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const del = _id => {
  const url = baseUrl + "/people/" + _id;
  const config = {
    method: "DELETE",
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const putFileKey = (personId, fileKey) => {
  const url = baseUrl + "/people/" + personId + "/fileKey";
  const config = {
    method: "PUT",
    data: JSON.stringify({ fileKey: fileKey }),
    headers: { "Content-Type": "application/json" },
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

const responseSuccessHandler = response => {
  return response.data;
};

const responseErrorHandler = error => {
  console.log(error);
  return Promise.reject(error);
};
