/**
 * Presentation Data Source — Food Rescue Connect
 *
 * Centralized presentation dataset ensuring the UI remains populated,
 * consistent, and presentation-ready.
 *
 * Persisted in localStorage so interactive claims and posts remain consistent
 * across page transitions.
 */

const STORAGE_KEY = 'food_rescue_presentation_v2';

function futureISO(hours) {
  return new Date(Date.now() + hours * 3600000).toISOString().slice(0, 19);
}

function pastISO(hours) {
  return new Date(Date.now() - hours * 3600000).toISOString().slice(0, 19);
}

const INITIAL_LISTINGS = [
  {
    id: 101,
    foodName: 'Veg Biryani',
    description: 'Freshly prepared vegetable dum biryani with fragrant basmati rice, garden vegetables, and mild spices. Prepared for campus cultural festival.',
    quantity: 25,
    unit: 'meal portions',
    pickupLocation: 'Pune Engineering College — Main Canteen',
    pickupDeadline: futureISO(6),
    donorName: 'College Cultural Committee',
    donorType: 'HOSTEL',
    status: 'AVAILABLE',
    createdAt: pastISO(2.5),
  },
  {
    id: 102,
    foodName: 'Dal Tadka, Steamed Rice & Phulka',
    description: 'Nutritious yellow dal tadka served with hot steamed basmati rice and whole wheat phulkas. Packed hygienically in containers.',
    quantity: 30,
    unit: 'meal portions',
    pickupLocation: 'Shivaji Boys Hostel — Mess Kitchen, Gate 3',
    pickupDeadline: futureISO(4),
    donorName: 'Shivaji Hostel Mess',
    donorType: 'HOSTEL',
    status: 'AVAILABLE',
    createdAt: pastISO(3.5),
  },
  {
    id: 103,
    foodName: 'Vegetable Pulao & Raita',
    description: 'Mildly spiced aromatic vegetable pulao served with fresh vegetable raita. Prepared for departmental seminar lunch.',
    quantity: 15,
    unit: 'meal portions',
    pickupLocation: 'Computer Engineering Dept — Seminar Hall',
    pickupDeadline: futureISO(5),
    donorName: 'CSE Faculty Association',
    donorType: 'OTHER',
    status: 'CLAIMED',
    createdAt: pastISO(5),
  },
  {
    id: 104,
    foodName: 'Assorted Grilled Sandwiches',
    description: 'Freshly prepared paneer and garden vegetable sandwiches with green mint chutney. Sealed in hygienic food packaging.',
    quantity: 18,
    unit: 'pieces',
    pickupLocation: 'Hotel Saffron — MG Road, Pune',
    pickupDeadline: futureISO(3),
    donorName: 'Hotel Saffron',
    donorType: 'RESTAURANT',
    status: 'AVAILABLE',
    createdAt: pastISO(1.5),
  },
  {
    id: 105,
    foodName: 'Steamed Idli & Sambar Combo',
    description: 'Soft steamed idlis served with piping hot vegetable sambar and fresh coconut chutney. Surplus from morning breakfast buffet.',
    quantity: 20,
    unit: 'portions',
    pickupLocation: 'Annapurna Sweets & Restaurant — Station Road',
    pickupDeadline: futureISO(4),
    donorName: 'Annapurna Restaurant',
    donorType: 'RESTAURANT',
    status: 'AVAILABLE',
    createdAt: pastISO(4),
  },
  {
    id: 106,
    foodName: 'Fresh Fruit & Salad Packs',
    description: 'Packed seasonal fruits (apples, oranges, bananas) and crunchy vegetable salads in eco-friendly meal boxes.',
    quantity: 12,
    unit: 'boxes',
    pickupLocation: 'Green Caterers — Kothrud Office',
    pickupDeadline: futureISO(8),
    donorName: 'Green Caterers',
    donorType: 'CATERER',
    status: 'AVAILABLE',
    createdAt: pastISO(6),
  },
  {
    id: 107,
    foodName: 'Chapati & Mixed Vegetable Curry',
    description: 'Fresh handmade chapatis accompanied by rich mixed vegetable sabzi. Leftover from afternoon reception banquet.',
    quantity: 24,
    unit: 'portions',
    pickupLocation: 'Swad Banquet Hall — Hinjawadi Phase 1',
    pickupDeadline: futureISO(5),
    donorName: 'Swad Banquet & Caterers',
    donorType: 'CATERER',
    status: 'CLAIMED',
    createdAt: pastISO(6.5),
  },
  {
    id: 108,
    foodName: 'Fresh Pav & Bakery Rolls',
    description: 'Freshly baked ladi pav, dinner buns, and soft sandwich loaves. Baked earlier today with premium ingredients.',
    quantity: 16,
    unit: 'packs',
    pickupLocation: 'Golden Crust Bakery — FC Road',
    pickupDeadline: futureISO(9),
    donorName: 'Golden Crust Bakery',
    donorType: 'RESTAURANT',
    status: 'AVAILABLE',
    createdAt: pastISO(1),
  },
];

const INITIAL_CLAIMS = [
  {
    id: 201,
    foodItemId: 103,
    foodName: 'Vegetable Pulao & Raita',
    recipientName: 'Asha Welfare Foundation',
    status: 'CLAIMED',
    claimedAt: pastISO(1),
  },
  {
    id: 202,
    foodItemId: 107,
    foodName: 'Chapati & Mixed Vegetable Curry',
    recipientName: 'Seva Community Kitchen',
    status: 'CLAIMED',
    claimedAt: pastISO(2),
  },
];

const INITIAL_HISTORY = [
  {
    id: 1,
    type: 'CLAIMED',
    title: 'Vegetable Pulao & Raita Claimed',
    time: pastISO(1),
    description: 'Asha Welfare Foundation claimed 15 portions from CSE Faculty Association.',
  },
  {
    id: 2,
    type: 'CLAIMED',
    title: 'Chapati & Mixed Vegetable Curry Claimed',
    time: pastISO(2),
    description: 'Seva Community Kitchen claimed 24 portions from Swad Banquet & Caterers.',
  },
  {
    id: 3,
    type: 'POSTED',
    title: 'Veg Biryani Listed',
    time: pastISO(2.5),
    description: 'College Cultural Committee posted 25 meal portions available for pickup.',
  },
  {
    id: 4,
    type: 'POSTED',
    title: 'Dal Tadka, Rice & Phulka Listed',
    time: pastISO(3.5),
    description: 'Shivaji Hostel Mess posted 30 meal portions available for pickup.',
  },
  {
    id: 5,
    type: 'POSTED',
    title: 'Steamed Idli & Sambar Combo Listed',
    time: pastISO(4),
    description: 'Annapurna Restaurant posted 20 portions available for pickup.',
  },
  {
    id: 6,
    type: 'POSTED',
    title: 'Assorted Grilled Sandwiches Listed',
    time: pastISO(1.5),
    description: 'Hotel Saffron posted 18 sandwich packs available for pickup.',
  },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    listings: INITIAL_LISTINGS,
    claims: INITIAL_CLAIMS,
    history: INITIAL_HISTORY,
    nextId: 109,
    nextClaimId: 203,
  };
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function getPresentationListings() {
  const state = loadState();
  return [...state.listings];
}

export function getPresentationListingById(id) {
  const state = loadState();
  const numId = Number(id);
  return state.listings.find((item) => item.id === numId) || null;
}

export function getPresentationClaims() {
  const state = loadState();
  return [...state.claims];
}

export function getPresentationHistory() {
  const state = loadState();
  return [...state.history];
}

export function claimPresentationListing(id) {
  const state = loadState();
  const numId = Number(id);
  const item = state.listings.find((i) => i.id === numId);

  if (!item) {
    throw new Error('Listing not found');
  }

  item.status = 'CLAIMED';
  const now = new Date().toISOString().slice(0, 19);

  const claim = {
    id: state.nextClaimId++,
    foodItemId: numId,
    foodName: item.foodName,
    recipientName: 'Authorized Recipient',
    status: 'CLAIMED',
    claimedAt: now,
  };

  state.claims.unshift(claim);

  state.history.unshift({
    id: Date.now(),
    type: 'CLAIMED',
    title: `${item.foodName} Claimed`,
    time: now,
    description: `Claim confirmed for ${item.quantity} ${item.unit} at ${item.pickupLocation}.`,
  });

  saveState(state);
  return claim;
}

export function addPresentationListing(data) {
  const state = loadState();
  const now = new Date().toISOString().slice(0, 19);

  const newListing = {
    id: state.nextId++,
    foodName: data.foodName,
    description: data.description,
    quantity: Number(data.quantity),
    unit: data.unit,
    pickupLocation: data.pickupLocation,
    pickupDeadline: data.pickupDeadline,
    donorName: data.donorName,
    donorType: data.donorType,
    status: 'AVAILABLE',
    createdAt: now,
  };

  state.listings.unshift(newListing);

  state.history.unshift({
    id: Date.now(),
    type: 'POSTED',
    title: `${newListing.foodName} Listed`,
    time: now,
    description: `${newListing.donorName} posted ${newListing.quantity} ${newListing.unit} for pickup.`,
  });

  saveState(state);
  return newListing;
}

