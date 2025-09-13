import React, { useState, useMemo } from 'react';
import './ReportsPage.css';
import { Calendar, Filter, Download, TrendingUp, BarChart2, PieChart, DollarSign, Package } from 'lucide-react';
import { newOrders, customers } from '../../data';
import { products } from '../../products';
import SalesChart from './SalesChart';
import OrderStatusChart from './OrderStatusChart';
import TopProductsChart from './TopProductsChart';
import ReportsTable from './ReportsTable';

/**
 * ReportsPage - A component for displaying system analytics and reports for the owner
 * 
 * @returns {JSX.Element} The rendered component
 */
const ReportsPage = () => {
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  const [reportType, setReportType] = useState('sales');

  // Get filtered orders based on date range
  const filteredOrders = useMemo(() => {
    return newOrders.filter(order => {
      const orderDate = new Date(order.orderDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Set end date to end of day
      end.setHours(23, 59, 59, 999);
      
      return orderDate >= start && orderDate <= end;
    });
  }, [newOrders, startDate, endDate]);

  // Calculate summary metrics
  const metrics = useMemo(() => {
    const totalSales = filteredOrders.reduce((sum, order) => {
      // Only count completed or delivered orders in total sales
      if (order.orderState === 4 || order.orderState === 5) {
        return sum + order.totalPrice + order.shippingCost;
      }
      return sum;
    }, 0);
    
    const totalOrders = filteredOrders.length;
    
    // Count unique customers
    const uniqueCustomers = new Set(filteredOrders.map(order => order.customerId)).size;
    
    const totalCancelled = filteredOrders.filter(order => order.orderState === 3).length;
    const cancelRate = totalOrders > 0 ? (totalCancelled / totalOrders) * 100 : 0;
    
    const totalReturned = filteredOrders.filter(order => order.orderState === 6).length;
    const returnRate = totalOrders > 0 ? (totalReturned / totalOrders) * 100 : 0;
    
    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalSales / (totalOrders - totalCancelled) : 0;
    
    return {
      totalSales,
      totalOrders,
      uniqueCustomers,
      cancelRate,
      returnRate,
      avgOrderValue
    };
  }, [filteredOrders]);

  // Handle date period change
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    const endDate = new Date();
    const startDate = new Date();
    
    switch (newPeriod) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }
    
    setStartDate(startDate.toISOString().split('T')[0]);
    setEndDate(endDate.toISOString().split('T')[0]);
  };

  // Get data for selected report type
  const getReportData = () => {
    switch (reportType) {
      case 'sales':
        return filteredOrders.filter(order => order.orderState !== 3); // Exclude cancelled
      case 'cancelled':
        return filteredOrders.filter(order => order.orderState === 3);
      case 'returned':
        return filteredOrders.filter(order => order.orderState === 6);
      case 'customers':
        return filteredOrders.map(order => {
          const customer = customers.find(c => c.id === order.customerId);
          return {
            ...order,
            customerName: customer ? customer.fullName : 'غير معروف',
            customerPhone: customer ? customer.phone : 'غير معروف'
          };
        });
      default:
        return filteredOrders;
    }
  };
  
  const reportData = getReportData();

  // Export report function (demo only)
  const exportReport = () => {
    alert('تم تحميل التقرير بنجاح');
  };

  return (
    <div className="reports-page">
      <h1>التقارير والإحصائيات</h1>
      
      {/* Date controls */}
      <div className="reports-controls">
        <div className="period-buttons">
          <button 
            className={`period-btn ${period === 'week' ? 'active' : ''}`} 
            onClick={() => handlePeriodChange('week')}
          >
            أسبوع
          </button>
          <button 
            className={`period-btn ${period === 'month' ? 'active' : ''}`} 
            onClick={() => handlePeriodChange('month')}
          >
            شهر
          </button>
          <button 
            className={`period-btn ${period === 'quarter' ? 'active' : ''}`} 
            onClick={() => handlePeriodChange('quarter')}
          >
            3 أشهر
          </button>
          <button 
            className={`period-btn ${period === 'year' ? 'active' : ''}`} 
            onClick={() => handlePeriodChange('year')}
          >
            سنة
          </button>
        </div>
        
        <div className="date-pickers">
          <div className="date-field">
            <label htmlFor="startDate">من:</label>
            <input 
              type="date" 
              id="startDate" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="date-field">
            <label htmlFor="endDate">إلى:</label>
            <input 
              type="date" 
              id="endDate" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button className="export-btn" onClick={exportReport}>
            <Download size={16} />
            تصدير التقرير
          </button>
        </div>
      </div>
      
      {/* Summary metrics */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-icon sales">
            <DollarSign size={20} />
          </div>
          <div className="metric-data">
            <div className="metric-value">{metrics.totalSales.toLocaleString()} ريال</div>
            <div className="metric-title">إجمالي المبيعات</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon orders">
            <Package size={20} />
          </div>
          <div className="metric-data">
            <div className="metric-value">{metrics.totalOrders}</div>
            <div className="metric-title">إجمالي الطلبات</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon customers">
            <TrendingUp size={20} />
          </div>
          <div className="metric-data">
            <div className="metric-value">{metrics.uniqueCustomers}</div>
            <div className="metric-title">العملاء</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon avg-order">
            <BarChart2 size={20} />
          </div>
          <div className="metric-data">
            <div className="metric-value">{metrics.avgOrderValue.toFixed(2)} ريال</div>
            <div className="metric-title">متوسط الطلب</div>
          </div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="secondary-metrics">
        <div className="metric-pill">
          <span className="metric-label">نسبة الإلغاء:</span>
          <span className="metric-number">{metrics.cancelRate.toFixed(1)}%</span>
        </div>
        
        <div className="metric-pill">
          <span className="metric-label">نسبة المرتجع:</span>
          <span className="metric-number">{metrics.returnRate.toFixed(1)}%</span>
        </div>
      </div>
      
      {/* Charts grid */}
      <div className="charts-grid">
        <div className="chart-container sales-chart">
          <h3>تقرير المبيعات</h3>
          <SalesChart orders={filteredOrders} period={period} />
        </div>
        
        <div className="chart-container status-chart">
          <h3>حالات الطلبات</h3>
          <OrderStatusChart orders={filteredOrders} />
        </div>
        
        <div className="chart-container products-chart">
          <h3>أعلى المنتجات مبيعاً</h3>
          <TopProductsChart orders={filteredOrders} products={products} />
        </div>
      </div>
      
      {/* Report tabs */}
      <div className="report-tabs">
        <button 
          className={`tab-button ${reportType === 'sales' ? 'active' : ''}`}
          onClick={() => setReportType('sales')}
        >
          المبيعات
        </button>
        <button 
          className={`tab-button ${reportType === 'cancelled' ? 'active' : ''}`}
          onClick={() => setReportType('cancelled')}
        >
          الطلبات الملغاة
        </button>
        <button 
          className={`tab-button ${reportType === 'returned' ? 'active' : ''}`}
          onClick={() => setReportType('returned')}
        >
          المرتجعات
        </button>
        <button 
          className={`tab-button ${reportType === 'customers' ? 'active' : ''}`}
          onClick={() => setReportType('customers')}
        >
          العملاء
        </button>
      </div>
      
      {/* Report table */}
      <ReportsTable data={reportData} reportType={reportType} />
    </div>
  );
};

export default ReportsPage;
