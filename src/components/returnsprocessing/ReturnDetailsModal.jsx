import React, { useState } from 'react';
import './ReturnDetailsModal.css';
import { X, CheckCircle, AlertTriangle, DollarSign, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

/**
 * ReturnDetailsModal - Modal for viewing and managing return details
 * 
 * @param {Object} props - Component props
 * @param {Object} props.returnItem - Return object
 * @param {Object} props.customer - Customer object
 * @param {string} props.userRole - Current user role (accountant or stock_manager)
 * @param {Function} props.onClose - Function called when modal is closed
 * @param {Function} props.onAction - Function called when an action is taken
 * @returns {JSX.Element} The rendered component
 */
const ReturnDetailsModal = ({ returnItem, customer, userRole, onClose, onAction }) => {
  const [notes, setNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState(returnItem.approvalStatus === 'approved' ? returnItem.refundAmount : returnItem.totalPrice);
  
  const handleAction = (actionType) => {
    // Handle different actions based on the action type and user role
    onAction(returnItem, actionType, notes);
  };
  
  const getStatusComponent = () => {
    switch (returnItem.approvalStatus) {
      case 'pending':
        return (
          <div className="status-display pending">
            <Clock size={18} />
            <span>بانتظار المراجعة</span>
          </div>
        );
      case 'approved':
        return (
          <div className="status-display approved">
            <CheckCircle size={18} />
            <span>تمت الموافقة</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="status-display rejected">
            <AlertTriangle size={18} />
            <span>تم الرفض</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="return-details-modal">
        <div className="modal-header">
          <h2>تفاصيل المرتجع #{returnItem.id}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="status-section">
            {getStatusComponent()}
          </div>
          
          <div className="return-overview">
            <div className="return-image">
              <img src={returnItem.imageUrl} alt="صورة المنتج" />
            </div>
            
            <div className="return-summary">
              <h3>معلومات الطلب</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">رقم الطلب:</span>
                  <span className="value">{returnItem.id}</span>
                </div>
                <div className="info-item">
                  <span className="label">تاريخ الطلب:</span>
                  <span className="value">{formatDate(returnItem.orderDate)}</span>
                </div>
                <div className="info-item">
                  <span className="label">تاريخ التسليم:</span>
                  <span className="value">{formatDate(returnItem.deliveryDate)}</span>
                </div>
                <div className="info-item">
                  <span className="label">تاريخ الإرجاع:</span>
                  <span className="value">{formatDate(returnItem.returnDate)}</span>
                </div>
                <div className="info-item">
                  <span className="label">قيمة الطلب:</span>
                  <span className="value">{returnItem.totalPrice.toLocaleString()} ريال</span>
                </div>
                <div className="info-item">
                  <span className="label">سبب الإرجاع:</span>
                  <span className="value reason">{returnItem.returnReason}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="customer-details">
            <h3>معلومات العميل</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">اسم العميل:</span>
                <span className="value">{customer ? customer.fullName : 'غير متوفر'}</span>
              </div>
              <div className="info-item">
                <span className="label">رقم الهاتف:</span>
                <span className="value">{customer ? customer.phone : 'غير متوفر'}</span>
              </div>
              <div className="info-item">
                <span className="label">العنوان:</span>
                <span className="value">{customer ? customer.location : 'غير متوفر'}</span>
              </div>
            </div>
          </div>
          
          {userRole === 'accountant' && returnItem.approvalStatus === 'pending' && (
            <div className="return-request-section">
              <h3>طلب المراجعة</h3>
              <div className="form-group">
                <label htmlFor="notes">ملاحظات للمراجعة:</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أضف ملاحظات حول طلب الإرجاع..."
                  rows={3}
                  className="notes-input"
                />
              </div>
            </div>
          )}
          
          {userRole === 'stock_manager' && returnItem.approvalStatus === 'pending' && (
            <div className="return-approval-section">
              <h3>مراجعة طلب الإرجاع</h3>
              <div className="form-group">
                <label htmlFor="notes">ملاحظات المراجعة:</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أضف ملاحظات حول قرار الموافقة أو الرفض..."
                  rows={3}
                  className="notes-input"
                />
              </div>
              {returnItem.approvalStatus === 'pending' && (
                <div className="refund-amount-group">
                  <label htmlFor="refundAmount">مبلغ الاسترجاع (ريال):</label>
                  <div className="refund-input-wrapper">
                    <input
                      type="number"
                      id="refundAmount"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                      min="0"
                      max={returnItem.totalPrice}
                      className="refund-input"
                    />
                    <DollarSign size={18} className="currency-icon" />
                  </div>
                  <div className="refund-info">
                    <span>المبلغ الأقصى للاسترجاع: {returnItem.totalPrice.toLocaleString()} ريال</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {userRole === 'accountant' && returnItem.approvalStatus === 'approved' && !returnItem.refundDate && (
            <div className="refund-processing-section">
              <h3>معالجة استرجاع المبلغ</h3>
              <div className="form-group">
                <label htmlFor="notes">ملاحظات استرجاع المبلغ:</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أضف ملاحظات حول عملية استرجاع المبلغ..."
                  rows={3}
                  className="notes-input"
                />
              </div>
              <div className="refund-amount-display">
                <span className="label">المبلغ المسترجع:</span>
                <span className="value">{returnItem.refundAmount.toLocaleString()} ريال</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>إغلاق</button>
          
          {/* Conditional action buttons based on role and status */}
          {userRole === 'accountant' && returnItem.approvalStatus === 'pending' && (
            <button className="action-button submit" onClick={() => handleAction('submit_for_review')}>
              إرسال للمراجعة
            </button>
          )}
          
          {userRole === 'stock_manager' && returnItem.approvalStatus === 'pending' && (
            <>
              <button className="action-button reject" onClick={() => handleAction('reject')}>
                رفض الإرجاع
              </button>
              <button className="action-button approve" onClick={() => handleAction('approve')}>
                الموافقة على الإرجاع
              </button>
            </>
          )}
          
          {userRole === 'accountant' && returnItem.approvalStatus === 'approved' && !returnItem.refundDate && (
            <button className="action-button refund" onClick={() => handleAction('complete_refund')}>
              تأكيد استرجاع المبلغ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnDetailsModal;
