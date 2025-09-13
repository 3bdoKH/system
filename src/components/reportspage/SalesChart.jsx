import React, { useMemo } from 'react';
import './SalesChart.css';

/**
 * SalesChart - A component for displaying sales chart
 * 
 * @param {Object} props - Component props
 * @param {Array} props.orders - Array of order objects
 * @param {string} props.period - Selected period ('week', 'month', 'quarter', 'year')
 * @returns {JSX.Element} The rendered component
 */
const SalesChart = ({ orders, period }) => {
    // Process data for chart based on period
    const chartData = useMemo(() => {
        // For simplicity, we'll implement a basic visual chart
        // In a real app, you would use a charting library like Chart.js, Recharts, etc.

        let groupedData = [];
        const validOrders = orders.filter(order =>
            // Only consider completed, shipped, or delivered orders
            [1, 4, 5].includes(order.orderState)
        );

        switch (period) {
            case 'week':
                // Group by day of the week
                groupedData = Array(7).fill(0);
                validOrders.forEach(order => {
                    const date = new Date(order.orderDate);
                    const dayOfWeek = date.getDay();
                    groupedData[dayOfWeek] += order.totalPrice + order.shippingCost;
                });
                break;

            case 'month':
                // Group by day of month (simplified to 30 days)
                groupedData = Array(30).fill(0);
                validOrders.forEach(order => {
                    const date = new Date(order.orderDate);
                    const dayOfMonth = date.getDate() - 1; // 0-indexed
                    if (dayOfMonth < 30) {
                        groupedData[dayOfMonth] += order.totalPrice + order.shippingCost;
                    }
                });
                break;

            case 'quarter':
                // Group by week (13 weeks in a quarter)
                groupedData = Array(13).fill(0);
                validOrders.forEach(order => {
                    const date = new Date(order.orderDate);
                    const now = new Date();
                    const diffTime = Math.abs(now - date);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const weekIndex = Math.floor(diffDays / 7);
                    if (weekIndex < 13) {
                        groupedData[weekIndex] += order.totalPrice + order.shippingCost;
                    }
                });
                // Reverse to show oldest to newest
                groupedData.reverse();
                break;

            case 'year':
                // Group by month
                groupedData = Array(12).fill(0);
                validOrders.forEach(order => {
                    const date = new Date(order.orderDate);
                    const month = date.getMonth();
                    groupedData[month] += order.totalPrice + order.shippingCost;
                });
                break;

            default:
                // Default to month
                groupedData = Array(30).fill(0);
                validOrders.forEach(order => {
                    const date = new Date(order.orderDate);
                    const dayOfMonth = date.getDate() - 1;
                    if (dayOfMonth < 30) {
                        groupedData[dayOfMonth] += order.totalPrice + order.shippingCost;
                    }
                });
        }

        // Get labels based on period
        let labels = [];
        switch (period) {
            case 'week':
                labels = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
                break;
            case 'month':
                labels = Array(30).fill(0).map((_, i) => `${i + 1}`);
                break;
            case 'quarter':
                labels = Array(13).fill(0).map((_, i) => `أسبوع ${i + 1}`);
                break;
            case 'year':
                labels = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
                break;
            default:
                labels = Array(30).fill(0).map((_, i) => `${i + 1}`);
        }

        // Find max value for scaling
        const maxValue = Math.max(...groupedData, 1);

        return {
            data: groupedData,
            labels,
            maxValue
        };
    }, [orders, period]);

    return (
        <div className="sales-chart-container">
            <div className="chart-bars">
                {chartData.data.map((value, index) => (
                    <div className="bar-container" key={index}>
                        <div
                            className="bar"
                            style={{
                                height: `${(value / chartData.maxValue) * 100}%`,
                                backgroundColor: value > 0 ? '#2196f3' : '#e0e0e0'
                            }}
                            data-value={value.toFixed(0)}
                        >
                            <span className="bar-value">{value > 0 ? value.toLocaleString() : ''}</span>
                        </div>
                        <div className="bar-label">{chartData.labels[index]}</div>
                    </div>
                ))}
            </div>

            <div className="chart-summary">
                <div className="summary-item">
                    <span className="summary-label">إجمالي المبيعات:</span>
                    <span className="summary-value">
                        {chartData.data.reduce((sum, value) => sum + value, 0).toLocaleString()} ريال
                    </span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">متوسط المبيعات:</span>
                    <span className="summary-value">
                        {(chartData.data.reduce((sum, value) => sum + value, 0) / chartData.data.filter(v => v > 0).length || 1).toLocaleString()} ريال
                    </span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">أعلى قيمة:</span>
                    <span className="summary-value">
                        {Math.max(...chartData.data).toLocaleString()} ريال
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SalesChart;
