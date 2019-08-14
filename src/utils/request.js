/* eslint-disable  consistent-return */
import fetch from 'dva/fetch';
import router from 'umi/router';
import { notification } from 'antd';
import storage from './storage';
import { toQueryString } from './utils';

const { NODE_ENV } = process.env;

const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data is successful.',
  202: 'A request has entered the background queue.',
  204: 'The data was deleted successfully.',
  400: 'The request was made with an error and the server did not perform any operations to create or modify data.',
  401: 'User does not have permission (token, username, password is incorrect).',
  403: 'The user is authorized, but access is forbidden.',
  404: 'The request is made for a record that does not exist and the server does not operate.',
  406: 'The format of the request is not available.',
  410: 'The requested resource is permanently deleted and will not be retrieved.',
  422: 'A validation error occurred when creating an object.',
  500: 'An error occurred on the server. Please check the server.',
  502: 'Gateway error.',
  503: 'The service is unavailable and the server is temporarily overloaded or maintained.',
  504: 'The gateway timed out.',
};

class ErrorWithReponse extends Error {
  constructor(message, response) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    if (response) {
      this.name = response.status;
      this.response = response;
    }
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `Request error ${response.status}: ${NODE_ENV !== 'production' ? response.url : ''}`,
    description: errortext,
  });
  const error = new ErrorWithReponse(errortext, response);
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  const defaultOptions = {
    headers: {
      'Access-Control-Allow-Credentials': false,
    },
  };
  let qs = '';
  const newOptions = { ...defaultOptions, ...options };
  const token = storage.getJwtToken();
  let catchErrorResponse = false;
  if (newOptions.body && !!newOptions.body.catchError) {
    catchErrorResponse = true;
    delete newOptions.body.catchError;
  }
  if (token) {
    newOptions.headers.Authorization = `Bearer ${token}`;
  }
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  } else if (newOptions.method === 'GET') {
    const optionsClone = { ...options };
    delete optionsClone.method;
    qs = toQueryString(optionsClone);
  }

  return fetch(`${url}${qs ? `?${qs}` : ''}`, newOptions)
    .then(checkStatus)
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
        return;
      }
      return catchErrorResponse ? e : undefined;
    });
}

export function apiGet(url, options) {
  return request(url, { method: 'GET', ...options });
}

export function apiPost(url, options) {
  return request(url, { method: 'POST', ...options });
}

export function apiPut(url, options) {
  return request(url, { method: 'PUT', ...options });
}

export function apiDelete(url, options) {
  return request(url, { method: 'DELETE', ...options });
}
