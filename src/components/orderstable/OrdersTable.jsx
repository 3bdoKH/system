import React from 'react'
import './OrdersTable.css'

/**
 * Helper function to convert status values to CSS class names
 * @param {String} status The status value
 * @returns {String} The CSS class name suffix
 */
const getStatusClass = (status) => {
    switch (status) {
        case 'تحت المراجعة':
            return 'review';
        case 'مؤكد':
            return 'confirmed';
        case 'مؤجل':
            return 'delayed';
        case 'ملغي':
            return 'cancelled';
        case 'مشحون':
            return 'shipped';
        case 'مستلم':
            return 'delivered';
        case 'مرتجع':
            return 'returned';
        default:
            return 'default';
    }
};

/**
 * Reusable orders table component
 * @param {Object} props Component props
 * @param {Array} props.orders - The array of orders to display
 * @param {Array} props.columns - Array of column configuration objects
 * @param {Function} props.onRowClick - Function to handle row click (receives the order as parameter)
 * @param {String} props.emptyMessage - Message to show when there are no orders
 * @param {Number} props.colSpan - Number of columns for empty state message
 */
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
                                    // Set class for column type
                                    let className = '';
                                    if (column.key === 'id') className = 'id-column';

                                    // Handle status column with different colors based on status value
                                    if (column.key === 'status') {
                                        const statusValue = order[column.key];
                                        className = `status-column status-${getStatusClass(statusValue)}`;
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
