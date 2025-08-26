import React, { useState } from 'react'
import { X } from 'lucide-react'
import './OrderDetailsModal.css'

/**
 * Reusable order details modal component
 * @param {Object} props Component props
 * @param {Object} props.order - The order data to display
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onAction - Function called when an action button is clicked (receives actionType and note)
 */
const OrderDetailsModal = ({ order, onClose, onAction }) => {
    const [orderNote, setOrderNote] = useState('')

    if (!order) return null

    const handleAction = (actionType) => {
        onAction(actionType, orderNote)
    }

    return (
        <div className='order-details-modal' onClick={onClose}>
            <div className='order-details-content' onClick={(e) => e.stopPropagation()}>
                <button className='close-btn' onClick={onClose}>
                    <X />
                </button>
                <h2>{order.product}</h2>

                <div className='order-details-grid'>
                    <div className='order-image'>
                        <img
                            src={require(`../../images/${order.image.split('/').pop()}`)}
                            alt={order.product}
                        />
                    </div>

                    <div className='order-info'>
                        <div className='info-row'>
                            <span>السعر:</span>
                            <span>{order.price}</span>
                        </div>
                        <div className='info-row'>
                            <span>الكمية:</span>
                            <span>{order.quantity}</span>
                        </div>
                        <div className='info-row'>
                            <span>المجموع:</span>
                            <span>{order.total}</span>
                        </div>
                        <div className='info-row'>
                            <span>الحالة:</span>
                            <span className='status'>{order.status}</span>
                        </div>
                        <div className='info-row'>
                            <span>التاريخ:</span>
                            <span>{order.date}</span>
                        </div>
                        <div className='info-row'>
                            <span>العميل:</span>
                            <span>{order.customer}</span>
                        </div>
                        <div className='info-row'>
                            <span>الهاتف:</span>
                            <span>{order.phone}</span>
                        </div>
                    </div>
                </div>

                <div className='note-container'>
                    <h3 className='note-title'>ملاحظات</h3>
                    <textarea
                        className='note-textarea'
                        placeholder='أضف ملاحظات حول الطلب هنا...'
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                    ></textarea>
                </div>

                <div className='order-actions'>
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
                </div>
            </div>
        </div>
    )
}

export default OrderDetailsModal
