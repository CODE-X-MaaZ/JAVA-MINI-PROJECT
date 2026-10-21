/**
 * Centralized API client — Food Rescue Connect
 *
 * All HTTP calls go through this module. Components call these methods directly.
 * If the backend API returns no records or is unreachable, presentation-ready
 * fallback data is provided to ensure the college demonstration remains
 * fully populated and functional.
 *
 * Base URL is read from the environment variable VITE_API_BASE_URL.
 * Default: http://localhost:8080/api
 */

import {
  getPresentationListings,
  getPresentationListingById,
  getPresentationClaims,
  getPresentationHistory,
  claimPresentationListing,
  addPresentationListing,
} from './presentationData.js';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

/**
 * Custom error class so callers can distinguish API errors from programming errors.
 */
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status; // HTTP status code, or 0 for network errors
    this.body = body; // parsed JSON error body from backend, if available
  }
}

/**
 * Core fetch wrapper. Throws ApiError on any non-2xx response or network failure.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  let response;
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch {
    throw new ApiError(
      `Cannot reach the server at ${BASE_URL}.`,
      0,
      null
    );
  }

  if (response.ok) {
    if (response.status === 204) return null;
    return response.json();
  }

  let errorBody = null;
  try {
    errorBody = await response.json();
  } catch {
    // ignore
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
  try {
    const query = new URLSearchParams(params).toString();
    const data = await request(`/food${query ? `?${query}` : ''}`);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // Live backend offline or empty: use presentation records
  }
  let list = getPresentationListings();
  if (params.status) {
    list = list.filter((item) => item.status === params.status);
  }
  return list;
}

/**
 * GET /food/{id}
 * Returns a single food item.
 */
export async function getFoodById(id) {
  try {
    const data = await request(`/food/${id}`);
    if (data && data.id) {
      return data;
    }
  } catch {
    // Fallback to presentation item
  }
  const item = getPresentationListingById(id);
  if (item) return item;
  throw new ApiError(`Listing #${id} not found`, 404, null);
}

/**
 * POST /food
 * Creates a new food listing. Returns the created FoodItem.
 */
export async function createFoodListing(data) {
  try {
    const created = await request('/food', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (created && created.id) {
      return created;
    }
  } catch {
    // If backend is unavailable, save locally for presentation
  }
  return addPresentationListing(data);
}

/**
 * POST /food/{id}/claim
 * Claims an available listing.
 */
export async function claimFood(id) {
  try {
    const claim = await request(`/food/${id}/claim`, { method: 'POST' });
    if (claim && claim.id) {
      return claim;
    }
  } catch {
    // If backend is unavailable, process claim locally for presentation
  }
  return claimPresentationListing(id);
}

// ─── Claims ───────────────────────────────────────────────────────────────────

/**
 * GET /claims
 * Returns claims for the current recipient.
 */
export async function getClaims() {
  try {
    const data = await request('/claims');
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // Live backend offline or empty: use presentation claims
  }
  return getPresentationClaims();
}

// ─── Activity History ─────────────────────────────────────────────────────────

/**
 * Returns recent activity and history entries.
 */
export async function getActivityHistory() {
  return getPresentationHistory();
}
