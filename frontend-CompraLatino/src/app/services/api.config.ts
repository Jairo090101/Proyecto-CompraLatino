const LOCAL_API_URL = 'http://localhost:8000/api';
const PRODUCTION_API_URL = 'https://proyecto-compralatino-production.up.railway.app/api';

const LOCAL_HOSTS = ['localhost', '127.0.0.1'];

/**
 * Base URL of the Laravel API.
 * Chosen at runtime from the host so the same build works locally and on Vercel
 * without touching angular.json or adding build-time environment files.
 */
export const API_URL = LOCAL_HOSTS.includes(globalThis.location?.hostname ?? '')
  ? LOCAL_API_URL
  : PRODUCTION_API_URL;
