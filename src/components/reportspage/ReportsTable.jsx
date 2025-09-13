import React from 'react';
import './ReportsTable.css';
import { formatDate } from '../../utils/formatters';

/**
 * ReportsTable - A component for displaying tabular report data
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data objects to display
 * @param {string} props.reportType - Type of report ('sales', 'cancelled', 'returned', 'customers')
 * @returns {JSX.Element} The rendered component
 */
const ReportsTable = ({ data = [], reportType = 'sales' }) => {
    // Helper function to get order status text
    const getOrderStatusText = (status) => {
        const statusTexts = [
            'جديد', 'مؤكد', 'مؤجل', 'ملغي', 'مشحون', 'مستلم', 'مرتجع'
        ];
        return statusTexts[status] || 'غير معروف';
    };

    // Define columns based on report type
    const getColumns = () => {
        switch (reportType) {
            case 'sales':
                return [
                    { key: 'id', header: 'رقم الطلب' },
                    { key: 'orderDate', header: 'تاريخ الطلب', formatter: formatDate },
                    { key: 'customerName', header: 'العميل' },
                    { key: 'totalPrice', header: 'المبلغ', formatter: value => `${value + (data.find(item => item.id === value)?.shippingCost || 0)} ريال` },
                    { key: 'orderState', header: 'الحالة', formatter: getOrderStatusText },
                    { key: 'shippingCost', header: 'تكلفة الشحن', formatter: value => `${value} ريال` },
                    { key: 'deliveryDate', header: 'تاريخ التسليم', formatter: value => value ? formatDate(value) : '-' }
                ];

            case 'cancelled':
                return [
                    { key: 'id', header: 'رقم الطلب' },
                    { key: 'orderDate', header: 'تاريخ الطلب', formatter: formatDate },
                    { key: 'customerName', header: 'العميل' },
                    { key: 'totalPrice', header: 'المبلغ', formatter: value => `${value} ريال` },
                    { key: 'shippingAddress', header: 'العنوان' },
                    { key: 'cancelReason', header: 'سبب الإلغاء', formatter: () => 'طلب العميل' } // Mock data
                ];

            case 'returned':
                return [
                    { key: 'id', header: 'رقم الطلب' },
                    { key: 'orderDate', header: 'تاريخ الطلب', formatter: formatDate },
                    { key: 'customerName', header: 'العميل' },
                    { key: 'totalPrice', header: 'المبلغ المسترد', formatter: value => `${value * 0.9} ريال` }, // 90% refund as example
                    { key: 'deliveryDate', header: 'تاريخ التسليم', formatter: value => value ? formatDate(value) : '-' },
                    { key: 'returnReason', header: 'سبب الإرجاع', formatter: () => 'المنتج غير مطابق للمواصفات' } // Mock data
                ];

            case 'customers':
                return [
                    { key: 'customerName', header: 'اسم العميل' },
                    { key: 'customerPhone', header: 'رقم الهاتف' },
                    { key: 'id', header: 'رقم الطلب' },
                    { key: 'orderDate', header: 'تاريخ الطلب', formatter: formatDate },
                    { key: 'totalPrice', header: 'المبلغ', formatter: value => `${value} ريال` },
                    { key: 'orderState', header: 'الحالة', formatter: getOrderStatusText }
                ];

            default:
                return [
                    { key: 'id', header: 'رقم الطلب' },
                    { key: 'orderDate', header: 'تاريخ الطلب', formatter: formatDate },
                    { key: 'totalPrice', header: 'المبلغ', formatter: value => `${value} ريال` },
                    { key: 'orderState', header: 'الحالة', formatter: getOrderStatusText }
                ];
        }
    };

    const columns = getColumns();

    return (
        <div className="reports-table-container">
            <table className="reports-table">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}>
                                        {column.formatter ? column.formatter(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="no-data">
                                لا توجد بيانات متاحة
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReportsTable;
