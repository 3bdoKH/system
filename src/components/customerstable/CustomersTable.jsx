import React from 'react'
import './CustomersTable.css'
import { getCustomerStatusClass } from './tableColumns'

/**
 * Reusable customers table component
 * @param {Object} props Component props
 * @param {Array} props.customers - The array of customers to display
 * @param {Array} props.columns - Array of column configuration objects
 * @param {Function} props.onRowClick - Function to handle row click (receives the customer as parameter)
 * @param {String} props.emptyMessage - Message to show when there are no customers
 * @param {Number} props.colSpan - Number of columns for empty state message
 */
const CustomersTable = ({
    customers = [],
    columns = [],
    onRowClick = () => { },
    emptyMessage = 'لا توجد بيانات عملاء متطابقة',
    colSpan = 6
}) => {
    return (
        <div className='customers-table-container'>
            <table className='customers-table'>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 ? (
                        customers.map((customer, index) => (
                            <tr key={index} onClick={() => onRowClick(customer)}>
                                {columns.map((column, colIndex) => {
                                    let className = '';
                                    if (column.key === 'id') className = 'id-column';
                                    if (column.key === 'customerState') {
                                        className = `status-column status-${getCustomerStatusClass(customer.customerState)}`;
                                    }
                                    return (
                                        <td key={colIndex} className={className}>
                                            {column.render ? column.render(customer) : customer[column.key]}
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

export default CustomersTable
