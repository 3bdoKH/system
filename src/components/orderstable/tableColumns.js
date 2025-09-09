import { formatDate } from "../../utils/formatters";
import { getOrderStatusText } from "./OrdersTable";
import { customers } from "../../data";

/**
 * Get customer name by ID
 * @param {number} customerId - The customer ID
 * @returns {string} The customer's full name or a placeholder
 */
const getCustomerName = (customerId) => {
  const customer = customers.find((c) => c.id === customerId);
  return customer ? customer.fullName : "غير معروف";
};

/**
 * Get customer phone by ID
 * @param {number} customerId - The customer ID
 * @returns {string} The customer's phone number or a placeholder
 */
const getCustomerPhone = (customerId) => {
  const customer = customers.find((c) => c.id === customerId);
  return customer ? customer.phone : "غير معروف";
};
export const allOrdersColumns = [
  {
    key: "id",
    header: "رقم الطلب",
    render: (order) => `#${order.id}`,
  },
  {
    key: "orderDate",
    header: "تاريخ الطلب",
    render: (order) =>
      formatDate(order.orderDate, { hour: undefined, minute: undefined }),
  },
  {
    key: "customerId",
    header: "العميل",
    render: (order) => getCustomerName(order.customerId),
  },
  {
    key: "totalPrice",
    header: "المبلغ",
    render: (order) => `${order.totalPrice + order.shippingCost} ريال`,
  },
  {
    key: "shippingAddress",
    header: "العنوان",
    render: (order) => order.shippingAddress || "غير محدد",
  },
  {
    key: "orderState",
    header: "الحالة",
    render: (order) => getOrderStatusText(order.orderState),
  },
];
export const newOrdersColumns = [
  {
    key: "id",
    header: "رقم الطلب",
    render: (order) => `#${order.id}`,
  },
  {
    key: "orderDate",
    header: "تاريخ الطلب",
    render: (order) =>
      formatDate(order.orderDate, { hour: undefined, minute: undefined }),
  },
  {
    key: "customerId",
    header: "العميل",
    render: (order) => getCustomerName(order.customerId),
  },
  {
    key: "customerId",
    header: "الهاتف",
    render: (order) => getCustomerPhone(order.customerId),
  },
  {
    key: "totalPrice",
    header: "المبلغ",
    render: (order) => `${order.totalPrice + order.shippingCost} ريال`,
  },
  {
    key: "orderState",
    header: "الحالة",
    render: (order) => getOrderStatusText(order.orderState),
  },
];
export const confirmedOrdersColumns = [
  {
    key: "id",
    header: "رقم الطلب",
    render: (order) => `#${order.id}`,
  },
  {
    key: "orderDate",
    header: "تاريخ الطلب",
    render: (order) =>
      formatDate(order.orderDate, { hour: undefined, minute: undefined }),
  },
  {
    key: "deliveryDate",
    header: "تاريخ التسليم المتوقع",
    render: (order) =>
      formatDate(order.deliveryDate, { hour: undefined, minute: undefined }),
  },
  {
    key: "customerId",
    header: "العميل",
    render: (order) => getCustomerName(order.customerId),
  },
  {
    key: "totalPrice",
    header: "المبلغ",
    render: (order) => `${order.totalPrice + order.shippingCost} ريال`,
  },
  {
    key: "orderState",
    header: "الحالة",
    render: (order) => getOrderStatusText(order.orderState),
  },
];
export const shippedOrdersColumns = [
  {
    key: "id",
    header: "رقم الطلب",
    render: (order) => `#${order.id}`,
  },
  {
    key: "orderDate",
    header: "تاريخ الطلب",
    render: (order) =>
      formatDate(order.orderDate, { hour: undefined, minute: undefined }),
  },
  {
    key: "customerId",
    header: "العميل",
    render: (order) => getCustomerName(order.customerId),
  },
  {
    key: "trackingCode",
    header: "رمز التتبع",
    render: (order) => order.trackingCode || "غير متوفر",
  },
  {
    key: "shippingAddress",
    header: "العنوان",
    render: (order) => order.shippingAddress || "غير محدد",
  },
  {
    key: "orderState",
    header: "الحالة",
    render: (order) => getOrderStatusText(order.orderState),
  },
];
export const delayedOrdersColumns = [
  {
    key: "id",
    header: "رقم الطلب",
    render: (order) => `#${order.id}`,
  },
  {
    key: "orderDate",
    header: "تاريخ الطلب",
    render: (order) =>
      formatDate(order.orderDate, { hour: undefined, minute: undefined }),
  },
  {
    key: "delayedUntil",
    header: "مؤجل حتى",
    render: (order) =>
      formatDate(order.delayedUntil, { hour: undefined, minute: undefined }),
  },
  {
    key: "customerId",
    header: "العميل",
    render: (order) => getCustomerName(order.customerId),
  },
  {
    key: "delayedReason",
    header: "سبب التأجيل",
    render: (order) => order.delayedReason || "غير محدد",
  },
  {
    key: "orderState",
    header: "الحالة",
    render: (order) => getOrderStatusText(order.orderState),
  },
];

export const getOrderStatusFilterOptions = () => {
  return ["جديد", "مؤكد", "مؤجل", "ملغي", "مشحون", "مستلم", "مرتجع", "مكتمل"];
};
