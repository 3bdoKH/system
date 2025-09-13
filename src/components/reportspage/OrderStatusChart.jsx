import React, { useMemo } from 'react';
import './OrderStatusChart.css';

/**
 * OrderStatusChart - A component for displaying order status distribution as a pie chart
 * 
 * @param {Object} props - Component props
 * @param {Array} props.orders - Array of order objects
 * @returns {JSX.Element} The rendered component
 */
const OrderStatusChart = ({ orders }) => {
    // Process data for the chart
    const chartData = useMemo(() => {
        // Count orders by status
        const statusCounts = [0, 0, 0, 0, 0, 0, 0]; // Index corresponds to orderState

        orders.forEach(order => {
            if (order.orderState >= 0 && order.orderState < statusCounts.length) {
                statusCounts[order.orderState]++;
            }
        });

        // Status labels and colors
        const statusLabels = [
            'جديد', 'مؤكد', 'مؤجل', 'ملغي', 'مشحون', 'مستلم', 'مرتجع'
        ];

        const statusColors = [
            '#2196f3', // جديد - blue
            '#4caf50', // مؤكد - green
            '#ff9800', // مؤجل - orange
            '#f44336', // ملغي - red
            '#9c27b0', // مشحون - purple
            '#009688', // مستلم - teal
            '#795548'  // مرتجع - brown
        ];

        const total = statusCounts.reduce((sum, count) => sum + count, 0);

        // Calculate segments for the pie chart
        const segments = [];
        let startAngle = 0;

        statusCounts.forEach((count, index) => {
            if (count > 0) {
                const percentage = (count / total) * 100;
                const angle = (count / total) * 360;

                segments.push({
                    status: statusLabels[index],
                    count,
                    percentage,
                    color: statusColors[index],
                    startAngle,
                    angle
                });

                startAngle += angle;
            }
        });

        return {
            segments,
            total
        };
    }, [orders]);

    // Create CSS conic-gradient for the pie chart
    const pieChartStyle = useMemo(() => {
        if (chartData.segments.length === 0) {
            return { background: '#f5f5f5' };
        }

        const gradientStops = chartData.segments.map(segment => {
            const startPercentage = (segment.startAngle / 360) * 100;
            const endPercentage = ((segment.startAngle + segment.angle) / 360) * 100;

            return `${segment.color} ${startPercentage}% ${endPercentage}%`;
        });

        return {
            background: `conic-gradient(${gradientStops.join(', ')})`
        };
    }, [chartData]);

    return (
        <div className="order-status-chart">
            <div className="pie-chart-container">
                <div className="pie-chart" style={pieChartStyle}></div>
            </div>

            <div className="status-legend">
                {chartData.segments.map((segment, index) => (
                    <div className="legend-item" key={index}>
                        <span className="color-dot" style={{ backgroundColor: segment.color }}></span>
                        <span className="status-name">{segment.status}</span>
                        <span className="status-count">
                            {segment.count} ({segment.percentage.toFixed(1)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderStatusChart;
