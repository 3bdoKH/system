import React, { useMemo } from 'react';
import './TopProductsChart.css';

/**
 * TopProductsChart - A component for displaying top selling products
 * 
 * @param {Object} props - Component props
 * @param {Array} props.orders - Array of order objects
 * @param {Array} props.products - Array of product objects
 * @returns {JSX.Element} The rendered component
 */
const TopProductsChart = ({ orders, products }) => {
    // For simplicity, we'll assume each order contains one product
    // In a real app, orders would have order items with products and quantities

    // Process data for the chart
    const topProducts = useMemo(() => {
        // Count orders by product (using imageUrl as a proxy for product)
        const productCounts = {};

        orders.forEach(order => {
            // Only count completed, shipped, or delivered orders
            if ([1, 4, 5].includes(order.orderState) && order.imageUrl) {
                const productImage = order.imageUrl;
                productCounts[productImage] = (productCounts[productImage] || 0) + 1;
            }
        });

        // Convert to array and sort by count
        const sortedProducts = Object.keys(productCounts).map(imageUrl => {
            // Find matching product from products array
            const product = products.find(p => p.imageUrl === imageUrl) || {
                name: 'منتج غير معروف',
                price: 0
            };

            return {
                imageUrl,
                name: product.name,
                price: product.price,
                count: productCounts[imageUrl],
                total: productCounts[imageUrl] * product.price
            };
        }).sort((a, b) => b.count - a.count);

        // Take top 5
        return sortedProducts.slice(0, 5);
    }, [orders, products]);

    // Calculate total sales for percentage
    const totalSales = useMemo(() => {
        return topProducts.reduce((sum, product) => sum + product.total, 0);
    }, [topProducts]);

    return (
        <div className="top-products-chart">
            {topProducts.length > 0 ? (
                <div className="products-list">
                    {topProducts.map((product, index) => (
                        <div className="product-item" key={index}>
                            <div className="product-rank">{index + 1}</div>
                            <div className="product-image">
                                <img src={product.imageUrl} alt={product.name} />
                            </div>
                            <div className="product-info">
                                <div className="product-name">{product.name}</div>
                                <div className="product-stats">
                                    <span className="product-count">{product.count} مبيعات</span>
                                    <span className="product-total">{product.total.toLocaleString()} ريال</span>
                                </div>
                            </div>
                            <div className="product-percentage">
                                <div className="percentage-bar-container">
                                    <div
                                        className="percentage-bar"
                                        style={{
                                            width: `${Math.max((product.total / totalSales) * 100, 5)}%`
                                        }}
                                    ></div>
                                </div>
                                <span className="percentage-value">
                                    {((product.total / totalSales) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-products-message">
                    لا توجد مبيعات كافية لعرض المنتجات الأعلى مبيعاً
                </div>
            )}
        </div>
    );
};

export default TopProductsChart;
