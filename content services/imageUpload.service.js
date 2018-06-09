import axios from "axios";

let baseUrl = process.env.REACT_APP_WEB_API_DOMAIN || "";
baseUrl += "/api";

export const post = data => {
  const url = baseUrl + "/imageUpload";
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

// export const getImageById = _id => {
//   const url = baseUrl + "/imageUpload/" + _id;

//   const config = {
//     method: "GET",
//     withCredentials: true
//   };

//   return axios(url, config)
//     .then(responseSuccessHandler)
//     .catch(responseErrorHandler);
// };

// export const put = image => {
//   const url = baseUrl + "/imageUpload/" + image._id;
//   const config = {
//     method: "PUT",
//     data: image,
//     withCredentials: true
//   };

//   return axios(url, config)
//     .then(responseSuccessHandler)
//     .catch(responseErrorHandler);
// };

// export const del = _id => {
//   const url = baseUrl + "/imageUpload/" + _id;
//   const config = {
//     method: "DELETE",
//     withCredentials: true
//   };

//   return axios(url, config)
//     .then(responseSuccessHandler)
//     .catch(responseErrorHandler);
// };

const responseSuccessHandler = response => {
  return response.data;
};

const responseErrorHandler = error => {
  console.log(error);
  return Promise.reject(error);
};
