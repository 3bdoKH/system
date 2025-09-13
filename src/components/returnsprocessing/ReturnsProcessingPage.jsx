import React, { useState, useMemo } from 'react';
import './ReturnsProcessingPage.css';
import { Search, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { newOrders, customers } from '../../data';
import ReturnsTable from './ReturnsTable';
import ReturnDetailsModal from './ReturnDetailsModal';

/**
 * ReturnsProcessingPage - A component for managing returned orders
 * 
 * @param {Object} props - Component props
 * @param {string} props.userRole - Current user role (accountant or stock_manager)
 * @returns {JSX.Element} The rendered component
 */
const ReturnsProcessingPage = ({ userRole = 'accountant' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Get all returns (orders with orderState = 6)
    const returnsData = useMemo(() => {
        return newOrders.filter(order => order.orderState === 6).map(order => {
            // Add some mock return data
            return {
                ...order,
                returnDate: new Date(new Date(order.deliveryDate).getTime() + 24 * 60 * 60 * 1000).toISOString(), // 1 day after delivery
                returnReason: ['منتج تالف', 'المنتج غير مطابق للمواصفات', 'تم استلام منتج خاطئ', 'المنتج غير مرغوب فيه'][Math.floor(Math.random() * 4)],
                approvalStatus: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)], // pending, approved, rejected
                inspectedBy: null,
                inspectionNotes: null,
                refundAmount: order.totalPrice * 0.9, // 90% refund as example
                refundDate: null
            };
        });
    }, []);

    // Filter returns based on search, status and date
    const filteredReturns = useMemo(() => {
        return returnsData.filter(returnItem => {
            // Get associated customer
            const customer = customers.find(c => c.id === returnItem.customerId);

            // Filter by search term
            const matchesSearch = !searchTerm ? true : (
                customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer?.phone?.includes(searchTerm) ||
                String(returnItem.id).includes(searchTerm) ||
                returnItem.returnReason?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Filter by status
            const matchesStatus = !statusFilter ? true :
                returnItem.approvalStatus === statusFilter;

            // Filter by date (using returnDate)
            const matchesDate = !dateFilter ? true :
                returnItem.returnDate && returnItem.returnDate.split('T')[0] === dateFilter;

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [returnsData, searchTerm, statusFilter, dateFilter]);

    // Calculate return statistics
    const returnStats = useMemo(() => {
        const pendingCount = returnsData.filter(r => r.approvalStatus === 'pending').length;
        const approvedCount = returnsData.filter(r => r.approvalStatus === 'approved').length;
        const rejectedCount = returnsData.filter(r => r.approvalStatus === 'rejected').length;
        const totalRefunds = returnsData.reduce((sum, item) =>
            item.approvalStatus === 'approved' ? sum + item.refundAmount : sum, 0);

        return {
            totalReturns: returnsData.length,
            pendingCount,
            approvedCount,
            rejectedCount,
            totalRefunds
        };
    }, [returnsData]);

    const handleReturnAction = (returnItem, actionType, notes) => {
        // In a real app, this would make an API call to update the return
        let message = '';

        if (actionType === 'approve') {
            message = `تم الموافقة على طلب الإرجاع رقم ${returnItem.id}`;
        } else if (actionType === 'reject') {
            message = `تم رفض طلب الإرجاع رقم ${returnItem.id}`;
        } else if (actionType === 'complete_refund') {
            message = `تم إكمال عملية إرجاع المبلغ للطلب ${returnItem.id}`;
        }

        if (notes) {
            message += `\nملاحظات: ${notes}`;
        }

        alert(message);
        console.log(`Return ${returnItem.id} ${actionType} with note: ${notes}`);

        setSelectedReturn(null);
        setSelectedCustomer(null);
    };

    const closeModal = () => {
        setSelectedReturn(null);
        setSelectedCustomer(null);
    };

    return (
        <div className="returns-processing-page">
            <h1>إدارة المرتجعات</h1>

            {/* Statistics cards */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-title">إجمالي المرتجعات</div>
                    <div className="stat-number">{returnStats.totalReturns}</div>
                </div>
                <div className="stat-card pending">
                    <div className="stat-title">بانتظار المراجعة</div>
                    <div className="stat-number">{returnStats.pendingCount}</div>
                    <Clock size={18} />
                </div>
                <div className="stat-card approved">
                    <div className="stat-title">تمت الموافقة</div>
                    <div className="stat-number">{returnStats.approvedCount}</div>
                    <CheckCircle size={18} />
                </div>
                <div className="stat-card rejected">
                    <div className="stat-title">تم الرفض</div>
                    <div className="stat-number">{returnStats.rejectedCount}</div>
                    <AlertTriangle size={18} />
                </div>
            </div>

            {/* Search and filters */}
            <div className="table-tools">
                <div className="return-stats">
                    <div className="stat-item">
                        <span className="stat-label">إجمالي المبالغ المرتجعة:</span>
                        <span className="stat-value">{returnStats.totalRefunds.toLocaleString()} ريال</span>
                    </div>
                </div>

                <div className="search-container">
                    <div className="filter-group">
                        <select
                            className="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">جميع الحالات</option>
                            <option value="pending">بانتظار المراجعة</option>
                            <option value="approved">تمت الموافقة</option>
                            <option value="rejected">تم الرفض</option>
                        </select>

                        <input
                            type="date"
                            className="date-filter"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>

                    <div className="search-input-wrapper">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="البحث في المرتجعات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <button
                        className="filter-btn"
                        onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('');
                            setDateFilter('');
                        }}
                        title="إعادة ضبط الفلاتر"
                    >
                        <Filter size={18} />
                        <span>إعادة ضبط</span>
                    </button>
                </div>
            </div>

            {/* Returns table */}
            <ReturnsTable
                returns={filteredReturns}
                userRole={userRole}
                onRowClick={(returnItem) => {
                    setSelectedReturn(returnItem);
                    const customer = customers.find(c => c.id === returnItem.customerId);
                    setSelectedCustomer(customer);
                }}
            />

            {/* Return details modal */}
            {selectedReturn && (
                <ReturnDetailsModal
                    returnItem={selectedReturn}
                    customer={selectedCustomer}
                    userRole={userRole}
                    onClose={closeModal}
                    onAction={handleReturnAction}
                />
            )}
        </div>
    );
};

export default ReturnsProcessingPage;
