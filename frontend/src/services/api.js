/**
 * Centralized API client — Food Rescue Connect
 *
 * All HTTP calls go through this module. Components never call fetch() directly.
 * If the backend is unavailable, functions throw an ApiError with a clear message.
 * Mock data is NOT substituted for failed requests.
 *
 * Base URL is read from the environment variable VITE_API_BASE_URL.
 * Default: http://localhost:8080/api
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

/**
 * Custom error class so callers can distinguish API errors from programming errors.
 */
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;   // HTTP status code, or 0 for network errors
    this.body = body;       // parsed JSON error body from backend, if available
  }
}

/**
 * Core fetch wrapper. Throws ApiError on any non-2xx response or network failure.
 * Never returns mock data.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  let response;
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch (_networkErr) { // oxlint-disable-line no-unused-vars
    // fetch itself threw — server is unreachable or network is down
    throw new ApiError(
      `Cannot reach the server at ${BASE_URL}. Make sure the Spring Boot backend is running.`,
      0,
      null
    );
  }

  if (response.ok) {
    // 204 No Content has no body
    if (response.status === 204) return null;
    return response.json();
  }

  // Non-2xx: try to parse the backend error body (API_CONTRACT §4)
  let errorBody = null;
  try {
    errorBody = await response.json();
  } catch (_parseErr) { // oxlint-disable-line no-unused-vars
    // backend returned non-JSON error body — ignore parse failure
  }

  const message =
    errorBody?.message ||
    errorBody?.error ||
    `HTTP ${response.status} from ${path}`;

  throw new ApiError(message, response.status, errorBody);
}

// ─── Food listings ────────────────────────────────────────────────────────────

/**
 * GET /food
 * Returns all food items. Pass { status: 'AVAILABLE' } to filter.
 */
export async function getFoodListings(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/food${query ? `?${query}` : ''}`);
}

/**
 * GET /food/{id}
 * Returns a single food item. Throws ApiError with status 404 if not found.
 */
export async function getFoodById(id) {
  return request(`/food/${id}`);
}

/**
 * POST /food
 * Creates a new food listing. Returns the created FoodItem (status 201).
 * Required fields per API_CONTRACT: foodName, description, quantity, unit,
 * pickupLocation, pickupDeadline, donorName, donorType.
 */
export async function createFoodListing(data) {
  return request('/food', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * POST /food/{id}/claim
 * Claims an available listing.
 * Throws ApiError with status 409 if already claimed, 404 if not found.
 */
export async function claimFood(id) {
  return request(`/food/${id}/claim`, { method: 'POST' });
}

// ─── Claims ───────────────────────────────────────────────────────────────────

/**
 * GET /claims
 * Returns claims for the demo identity.
 */
export async function getClaims() {
  return request('/claims');
}
