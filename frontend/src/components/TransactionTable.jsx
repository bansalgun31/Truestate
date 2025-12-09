import React from "react";

function getField(obj, candidates) {
  if (!obj) return "";
  for (var i = 0; i < candidates.length; i++) {
    var k = candidates[i];
    if (typeof obj[k] !== "undefined" && obj[k] !== null) return obj[k];
  }
  return "";
}

function formatDate(d) {
  if (!d) return "";
  // if already a Date object
  if (d instanceof Date) return d.toLocaleString();
  // try parsing string
  var dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d);
  return dt.toLocaleString();
}

export default function TransactionTable(props) {
  var data = props.data || [];
  var loading = props.loading;

  return (
    <div className="table-card">
      <table className="min-w-full">
        <thead className="table-head">
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Customer Region</th>
            <th>Customer Type</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Brand</th>
            <th>Product Category</th>
            <th>Tags</th>
            <th>Quantity</th>
            <th className="text-right">Price per Unit</th>
            <th className="text-right">Discount %</th>
            <th className="text-right">Total Amount</th>
            <th className="text-right">Final Amount</th>
            <th>Payment Method</th>
            <th>Order Status</th>
            <th>Delivery Type</th>
            <th>Store ID</th>
            <th>Store Location</th>
            <th>Salesperson ID</th>
            <th>Employee Name</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={27} style={{ padding: 20 }}>
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={27} style={{ padding: 20 }}>
                No records found
              </td>
            </tr>
          ) : (
            data.map(function (t, i) {
              // Transaction id: prefer explicit "Transaction ID" or _id
              var transactionId =
                getField(t, [
                  "Transaction ID",
                  "transactionId",
                  "TransactionID",
                  "transaction_id",
                  "transaction",
                  "id",
                  "_id",
                ]) || "";

              var date = getField(t, [
                "Date",
                "date",
                "createdAt",
                "timestamp",
                "DateTime",
              ]);

              var customerId = getField(t, [
                "Customer ID",
                "customerId",
                "CustomerID",
                "customer_id",
                "customer",
              ]);

              var customerName = getField(t, [
                "Customer Name",
                "customerName",
                "CustomerName",
                "customer_name",
                "Customer",
                "name",
              ]);

              var phone = getField(t, [
                "Phone Number",
                "phoneNumber",
                "phone",
                "Phone",
                "PhoneNumber",
                "contact",
              ]);

              var gender = getField(t, ["Gender", "gender"]);
              var age = getField(t, ["Age", "age"]);
              var customerRegion = getField(t, [
                "Customer Region",
                "customerRegion",
                "CustomerRegion",
                "region",
              ]);
              var customerType = getField(t, [
                "Customer Type",
                "customerType",
                "CustomerType",
              ]);

              // product may be nested or flat
              var product = t.product || t.productDetails || t.productDetail || {};
              var productId =
                getField(product, [
                  "Product ID",
                  "productId",
                  "id",
                  "product_id",
                  "sku",
                ]) || getField(t, ["Product ID", "productId", "ProductID"]);

              var productName =
                getField(product, [
                  "Product Name",
                  "name",
                  "productName",
                  "ProductName",
                ]) || getField(t, ["Product Name", "productName", "Product"]);

              var brand =
                getField(product, ["Brand", "brand"]) ||
                getField(t, ["Brand", "brand"]);

              var productCategory =
                getField(product, [
                  "Product Category",
                  "category",
                  "ProductCategory",
                  "productCategory",
                ]) || getField(t, ["Product Category", "productCategory"]);

              var tags =
                getField(product, ["Tags", "tags"]) ||
                getField(t, ["Tags", "tags", "tag"]);

              var quantity = getField(t, ["Quantity", "quantity", "qty"]);
              var pricePerUnit = getField(t, [
                "Price per Unit",
                "pricePerUnit",
                "price_per_unit",
                "price",
                "unitPrice",
              ]);
              var discountPercentage = getField(t, [
                "Discount Percentage",
                "discountPercentage",
                "discount",
                "DiscountPercentage",
                "Discount %",
              ]);
              var totalAmount = getField(t, [
                "Total Amount",
                "totalAmount",
                "total",
                "TotalAmount",
              ]);
              var finalAmount = getField(t, [
                "Final Amount",
                "finalAmount",
                "final_amount",
                "final",
              ]);
              var paymentMethod = getField(t, [
                "Payment Method",
                "paymentMethod",
                "PaymentMethod",
              ]);
              var orderStatus = getField(t, [
                "Order Status",
                "orderStatus",
                "OrderStatus",
                "status",
              ]);
              var deliveryType = getField(t, [
                "Delivery Type",
                "deliveryType",
                "DeliveryType",
              ]);
              var storeId = getField(t, ["Store ID", "storeId", "StoreID"]);
              var storeLocation = getField(t, [
                "Store Location",
                "storeLocation",
                "StoreLocation",
              ]);
              var salespersonId = getField(t, [
                "Salesperson ID",
                "salespersonId",
                "SalespersonID",
              ]);
              var employeeName = getField(t, [
                "Employee Name",
                "employeeName",
                "EmployeeName",
              ]);

              return (
                <tr key={transactionId || i} className="table-row">
                  <td>{transactionId}</td>
                  <td>{formatDate(date)}</td>
                  <td>{customerId}</td>
                  <td>{customerName}</td>
                  <td>{phone}</td>
                  <td>{gender}</td>
                  <td>{age}</td>
                  <td>{customerRegion}</td>
                  <td>{customerType}</td>
                  <td>{productId}</td>
                  <td>{productName}</td>
                  <td>{brand}</td>
                  <td>{productCategory}</td>
                  <td>{Array.isArray(tags) ? tags.join(", ") : tags}</td>
                  <td className="text-right">{quantity}</td>
                  <td className="text-right">{pricePerUnit}</td>
                  <td className="text-right">{discountPercentage}</td>
                  <td className="text-right">{totalAmount}</td>
                  <td className="text-right">{finalAmount}</td>
                  <td>{paymentMethod}</td>
                  <td>{orderStatus}</td>
                  <td>{deliveryType}</td>
                  <td>{storeId}</td>
                  <td>{storeLocation}</td>
                  <td>{salespersonId}</td>
                  <td>{employeeName}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
