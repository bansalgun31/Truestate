import React, { useState, useRef, useEffect } from "react";

/*
  FilterChips.jsx (robust Clear)
  - Calls onChange(nextFilters)
  - Removes param from URL
  - Dispatches popstate so useSearchParams picks up change
  - Minimal console logs for debugging
*/

function useClickOutside(refs, handler) {
  useEffect(
    function () {
      function onDocClick(e) {
        for (var i = 0; i < refs.length; i++) {
          var r = refs[i];
          if (!r || !r.current) continue;
          if (r.current.contains(e.target)) return;
        }
        handler();
      }
      document.addEventListener("mousedown", onDocClick);
      return function () {
        document.removeEventListener("mousedown", onDocClick);
      };
    },
    [refs, handler]
  );
}

export default function FilterChips(props) {
  var filters = props.filters || {};
  var onChange = props.onChange || function () {};
  var onReset = props.onReset || function () {};

  var CHIP_LIST = [
    { key: "regions", label: "Customer Region" },
    { key: "genders", label: "Gender" },
    { key: "age", label: "Age Range" },
    { key: "categories", label: "Product Category" },
    { key: "tags", label: "Tags" },
    { key: "paymentMethods", label: "Payment Method" },
    { key: "date", label: "Date" },
    { key: "customerType", label: "Customer Type" },
    { key: "brand", label: "Brand" },
    { key: "deliveryType", label: "Delivery Type" },
  ];

  var ALL_REGIONS = ["North", "South", "East", "West"];
  var ALL_GENDERS = ["Male", "Female", "Other"];
  var ALL_CATEGORIES = ["Electronics", "Apparel", "Grocery"];
  var ALL_TAGS = ["New", "Featured", "Sale"];
  var ALL_PAYMENTS = ["Card", "Cash", "UPI"];
  var ALL_CUSTOMER_TYPES = ["Retail", "Wholesale", "Employee"];
  var ALL_BRANDS = ["BrandA", "BrandB", "BrandC"];
  var ALL_DELIVERIES = ["Home", "Store Pickup", "Courier"];

  var wrappersRef = useRef({});
  var popoverRef = useRef(null);
  var [openKey, setOpenKey] = useState(null);

  CHIP_LIST.forEach(function (c) {
    if (!wrappersRef.current[c.key])
      wrappersRef.current[c.key] = { current: null };
  });
  wrappersRef.current.popover = popoverRef;

  useClickOutside(
    Object.keys(wrappersRef.current).map(function (k) {
      return wrappersRef.current[k];
    }),
    function () {
      setOpenKey(null);
    }
  );

  function toggle(key) {
    if (openKey === key) setOpenKey(null);
    else setOpenKey(key);
  }

  function buildInitialLocal(key) {
    var f = filters || {};
    if (key === "regions")
      return { regions: Array.isArray(f.regions) ? f.regions.slice(0) : [] };
    if (key === "genders")
      return { genders: Array.isArray(f.genders) ? f.genders.slice(0) : [] };
    if (key === "age")
      return { ageMin: f.ageMin || "", ageMax: f.ageMax || "" };
    if (key === "categories")
      return {
        categories: Array.isArray(f.categories) ? f.categories.slice(0) : [],
      };
    if (key === "tags")
      return { tags: Array.isArray(f.tags) ? f.tags.slice(0) : [] };
    if (key === "paymentMethods")
      return {
        paymentMethods: Array.isArray(f.paymentMethods)
          ? f.paymentMethods.slice(0)
          : [],
      };
    if (key === "date")
      return { dateFrom: f.dateFrom || "", dateTo: f.dateTo || "" };
    if (key === "customerType")
      return {
        customerType: Array.isArray(f.customerType)
          ? f.customerType.slice(0)
          : [],
      };
    if (key === "brand")
      return { brand: Array.isArray(f.brand) ? f.brand.slice(0) : [] };
    if (key === "deliveryType")
      return {
        deliveryType: Array.isArray(f.deliveryType)
          ? f.deliveryType.slice(0)
          : [],
      };
    return {};
  }

  function applyPatchAndClose(patch) {
    var next = {};
    for (var k in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, k))
        next[k] = filters[k];
    }
    for (var p in patch) {
      if (Object.prototype.hasOwnProperty.call(patch, p)) next[p] = patch[p];
    }
    console.log(
      "[FilterChips] applying patch:",
      patch,
      " -> next filters:",
      next
    );
    try {
      onChange(next);
    } catch (e) {
      console.error("[FilterChips] onChange apply error", e);
    }
    setOpenKey(null);
  }

  function clearKeyAndClose(key) {
    var next = {};
    for (var k in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, k))
        next[k] = filters[k];
    }

    if (key === "age") {
      delete next.ageMin;
      delete next.ageMax;
    } else if (key === "date") {
      delete next.dateFrom;
      delete next.dateTo;
    } else {
      delete next[key];
    }

    console.log("[FilterChips] clearing key:", key, " -> next filters:", next);

    // primary: call parent
    try {
      onChange(next);
    } catch (e) {
      console.error("[FilterChips] onChange clear error", e);
    }

    // fallback: remove URL param(s) directly and dispatch popstate so router updates
    try {
      var usp = new URLSearchParams(window.location.search);
      if (key === "age") {
        usp.delete("ageMin");
        usp.delete("ageMax");
      } else if (key === "date") {
        usp.delete("dateFrom");
        usp.delete("dateTo");
      } else {
        usp.delete(key);
      }
      var newSearch = usp.toString();
      var newUrl =
        window.location.pathname + (newSearch ? "?" + newSearch : "");
      window.history.replaceState({}, "", newUrl);

      // dispatch popstate event so react-router/useSearchParams refreshes
      try {
        var ev = document.createEvent("Event");
        ev.initEvent("popstate", true, true);
        window.dispatchEvent(ev);
      } catch (evErr) {
        // fallback - modern API
        try {
          window.dispatchEvent(new PopStateEvent("popstate"));
        } catch (err2) {
          /* ignore */
        }
      }

      console.log("[FilterChips] URL after clear:", window.location.href);
    } catch (err) {
      console.error("[FilterChips] failed to update URL directly", err);
    }

    setOpenKey(null);
  }

  /* ---------- Panels (same as before) ---------- */
  function RegionsPanel(props) {
    var initial = props.initial || { regions: [] };
    var onApply = props.onApply || function () {};
    var onClear = props.onClear || function () {};
    var _useState = useState(initial),
      local = _useState[0],
      setLocal = _useState[1];

    function toggleRegion(r) {
      var arr = (local.regions || []).slice(0);
      var idx = arr.indexOf(r);
      if (idx === -1) arr.push(r);
      else arr.splice(idx, 1);
      setLocal({ regions: arr });
    }

    return React.createElement(
      "div",
      null,
      ALL_REGIONS.map(function (r) {
        var checked =
          Array.isArray(local.regions) && local.regions.indexOf(r) !== -1;
        return React.createElement(
          "label",
          { key: r, style: { display: "block", marginBottom: 6 } },
          React.createElement("input", {
            type: "checkbox",
            checked: checked,
            onChange: function () {
              toggleRegion(r);
            },
          }),
          " ",
          r
        );
      }),
      React.createElement(
        "div",
        { style: { marginTop: 10, display: "flex", gap: 8 } },
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onApply({ regions: local.regions || [] });
            },
          },
          "Apply"
        ),
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onClear();
            },
          },
          "Clear"
        )
      )
    );
  }

  function GendersPanel(props) {
    var initial = props.initial || { genders: [] };
    var onApply = props.onApply || function () {};
    var onClear = props.onClear || function () {};
    var _useState2 = useState(initial),
      local = _useState2[0],
      setLocal = _useState2[1];

    function toggleGender(g) {
      var arr = (local.genders || []).slice(0);
      var idx = arr.indexOf(g);
      if (idx === -1) arr.push(g);
      else arr.splice(idx, 1);
      setLocal({ genders: arr });
    }

    return React.createElement(
      "div",
      null,
      ALL_GENDERS.map(function (g) {
        var checked =
          Array.isArray(local.genders) && local.genders.indexOf(g) !== -1;
        return React.createElement(
          "label",
          { key: g, style: { display: "block", marginBottom: 6 } },
          React.createElement("input", {
            type: "checkbox",
            checked: checked,
            onChange: function () {
              toggleGender(g);
            },
          }),
          " ",
          g
        );
      }),
      React.createElement(
        "div",
        { style: { marginTop: 10, display: "flex", gap: 8 } },
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onApply({ genders: local.genders || [] });
            },
          },
          "Apply"
        ),
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onClear();
            },
          },
          "Clear"
        )
      )
    );
  }

  function AgePanel(props) {
    var initial = props.initial || { ageMin: "", ageMax: "" };
    var onApply = props.onApply || function () {};
    var onClear = props.onClear || function () {};
    var _useState3 = useState(initial),
      local = _useState3[0],
      setLocal = _useState3[1];

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        null,
        React.createElement("input", {
          type: "number",
          placeholder: "Min",
          value: local.ageMin || "",
          onChange: function (e) {
            setLocal(Object.assign({}, local, { ageMin: e.target.value }));
          },
          style: { width: 80, marginRight: 8 },
        }),
        React.createElement("input", {
          type: "number",
          placeholder: "Max",
          value: local.ageMax || "",
          onChange: function (e) {
            setLocal(Object.assign({}, local, { ageMax: e.target.value }));
          },
          style: { width: 80 },
        })
      ),
      React.createElement(
        "div",
        { style: { marginTop: 10, display: "flex", gap: 8 } },
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onApply({ ageMin: local.ageMin, ageMax: local.ageMax });
            },
          },
          "Apply"
        ),
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onClear();
            },
          },
          "Clear"
        )
      )
    );
  }

  function CategoriesPanel(props) {
    var initial = props.initial || { categories: [] };
    var onApply = props.onApply || function () {};
    var onClear = props.onClear || function () {};
    var _useState4 = useState(initial),
      local = _useState4[0],
      setLocal = _useState4[1];

    function toggleC(c) {
      var arr = (local.categories || []).slice(0);
      var idx = arr.indexOf(c);
      if (idx === -1) arr.push(c);
      else arr.splice(idx, 1);
      setLocal({ categories: arr });
    }

    return React.createElement(
      "div",
      null,
      ALL_CATEGORIES.map(function (c) {
        var checked =
          Array.isArray(local.categories) && local.categories.indexOf(c) !== -1;
        return React.createElement(
          "label",
          { key: c, style: { display: "block", marginBottom: 6 } },
          React.createElement("input", {
            type: "checkbox",
            checked: checked,
            onChange: function () {
              toggleC(c);
            },
          }),
          " ",
          c
        );
      }),
      React.createElement(
        "div",
        { style: { marginTop: 10, display: "flex", gap: 8 } },
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onApply({ categories: local.categories || [] });
            },
          },
          "Apply"
        ),
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onClear();
            },
          },
          "Clear"
        )
      )
    );
  }

  function TagsPanel(props) {
    var initial = props.initial || { tags: [] };
    var onApply = props.onApply || function () {};
    var onClear = props.onClear || function () {};
    var _useState5 = useState(initial),
      local = _useState5[0],
      setLocal = _useState5[1];

    function toggleT(t) {
      var arr = (local.tags || []).slice(0);
      var idx = arr.indexOf(t);
      if (idx === -1) arr.push(t);
      else arr.splice(idx, 1);
      setLocal({ tags: arr });
    }

    return React.createElement(
      "div",
      null,
      ALL_TAGS.map(function (t) {
        var checked = Array.isArray(local.tags) && local.tags.indexOf(t) !== -1;
        return React.createElement(
          "label",
          { key: t, style: { display: "block", marginBottom: 6 } },
          React.createElement("input", {
            type: "checkbox",
            checked: checked,
            onChange: function () {
              toggleT(t);
            },
          }),
          " ",
          t
        );
      }),
      React.createElement(
        "div",
        { style: { marginTop: 10, display: "flex", gap: 8 } },
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onApply({ tags: local.tags || [] });
            },
          },
          "Apply"
        ),
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onClear();
            },
          },
          "Clear"
        )
      )
    );
  }

  function PaymentsPanel(props) {
    var initial = props.initial || { paymentMethods: [] };
    var onApply = props.onApply || function () {};
    var onClear = props.onClear || function () {};
    var _useState6 = useState(initial),
      local = _useState6[0],
      setLocal = _useState6[1];

    function toggleP(p) {
      var arr = (local.paymentMethods || []).slice(0);
      var idx = arr.indexOf(p);
      if (idx === -1) arr.push(p);
      else arr.splice(idx, 1);
      setLocal({ paymentMethods: arr });
    }

    return React.createElement(
      "div",
      null,
      ALL_PAYMENTS.map(function (p) {
        var checked =
          Array.isArray(local.paymentMethods) &&
          local.paymentMethods.indexOf(p) !== -1;
        return React.createElement(
          "label",
          { key: p, style: { display: "block", marginBottom: 6 } },
          React.createElement("input", {
            type: "checkbox",
            checked: checked,
            onChange: function () {
              toggleP(p);
            },
          }),
          " ",
          p
        );
      }),
      React.createElement(
        "div",
        { style: { marginTop: 10, display: "flex", gap: 8 } },
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onApply({ paymentMethods: local.paymentMethods || [] });
            },
          },
          "Apply"
        ),
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onClear();
            },
          },
          "Clear"
        )
      )
    );
  }

  function DatePanel(props) {
    var initial = props.initial || { dateFrom: "", dateTo: "" };
    var onApply = props.onApply || function () {};
    var onClear = props.onClear || function () {};
    var _useState7 = useState(initial),
      local = _useState7[0],
      setLocal = _useState7[1];

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        null,
        React.createElement("input", {
          type: "date",
          value: local.dateFrom || "",
          onChange: function (e) {
            setLocal(Object.assign({}, local, { dateFrom: e.target.value }));
          },
          style: { marginRight: 8 },
        }),
        React.createElement("input", {
          type: "date",
          value: local.dateTo || "",
          onChange: function (e) {
            setLocal(Object.assign({}, local, { dateTo: e.target.value }));
          },
        })
      ),
      React.createElement(
        "div",
        { style: { marginTop: 10, display: "flex", gap: 8 } },
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onApply({ dateFrom: local.dateFrom, dateTo: local.dateTo });
            },
          },
          "Apply"
        ),
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onClear();
            },
          },
          "Clear"
        )
      )
    );
  }

  function CustomerTypePanel(props) {
    var initial = props.initial || { customerType: [] };
    var onApply = props.onApply || function () {};
    var onClear = props.onClear || function () {};
    var _useState8 = useState(initial),
      local = _useState8[0],
      setLocal = _useState8[1];

    function toggleCT(ct) {
      var arr = (local.customerType || []).slice(0);
      var idx = arr.indexOf(ct);
      if (idx === -1) arr.push(ct);
      else arr.splice(idx, 1);
      setLocal({ customerType: arr });
    }

    return React.createElement(
      "div",
      null,
      ALL_CUSTOMER_TYPES.map(function (c) {
        var checked =
          Array.isArray(local.customerType) &&
          local.customerType.indexOf(c) !== -1;
        return React.createElement(
          "label",
          { key: c, style: { display: "block", marginBottom: 6 } },
          React.createElement("input", {
            type: "checkbox",
            checked: checked,
            onChange: function () {
              toggleCT(c);
            },
          }),
          " ",
          c
        );
      }),
      React.createElement(
        "div",
        { style: { marginTop: 10, display: "flex", gap: 8 } },
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onApply({ customerType: local.customerType || [] });
            },
          },
          "Apply"
        ),
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onClear();
            },
          },
          "Clear"
        )
      )
    );
  }

  function BrandPanel(props) {
    var initial = props.initial || { brand: [] };
    var onApply = props.onApply || function () {};
    var onClear = props.onClear || function () {};
    var _useState9 = useState(initial),
      local = _useState9[0],
      setLocal = _useState9[1];

    function toggleB(b) {
      var arr = (local.brand || []).slice(0);
      var idx = arr.indexOf(b);
      if (idx === -1) arr.push(b);
      else arr.splice(idx, 1);
      setLocal({ brand: arr });
    }

    return React.createElement(
      "div",
      null,
      ALL_BRANDS.map(function (b) {
        var checked =
          Array.isArray(local.brand) && local.brand.indexOf(b) !== -1;
        return React.createElement(
          "label",
          { key: b, style: { display: "block", marginBottom: 6 } },
          React.createElement("input", {
            type: "checkbox",
            checked: checked,
            onChange: function () {
              toggleB(b);
            },
          }),
          " ",
          b
        );
      }),
      React.createElement(
        "div",
        { style: { marginTop: 10, display: "flex", gap: 8 } },
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onApply({ brand: local.brand || [] });
            },
          },
          "Apply"
        ),
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onClear();
            },
          },
          "Clear"
        )
      )
    );
  }

  function DeliveryPanel(props) {
    var initial = props.initial || { deliveryType: [] };
    var onApply = props.onApply || function () {};
    var onClear = props.onClear || function () {};
    var _useState10 = useState(initial),
      local = _useState10[0],
      setLocal = _useState10[1];

    function toggleD(d) {
      var arr = (local.deliveryType || []).slice(0);
      var idx = arr.indexOf(d);
      if (idx === -1) arr.push(d);
      else arr.splice(idx, 1);
      setLocal({ deliveryType: arr });
    }

    return React.createElement(
      "div",
      null,
      ALL_DELIVERIES.map(function (d) {
        var checked =
          Array.isArray(local.deliveryType) &&
          local.deliveryType.indexOf(d) !== -1;
        return React.createElement(
          "label",
          { key: d, style: { display: "block", marginBottom: 6 } },
          React.createElement("input", {
            type: "checkbox",
            checked: checked,
            onChange: function () {
              toggleD(d);
            },
          }),
          " ",
          d
        );
      }),
      React.createElement(
        "div",
        { style: { marginTop: 10, display: "flex", gap: 8 } },
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onApply({ deliveryType: local.deliveryType || [] });
            },
          },
          "Apply"
        ),
        React.createElement(
          "button",
          {
            className: "page-btn",
            onClick: function () {
              onClear();
            },
          },
          "Clear"
        )
      )
    );
  }

  function renderPanel(key, initial, onApply, onClear) {
    if (key === "regions")
      return React.createElement(RegionsPanel, {
        initial: initial,
        onApply: onApply,
        onClear: onClear,
      });
    if (key === "genders")
      return React.createElement(GendersPanel, {
        initial: initial,
        onApply: onApply,
        onClear: onClear,
      });
    if (key === "age")
      return React.createElement(AgePanel, {
        initial: initial,
        onApply: onApply,
        onClear: onClear,
      });
    if (key === "categories")
      return React.createElement(CategoriesPanel, {
        initial: initial,
        onApply: onApply,
        onClear: onClear,
      });
    if (key === "tags")
      return React.createElement(TagsPanel, {
        initial: initial,
        onApply: onApply,
        onClear: onClear,
      });
    if (key === "paymentMethods")
      return React.createElement(PaymentsPanel, {
        initial: initial,
        onApply: onApply,
        onClear: onClear,
      });
    if (key === "date")
      return React.createElement(DatePanel, {
        initial: initial,
        onApply: onApply,
        onClear: onClear,
      });
    if (key === "customerType")
      return React.createElement(CustomerTypePanel, {
        initial: initial,
        onApply: onApply,
        onClear: onClear,
      });
    if (key === "brand")
      return React.createElement(BrandPanel, {
        initial: initial,
        onApply: onApply,
        onClear: onClear,
      });
    if (key === "deliveryType")
      return React.createElement(DeliveryPanel, {
        initial: initial,
        onApply: onApply,
        onClear: onClear,
      });
    return null;
  }

  return React.createElement(
    "div",
    {
      style: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
      },
    },
    CHIP_LIST.map(function (c) {
      var isOpen = openKey === c.key;
      var initial = buildInitialLocal(c.key);
      return React.createElement(
        "div",
        {
          key: c.key,
          className: "chip-popover",
          ref: function (el) {
            if (el) wrappersRef.current[c.key].current = el;
          },
        },
        React.createElement(
          "button",
          {
            className: "chip",
            type: "button",
            onClick: function () {
              toggle(c.key);
            },
          },
          c.label + " ▾"
        ),
        isOpen
          ? React.createElement(
              "div",
              { className: "popover-panel", ref: popoverRef },
              renderPanel(
                c.key,
                initial,
                function (patch) {
                  applyPatchAndClose(patch);
                },
                function () {
                  clearKeyAndClose(c.key);
                }
              )
            )
          : null
      );
    }),
    React.createElement(
      "button",
      {
        className: "chip",
        onClick: function () {
          onReset();
          setOpenKey(null);
        },
      },
      "Reset Filters"
    )
  );
}
