import React, { useState, useMemo } from 'react'
import './UsersDataPage.css'
import { Search, Filter, BarChart3, Users } from 'lucide-react'
import CustomersTable from '../customerstable/CustomersTable'
import { customersColumns } from '../customerstable/tableColumns'
import CustomerDetailsModal from '../customerdetails/CustomerDetailsModal'

/**
 * UsersDataPage - A component for displaying customer data with filtering and search
 *
 * @param {Object} props - Component props
 * @param {Array} props.customers - Array of customer objects
 * @param {boolean} props.isLoading - Loading state indicator
 */
const UsersDataPage = ({ customers = [], isLoading = false }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [stateFilter, setStateFilter] = useState('')

    // Filter customers based on search term and state
    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            // Filter by search term
            const matchesSearch = !searchTerm ? true : (
                customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone?.includes(searchTerm) ||
                customer.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(customer.id).includes(searchTerm) ||
                customer.subSystem?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            )

            // Filter by state (0, 1, 2)
            const matchesState = stateFilter === '' ? true :
                customer.customerState === parseInt(stateFilter)

            return matchesSearch && matchesState
        })
    }, [customers, searchTerm, stateFilter])

    // Calculate statistics
    const stats = useMemo(() => {
        const activeCustomers = customers.filter(c => c.customerState === 1).length
        const inactiveCustomers = customers.filter(c => c.customerState === 0).length
        const bannedCustomers = customers.filter(c => c.customerState === 2).length

        return {
            total: customers.length,
            active: activeCustomers,
            inactive: inactiveCustomers,
            banned: bannedCustomers
        }
    }, [customers])

    // Handle filter changes
    const handleFilterChange = (search, state) => {
        setSearchTerm(search !== undefined ? search : searchTerm)
        setStateFilter(state !== undefined ? state : stateFilter)
    }

    // Close the modal
    const closeModal = () => {
        setSelectedCustomer(null)
    }

    // Render loading state
    if (isLoading) {
        return (
            <div className='users-data-page'>
                <h1>بيانات العملاء</h1>
                <div className='loading-state'>
                    <div className='loading-spinner'></div>
                    <p>جاري تحميل البيانات...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='users-data-page'>
            <h1>بيانات العملاء</h1>

            {/* Stats Cards */}
            <div className='stats-row'>
                <div className='stat-card'>
                    <div className='stat-title'>إجمالي العملاء</div>
                    <div className='stat-number'>{stats.total}</div>
                    <Users size={18} />
                </div>
                <div className='stat-card active'>
                    <div className='stat-title'>العملاء النشطون</div>
                    <div className='stat-number'>{stats.active}</div>
                    <Users size={18} />
                </div>
                <div className='stat-card inactive'>
                    <div className='stat-title'>العملاء غير النشطين</div>
                    <div className='stat-number'>{stats.inactive}</div>
                    <Users size={18} />
                </div>
                <div className='stat-card banned'>
                    <div className='stat-title'>العملاء المحظورون</div>
                    <div className='stat-number'>{stats.banned}</div>
                    <Users size={18} />
                </div>
            </div>

            {/* Filters Row */}
            <div className='table-tools'>
                <div className="status-filter-bar">
                    <button
                        className={`status-filter-option ${stateFilter === '' ? 'active' : ''}`}
                        onClick={() => handleFilterChange(undefined, '')}
                    >
                        كل الحالات
                    </button>
                    <button
                        className={`status-filter-option ${stateFilter === '1' ? 'active' : ''}`}
                        onClick={() => handleFilterChange(undefined, '1')}
                    >
                        نشط
                    </button>
                    <button
                        className={`status-filter-option ${stateFilter === '0' ? 'active' : ''}`}
                        onClick={() => handleFilterChange(undefined, '0')}
                    >
                        غير نشط
                    </button>
                    <button
                        className={`status-filter-option ${stateFilter === '2' ? 'active' : ''}`}
                        onClick={() => handleFilterChange(undefined, '2')}
                    >
                        محظور
                    </button>
                </div>
                <div className='search-container-users'>
                    <div className='search-input-wrapper-users'>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="البحث..."
                            value={searchTerm}
                            onChange={(e) => handleFilterChange(e.target.value, undefined)}
                            className='search-input-users'
                        />
                    </div>

                    <button
                        className='filter-btn-users'
                        onClick={() => handleFilterChange('', '')}
                        title="إعادة ضبط الفلاتر"
                    >
                        <Filter size={18} />
                        <span>إعادة ضبط</span>
                    </button>
                </div>
            </div>

            {/* Table or Empty State */}
            {filteredCustomers.length > 0 ? (
                <CustomersTable
                    customers={filteredCustomers}
                    columns={customersColumns}
                    onRowClick={setSelectedCustomer}
                    colSpan={customersColumns.length}
                />
            ) : (
                <div className="empty-state">
                    <BarChart3 size={48} />
                    <h3>لا توجد بيانات للعرض</h3>
                    <p>لا توجد بيانات عملاء متطابقة مع معايير البحث</p>
                </div>
            )}

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <CustomerDetailsModal
                    customer={selectedCustomer}
                    onClose={closeModal}
                />
            )}
        </div>
    )
}

export default UsersDataPage
