import '@testing-library/jest-dom';
import axios from 'axios';
import api from '@/lib/axios';
import { server } from './tests/mocks/mswHandlers';

// Custom, zero-dependency fetch adapter for Axios in Jest JSDOM environments
const customJestFetchAdapter = async (config) => {
  let fullUrl = config.url || '';
  if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
    const base = config.baseURL || 'http://localhost:3001';
    fullUrl = new URL(fullUrl, base).toString();
  }

  let headers = {};
  if (config.headers) {
    headers = config.headers.toJSON ? config.headers.toJSON() : config.headers;
  }
  const method = (config.method || 'get').toUpperCase();
  
  let body = config.data;
  if (body && typeof body === 'object' && !(body instanceof globalThis.FormData) && !(body instanceof globalThis.Blob)) {
    body = JSON.stringify(body);
  }

  const fetchOptions = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };

  if (method !== 'GET' && method !== 'HEAD' && body !== undefined && body !== null) {
    fetchOptions.body = body;
  }

  const response = await globalThis.fetch(fullUrl, fetchOptions);

  let responseData = null;
  try {
    const arrayBuf = await response.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuf);
    responseData = text ? JSON.parse(text) : null;
  } catch (e) {
    responseData = null;
  }

  if (response.status >= 200 && response.status < 300) {
    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText || 'OK',
      headers: Object.fromEntries(response.headers.entries()),
      config,
      request: {},
    };
  }

  const error = new Error(`Request failed with status code ${response.status}`);
  error.config = config;
  error.response = {
    data: responseData,
    status: response.status,
    statusText: response.statusText || 'Error',
    headers: Object.fromEntries(response.headers.entries()),
    config,
  };
  throw error;
};

axios.defaults.adapter = customJestFetchAdapter;
api.defaults.adapter = customJestFetchAdapter;

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
