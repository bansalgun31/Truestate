// src/services/api.js

var API_BASE = "http://localhost:5000"; 

// -------------------------------------------
// Convert FRONTEND filter keys → BACKEND keys
// -------------------------------------------
function normalizeParams(front) {
   const back = {};

  // pagination + search
  if (front.page !== undefined) back.page = front.page;
  if (front.search) back.search = front.search;

  // multi-select filters
  if (front.regions && front.regions.length)
    back.CustomerRegion = front.regions.join(",");

  if (front.genders && front.genders.length)
    back.Gender = front.genders.join(",");

  if (front.categories && front.categories.length)
    back.ProductCategory = front.categories.join(",");    // FIXED

  if (front.tags && front.tags.length)
    back.Tags = front.tags.join(",");

  if (front.paymentMethods && front.paymentMethods.length)
    back.PaymentMethod = front.paymentMethods.join(",");  // FIXED

  // range filters
  if (front.ageMin) back.AgeMin = front.ageMin;
  if (front.ageMax) back.AgeMax = front.ageMax;

  if (front.dateFrom) back.DateStart = front.dateFrom;
  if (front.dateTo) back.DateEnd = front.dateTo;

  // sorting
  // sorting
// Always send SortBy, otherwise Mongo crashes
if (front.sortBy) {
  back.SortBy = front.sortBy;
} else {
  back.SortBy = "Date";    // pick any real column name from DB
}

// Only send SortOrder if SortBy exists
if (front.sortOrder && back.SortBy) {
  back.SortOrder = front.sortOrder;
}


  return back;
}

// -------------------------------------------
// Build Query String
// -------------------------------------------
function buildQuery(params) {
  params = params || {};
  var usp = new URLSearchParams();

  Object.entries(params).forEach(function ([key, value]) {
    if (value === undefined || value === null) return;

    // backend only accepts string or number — already normalized above
    if (value !== "") usp.append(key, value);
  });

  var qs = usp.toString();
  return qs ? "?" + qs : "";
}

// -------------------------------------------
// MAIN FETCH FUNCTION
// -------------------------------------------
export async function fetchTransactions(frontParams) {
  console.log("fetchTransactions() CALLED WITH:", frontParams);
  const backendParams = normalizeParams(frontParams);
  const q = buildQuery(backendParams);
   console.log("FINAL QUERY:", q);
  const url = API_BASE + "/api/sales" + q;
  console.log("CALLING URL:", url);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    let txt = "";
    try {
      txt = await res.text();
    } catch (e) {
      txt = "";
    }
    throw new Error("API error " + res.status + ": " + txt);
  }

  const body = await res.json();

  // Backend format: { data: { sales: [], metadata:{...} }, success:true }
  let results = [];
  let total = 0;
  let totalPages = 1;

  if (body && body.data && Array.isArray(body.data.sales)) {
    results = body.data.sales;
    const meta = body.data.metadata || {};
    total = meta.total || results.length;
    totalPages = meta.totalPages || 1;
  } else {
    // fallback safety
    results = [];
    total = 0;
    totalPages = 1;
  }

  return { results, total, totalPages, raw: body };
}
