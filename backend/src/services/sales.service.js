const saleModel = require('../models/sale.model.js');

async function getAllSales({
  page = 1,
  search = "",
  CustomerRegion = "",
  Gender = "",
  ProductCategory = "",
  Tags = "",
  PaymentMethod = "",
  AgeMin = "",
  AgeMax = "",
  DateStart = "",
  DateEnd = "",
  SortBy = "",
  SortOrder = "asc",
}) {
  const pageSize = 10;
  let query = {};

  function toArray(value) {
    return value && value.trim()
      ? value.split(',').map(v => v.trim())
      : [];
  }

  const regionArr = toArray(CustomerRegion);
  const genderArr = toArray(Gender);
  const categoryArr = toArray(ProductCategory);
  const tagsArr = toArray(Tags);
  const paymentArr = toArray(PaymentMethod);

  
  if (search.trim()) {
    query.$or = [
      { ["Customer Name"]: { $regex: search , $options: 'i' } },
      { PhoneNumber: { $regex: String(search), $options: 'i' } }
    ];
  }

  
  if (regionArr.length > 0) {
    query["Customer Region"] = { $in: regionArr };
  }

  if (genderArr.length > 0) {
    query.Gender = { $in: genderArr };
  }

  if (paymentArr.length > 0) {
    query["Payment Method"] = { $in: paymentArr };
  }

  if (categoryArr.length > 0) {
    query["Product Category"] = { $in: categoryArr };
  }

  if (tagsArr.length > 0) {
    query["Tags"] = { $in: tagsArr };
  }

 
  if (AgeMin || AgeMax) {
    query.Age = {};
    if (AgeMin) query.Age.$gte = parseInt(AgeMin);
    if (AgeMax) query.Age.$lte = parseInt(AgeMax);
  }


  if (DateStart || DateEnd) {
    query.Date = {};
    if (DateStart) query.Date.$gte = DateStart;
    if (DateEnd) query.Date.$lte = DateEnd;
  }

  
  let sort = {};

  if (SortBy === "Date") {
  sort.Date = SortOrder === "asc" ? 1 : -1;
} else if (SortBy === "Quantity") {
  sort.Quantity = SortOrder === "asc" ? 1 : -1;
} else if (SortBy === "Customer Name") {
  sort["Customer Name"] = SortOrder === "asc" ? 1 : -1;
} else {
  // If frontend sends nothing or invalid field
  sort["Customer Name"] = 1;      // default safe sort
}
  console.log("===== FINAL QUERY SENT TO MONGO =====");
console.log(JSON.stringify(query, null, 2));

console.log("===== SORT =====");
console.log(sort);

  const total = await saleModel.countDocuments(query);

  const sales = await saleModel.find(query)
    .sort(sort)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const metadata = {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNextPage: page * pageSize < total,
    hasPrevPage: page > 1,
  };

  return { sales, metadata };
}

module.exports = { getAllSales };
