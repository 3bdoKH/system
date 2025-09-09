import React, { useState } from 'react'
import { X } from 'lucide-react'
import './OrderDetailsModal.css'
import { useLocation } from 'react-router-dom'
import { formatDate } from '../../utils/formatters'
/**
 * Reusable order details modal component
 * @param {Object} props Component props
 * @param {Object} props.order - The order data to display
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onAction - Function called when an action button is clicked (receives actionType and note)
 */
const OrderDetailsModal = ({ order, customer, onClose, onAction }) => {
    const [orderNote, setOrderNote] = useState('')
    const location = useLocation()
    if (!order) return null

    // Map orderState number to text status
    const getOrderStatusText = (state) => {
        const statusMap = {
            0: 'جديد',
            1: 'مؤكد',
            2: 'مؤجل',
            3: 'ملغي',
            4: 'مشحون',
            5: 'مستلم',
            6: 'مرتجع',
            7: 'مكتمل'
        }
        return statusMap[state] || 'غير معروف'
    }

    const handleAction = (actionType) => {
        onAction(actionType, orderNote)
    }

    return (
        <div className='order-details-modal' onClick={onClose}>
            <div className='order-details-content' onClick={(e) => e.stopPropagation()}>
                <button className='close-btn' onClick={onClose}>
                    <X />
                </button>
                <h2>تفاصيل الطلب #{order.id}</h2>

                <div className='order-details-grid'>
                    {/* Order ID and Status Summary */}
                    <div className='order-summary'>
                        <div className='status-badge'>
                            {getOrderStatusText(order.orderState)}
                        </div>
                        <div className='order-dates'>
                            <div>تاريخ الطلب: {formatDate(order.orderDate)}</div>
                            {order.deliveryDate && <div>تاريخ التسليم: {formatDate(order.deliveryDate)}</div>}
                            {order.delayedUntil && <div>مؤجل حتى: {formatDate(order.delayedUntil)}</div>}
                        </div>
                    </div>

                    <div className='order-info'>
                        {/* Financial Information */}
                        <h3 className='section-title'>المعلومات المالية</h3>
                        <div className='info-row'>
                            <span>السعر الإجمالي:</span>
                            <span>{order.totalPrice}</span>
                        </div>
                        <div className='info-row'>
                            <span>تكلفة الشحن:</span>
                            <span>{order.shippingCost}</span>
                        </div>
                        <div className='info-row'>
                            <span>الإجمالي النهائي:</span>
                            <span>{order.totalPrice + order.shippingCost}</span>
                        </div>

                        {/* Shipping Information */}
                        <h3 className='section-title'>معلومات الشحن</h3>
                        <div className='info-row'>
                            <span>عنوان الشحن:</span>
                            <span>{order.shippingAddress}</span>
                        </div>
                        {order.trackingCode && (
                            <div className='info-row'>
                                <span>رمز التتبع:</span>
                                <span>{order.trackingCode}</span>
                            </div>
                        )}

                        {/* Customer Information */}
                        <h3 className='section-title'>معلومات العميل</h3>
                        <div className='info-row'>
                            <span>الاسم:</span>
                            <span>{customer ? customer.fullName : 'غير متوفر'}</span>
                        </div>
                        <div className='info-row'>
                            <span>الهاتف:</span>
                            <span>{customer ? customer.phone : 'غير متوفر'}</span>
                        </div>
                        <div className='info-row'>
                            <span>الموقع:</span>
                            <span>{customer ? customer.location : 'غير متوفر'}</span>
                        </div>

                        {/* Delay Reason if applicable */}
                        {order.delayedReason && (
                            <div className='info-section'>
                                <h3 className='section-title'>سبب التأجيل</h3>
                                <div className='delay-reason'>{order.delayedReason}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='note-container'>
                    <h3 className='note-title'>ملاحظات</h3>
                    <textarea
                        className='note-textarea'
                        placeholder='أضف ملاحظات حول الطلب هنا...'
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        disabled={location.pathname === '/all-orders' || location.pathname === '/delayed-orders' || location.pathname === '/cancelled-orders' || location.pathname === '/confirmed-orders' || location.pathname === '/shipped-orders' || location.pathname === '/delivered-orders' || location.pathname === '/returned-orders' || location.pathname === '/completed-orders'}
                    ></textarea>
                </div>

                <div className='order-actions'>
                    {
                        location.pathname === '/new-orders' ? (
                            <>
                                <button
                                    className='action-btn confirm'
                                    onClick={() => handleAction('تأكيد')}
                                >
                                    تأكيد الطلب
                                </button>
                                <button
                                    className='action-btn delay'
                                    onClick={() => handleAction('تأجيل')}
                                >
                                    تأجيل الطلب
                                </button>
                                <button
                                    className='action-btn cancel'
                                    onClick={() => handleAction('إلغاء')}
                                >
                                    إلغاء الطلب
                                </button>
                            </>
                        ) : location.pathname === '/delayed-orders' ? (
                            <>
                                <button
                                    className='action-btn confirm'
                                    onClick={() => handleAction('تأكيد')}
                                >
                                    تأكيد الطلب
                                </button>
                                <button
                                    className='action-btn cancel'
                                    onClick={() => handleAction('إلغاء')}
                                >
                                    إلغاء الطلب
                                </button>
                            </>
                        ) : location.pathname === '/cancelled-orders' ? null
                            : location.pathname === '/confirmed-orders' ? (
                                <>
                                    <button
                                        className='action-btn shipped'
                                        onClick={() => handleAction('مشحون')}
                                    >
                                        تم الشحن
                                    </button>
                                </>
                            ) : location.pathname === '/shipped-orders' ? (
                                <>
                                    <button
                                        className='action-btn delivered'
                                        onClick={() => handleAction('مستلم')}
                                    >
                                        تم التسليم
                                    </button>
                                </>
                            ) : location.pathname === '/returned-orders' ? null : location.pathname === '/completed-orders' ? null : null
                    }
                </div>
            </div>
        </div>
    )
}

export default OrderDetailsModal
