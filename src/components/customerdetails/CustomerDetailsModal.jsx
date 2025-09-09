import React from 'react';
import { X } from 'lucide-react';
import './CustomerDetailsModal.css';
import { getCustomerStatusText } from '../customerstable/tableColumns';

/**
 * Customer details modal component
 * @param {Object} props Component props
 * @param {Object} props.customer - The customer data to display
 * @param {Function} props.onClose - Function to close the modal
 */
const CustomerDetailsModal = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className='customer-details-modal' onClick={onClose}>
      <div className='customer-details-content' onClick={(e) => e.stopPropagation()}>
        <button className='close-btn' onClick={onClose}>
          <X />
        </button>
        <h2>بيانات العميل #{customer.id}</h2>

        <div className='customer-details-grid'>
          <div className='customer-info-block'>
            <h3 className='section-title'>المعلومات الأساسية</h3>

            <div className='info-row'>
              <span>الاسم:</span>
              <span>{customer.fullName}</span>
            </div>

            <div className='info-row'>
              <span>رقم الهاتف:</span>
              <span>{customer.phone}</span>
            </div>

            <div className='info-row'>
              <span>الموقع:</span>
              <span>{customer.location}</span>
            </div>

            <div className='info-row'>
              <span>الحالة:</span>
              <span className={`status-pill status-${customer.customerState === 1 ? 'active' : customer.customerState === 0 ? 'inactive' : 'banned'}`}>
                {getCustomerStatusText(customer.customerState)}
              </span>
            </div>
          </div>

          <div className='customer-info-block'>
            <h3 className='section-title'>معلومات النظام</h3>

            <div className='info-row'>
              <span>النظام الفرعي:</span>
              <span>{customer.subSystem?.name || 'غير محدد'}</span>
            </div>

            <div className='info-row'>
              <span>دومين النظام:</span>
              <span dir="ltr">{customer.subSystem?.domain || 'غير محدد'}</span>
            </div>

            <div className='info-row'>
              <span>حالة النظام:</span>
              <span className={`status-pill ${customer.subSystem?.subSystemState === 1 ? 'status-active' : 'status-inactive'}`}>
                {customer.subSystem?.subSystemState === 1 ? 'نشط' : 'غير نشط'}
              </span>
            </div>

            <div className='info-row'>
              <span>تاريخ الإنشاء:</span>
              <span>{customer.subSystem?.createdAt ? new Date(customer.subSystem.createdAt).toLocaleDateString('ar-SA') : 'غير محدد'}</span>
            </div>
          </div>
        </div>

        <div className='customer-actions'>
          <button className='action-btn view'>عرض الطلبات</button>
          <button className='action-btn edit'>تعديل البيانات</button>
          {customer.customerState !== 2 ? (
            <button className='action-btn ban'>حظر العميل</button>
          ) : (
            <button className='action-btn unban'>إلغاء الحظر</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
