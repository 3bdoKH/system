import React, { useState, useMemo } from 'react'
import './OrdersPage.css'
import { Search, Filter, Package, DollarSign, Calendar, BarChart3, Users } from 'lucide-react'
import OrdersTable from '../orderstable/OrdersTable'
import OrderDetailsModal from '../orderdetails/OrderDetailsModal'

/**
 * OrdersPage - A reusable component for displaying orders with filtering and search functionality
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {Array} props.orders - Array of order objects
 * @param {Array} props.columns - Table column configuration
 * @param {Function} props.onAction - Function called when order action is performed
 * @param {Array} props.filterOptions - Array of status options for filtering
 * @param {string} props.initialStatus - Initial status filter value
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {string} props.emptyStateMessage - Message to show when no orders are available
 * @param {boolean} props.showStats - Whether to show statistics cards
 */
const OrdersPage = ({
    title,
    orders = [],
    columns = [],
    onAction,
    filterOptions = [],
    initialStatus = "",
    isLoading = false,
    onFilterChange = null,
    emptyStateMessage = "لا توجد طلبات متطابقة",
    showStats = true
}) => {
    const [orderDetails, setOrderDetails] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState(initialStatus)
    const [dateFilter, setDateFilter] = useState('')

    // Close the modal
    const closeModal = () => {
        setOrderDetails(null)
    }

    // Handle order actions (confirm, delay, cancel, etc.)
    const handleAction = (actionType, note) => {
        if (onAction) {
            onAction(orderDetails, actionType, note)
        }
        closeModal()
    }

    // Filter orders based on search term and status
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Filter by search term
            const matchesSearch = !searchTerm ? true : (
                order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.phone?.includes(searchTerm) ||
                String(order.id).includes(searchTerm)
            )

            // Filter by status
            const matchesStatus = !statusFilter ? true : order.status === statusFilter

            // Filter by date
            const matchesDate = !dateFilter ? true : order.date === dateFilter

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [orders, searchTerm, statusFilter, dateFilter])

    // Calculate statistics for the stats cards
    const stats = useMemo(() => {
        if (!showStats) return null

        // Filter today's orders
        const today = new Date().toISOString().split('T')[0]
        const todayOrders = orders.filter(order =>
            order.date && order.date.includes(today)
        )

        // Calculate total revenue
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)

        return {
            totalOrders: orders.length,
            todayOrders: todayOrders.length,
            totalRevenue: totalRevenue,
            uniqueCustomers: new Set(orders.map(order => order.customer)).size
        }
    }, [orders, showStats])

    // Handle filter changes
    const handleFilterChange = (search, status, date) => {
        setSearchTerm(search !== undefined ? search : searchTerm)
        setStatusFilter(status !== undefined ? status : statusFilter)
        setDateFilter(date !== undefined ? date : dateFilter)

        // Call external handler if provided
        if (onFilterChange) {
            onFilterChange({
                search: search !== undefined ? search : searchTerm,
                status: status !== undefined ? status : statusFilter,
                date: date !== undefined ? date : dateFilter
            })
        }
    }

    // Render loading state
    if (isLoading) {
        return (
            <div className='orders-page'>
                <h1>{title}</h1>
                <div className='loading-state'>
                    <div className='loading-spinner'></div>
                    <p>جاري تحميل البيانات...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='orders-page'>
            <h1>{title}</h1>

            {/* Stats Cards */}
            {showStats && stats && (
                <div className='stats-row'>
                    <div className='stat-card'>
                        <div className='stat-title'>إجمالي الطلبات</div>
                        <div className='stat-number'>{stats.totalOrders}</div>
                        <Package size={18} />
                    </div>
                    <div className='stat-card'>
                        <div className='stat-title'>الطلبات اليوم</div>
                        <div className='stat-number'>{stats.todayOrders}</div>
                        <Calendar size={18} />
                    </div>
                    <div className='stat-card'>
                        <div className='stat-title'>العملاء</div>
                        <div className='stat-number'>{stats.uniqueCustomers}</div>
                        <Users size={18} />
                    </div>
                </div>
            )}

            {/* Filters Row */}
            <div className='table-tools'>
                <div className='order-stats'>
                    <div className='stat-item'>
                        <span className='stat-label'>إجمالي الطلبات:</span>
                        <span className='stat-value'>{filteredOrders.length}</span>
                    </div>
                </div>

                <div className='search-container'>
                    <div className='search-input-wrapper'>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="البحث..."
                            value={searchTerm}
                            onChange={(e) => handleFilterChange(e.target.value, undefined, undefined)}
                            className='search-input'
                        />
                    </div>

                    {filterOptions.length > 0 && title === "جميع الطلبات" && (
                        <select
                            className="status-filter"
                            value={statusFilter}
                            onChange={(e) => handleFilterChange(undefined, e.target.value, undefined)}
                        >
                            <option value="">كل الحالات</option>
                            {filterOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    )}

                    <input
                        type="date"
                        className="date-filter"
                        value={dateFilter}
                        onChange={(e) => handleFilterChange(undefined, undefined, e.target.value)}
                    />

                    <button
                        className='filter-btn'
                        onClick={() => handleFilterChange('', '', '')}
                        title="إعادة ضبط الفلاتر"
                    >
                        <Filter size={18} />
                        <span>إعادة ضبط</span>
                    </button>
                </div>
            </div>

            {/* Table or Empty State */}
            {filteredOrders.length > 0 ? (
                <OrdersTable
                    orders={filteredOrders}
                    columns={columns}
                    onRowClick={setOrderDetails}
                    emptyMessage={emptyStateMessage}
                    colSpan={columns.length}
                />
            ) : (
                <div className="empty-state">
                    <BarChart3 size={48} />
                    <h3>لا توجد بيانات للعرض</h3>
                    <p>{emptyStateMessage}</p>
                </div>
            )}

            {/* Order Details Modal */}
            <OrderDetailsModal
                order={orderDetails}
                onClose={closeModal}
                onAction={handleAction}
            />
        </div>
    )
}

export default OrdersPage