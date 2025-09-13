import React from 'react';
import './ReturnsTable.css';
import { Clock, CheckCircle, X } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { customers } from '../../data';

/**
 * ReturnsTable - A component for displaying returned orders
 * 
 * @param {Object} props - Component props
 * @param {Array} props.returns - Array of return objects
 * @param {string} props.userRole - Current user role (accountant or stock_manager)
 * @param {Function} props.onRowClick - Function called when a row is clicked
 * @returns {JSX.Element} The rendered component
 */
const ReturnsTable = ({ returns = [], userRole = 'accountant', onRowClick }) => {
  // Helper function to get customer name
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.fullName : "غير معروف";
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="status-badge pending">
            <Clock size={14} />
            بانتظار المراجعة
          </span>
        );
      case 'approved':
        return (
          <span className="status-badge approved">
            <CheckCircle size={14} />
            تمت الموافقة
          </span>
        );
      case 'rejected':
        return (
          <span className="status-badge rejected">
            <X size={14} />
            تم الرفض
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="returns-table-container">
      <table className="returns-table">
        <thead>
          <tr>
            <th>رقم الطلب</th>
            <th>تاريخ الإرجاع</th>
            <th>العميل</th>
            <th>سبب الإرجاع</th>
            <th>المبلغ المسترجع</th>
            <th>تاريخ الاسترجاع</th>
            <th>حالة الطلب</th>
          </tr>
        </thead>
        <tbody>
          {returns.length > 0 ? (
            returns.map((returnItem) => (
              <tr key={returnItem.id} onClick={() => onRowClick(returnItem)} className="return-row">
                <td className="order-id">{returnItem.id}</td>
                <td>{formatDate(returnItem.returnDate)}</td>
                <td>{getCustomerName(returnItem.customerId)}</td>
                <td className="return-reason">{returnItem.returnReason}</td>
                <td className="refund-amount">
                  {returnItem.approvalStatus === 'approved' ? (
                    <span>{returnItem.refundAmount.toLocaleString()} ريال</span>
                  ) : (
                    <span className="pending-refund">-</span>
                  )}
                </td>
                <td>
                  {returnItem.refundDate ? (
                    formatDate(returnItem.refundDate)
                  ) : (
                    <span className="pending-date">-</span>
                  )}
                </td>
                <td>{getStatusBadge(returnItem.approvalStatus)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">
                لا توجد مرتجعات مطابقة لمعايير البحث
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnsTable;
