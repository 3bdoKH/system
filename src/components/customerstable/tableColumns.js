import React from "react";

/**
 * Helper function to convert customerState values to status text
 * @param {Number} customerState The customer state value
 * @returns {String} The status text in Arabic
 */
export const getCustomerStatusText = (customerState) => {
  const statusMap = {
    0: "غير نشط",
    1: "نشط",
    2: "محظور",
  };
  return statusMap[customerState] || "غير معروف";
};

/**
 * Helper function to get status class based on customer state
 * @param {Number} customerState The customer state value
 * @returns {String} CSS class name
 */
export const getCustomerStatusClass = (customerState) => {
  switch (customerState) {
    case 0:
      return "inactive";
    case 1:
      return "active";
    case 2:
      return "banned";
    default:
      return "default";
  }
};

/**
 * Column definitions for customers table
 */
export const customersColumns = [
  {
    key: "id",
    header: "الرقم التعريفي",
    render: (customer) => `#${customer.id}`,
  },
  {
    key: "fullName",
    header: "اسم العميل",
    render: (customer) => customer.fullName,
  },
  {
    key: "phone",
    header: "رقم الهاتف",
    render: (customer) => customer.phone,
  },
  {
    key: "location",
    header: "الموقع",
    render: (customer) => customer.location,
  },
  {
    key: "customerState",
    header: "الحالة",
    render: (customer) => (
      <span
        className={`status-pill status-${getCustomerStatusClass(
          customer.customerState
        )}`}
      >
        {getCustomerStatusText(customer.customerState)}
      </span>
    ),
  },
  {
    key: "subSystem",
    header: "النظام الفرعي",
    render: (customer) => customer.subSystem?.name || "غير محدد",
  },
];
