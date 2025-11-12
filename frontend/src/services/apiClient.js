export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const VALUE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL)
  || '';

console.log(VALUE);

const API_BASE_URL = VALUE ? VALUE.replace(/\/$/, '') : '';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

const buildUrl = (path) => {
  if (!API_BASE_URL) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const apiRequest = async (path, options = {}) => {
  const { body, headers, ...rest } = options;

  const requestInit = {
    method: 'GET',
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers
    }
  };

  if (body !== undefined) {
    requestInit.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(buildUrl(path), requestInit);
  } catch (error) {
    throw new ApiError('Unable to connect to the server. Please check your network connection.', 0);
  }

  let data = null;
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    let message;

    if (typeof data === 'string') {
      message = data;
    } else if (data?.message) {
      message = data.message;
    } else if (Array.isArray(data?.errors) && data.errors.length > 0) {
      message = data.errors[0].msg || 'Request failed. Please check your input.';
    } else {
      message = 'Request failed. Please try again.';
    }

    throw new ApiError(message, response.status, data?.errors ?? null);
  }

  return data;
};

