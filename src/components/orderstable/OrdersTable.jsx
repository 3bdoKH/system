import React from 'react'
import './OrdersTable.css'

/**
 * Helper function to convert orderState values to CSS class names
 * @param {Number} orderState The order state value
 * @returns {String} The CSS class name suffix
 */
const getStatusClass = (orderState) => {
    switch (orderState) {
        case 0:
            return 'review'; // جديد
        case 1:
            return 'confirmed'; // مؤكد
        case 2:
            return 'delayed'; // مؤجل
        case 3:
            return 'cancelled'; // ملغي
        case 4:
            return 'shipped'; // مشحون
        case 5:
            return 'delivered'; // مستلم
        case 6:
            return 'returned'; // مرتجع
        case 7:
            return 'completed'; // مكتمل
        default:
            return 'default';
    }
};

/**
 * Helper function to convert orderState values to status text
 * @param {Number} orderState The order state value
 * @returns {String} The status text in Arabic
 */
export const getOrderStatusText = (orderState) => {
    const statusMap = {
        0: 'جديد',
        1: 'مؤكد',
        2: 'مؤجل',
        3: 'ملغي',
        4: 'مشحون',
        5: 'مستلم',
        6: 'مرتجع',
        7: 'مكتمل'
    };
    return statusMap[orderState] || 'غير معروف';
};

const OrdersTable = ({
    orders = [],
    columns = [],
    onRowClick = () => { },
    emptyMessage = 'لا توجد طلبات متطابقة',
    colSpan = 7
}) => {
    return (
        <div className='orders-table-container'>
            <table className='orders-table'>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <tr key={index} onClick={() => onRowClick(order)}>
                                {columns.map((column, colIndex) => {
                                    let className = '';
                                    if (column.key === 'id') className = 'id-column';
                                    if (column.key === 'orderState') {
                                        const orderStateValue = order[column.key];
                                        className = `status-column status-${getStatusClass(orderStateValue)}`;
                                    }
                                    return (
                                        <td key={colIndex} className={className}>
                                            {column.render ? column.render(order) : order[column.key]}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : (
                        <tr className="empty-row">
                            <td colSpan={colSpan}>{emptyMessage}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default OrdersTable
