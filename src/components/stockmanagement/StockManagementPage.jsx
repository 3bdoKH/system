import React, { useState, useMemo } from 'react';
import './StockManagementPage.css';
import { Search, Filter, PackageCheck, AlertTriangle, PackagePlus, History } from 'lucide-react';
import { products, productCategories, stockMovements, stockLevels } from '../../products';
import StockTable from './StockTable';
import ProductDetailsModal from './ProductDetailsModal';
import StockMovementModal from './StockMovementModal';

/**
 * StockManagementPage - A component for managing inventory and stock
 * 
 * @returns {JSX.Element} The rendered component
 */
const StockManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showStockMovementModal, setShowStockMovementModal] = useState(false);
    const [showMovementHistory, setShowMovementHistory] = useState(false);
    const [stockMovementType, setStockMovementType] = useState('');

    // Filter products based on search term and filters
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Filter by search term
            const matchesSearch = !searchTerm ? true : (
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(product.id).includes(searchTerm)
            );

            // Filter by category
            const matchesCategory = !categoryFilter ? true :
                product.category === categoryFilter;

            // Filter by stock level
            const matchesStockLevel = !stockFilter ? true :
                (stockFilter === 'low' && product.stockQuantity <= product.minStockLevel) ||
                (stockFilter === 'normal' && product.stockQuantity > product.minStockLevel) ||
                (stockFilter === 'out' && product.stockQuantity === 0);

            return matchesSearch && matchesCategory && matchesStockLevel;
        });
    }, [products, searchTerm, categoryFilter, stockFilter]);

    // Get product movement history
    const getProductMovements = (productId) => {
        return stockMovements.filter(movement => movement.productId === productId);
    };

    // Handler for stock movement (add/remove)
    const handleStockMovement = (product, type, quantity, notes) => {
        alert(`تم ${type === 'إضافة' ? 'إضافة' : 'سحب'} ${quantity} من المنتج ${product.name}\nملاحظات: ${notes || 'لا توجد ملاحظات'}`);
        console.log(`Stock movement: ${type} ${quantity} of product ${product.id} - ${notes}`);
        // In a real app, this would update the database
        setSelectedProduct(null);
        setShowStockMovementModal(false);
    };

    // Calculate stock statistics
    const stockStats = useMemo(() => {
        const totalProducts = products.length;
        const lowStockCount = products.filter(p => p.stockQuantity <= p.minStockLevel && p.stockQuantity > 0).length;
        const outOfStockCount = products.filter(p => p.stockQuantity === 0).length;
        const totalValue = products.reduce((sum, product) => sum + (product.costPrice * product.stockQuantity), 0);

        return {
            totalProducts,
            lowStockCount,
            outOfStockCount,
            totalValue
        };
    }, [products]);

    return (
        <div className="stock-management-page">
            <h1>إدارة المخزون</h1>

            {/* Statistics cards */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-title">إجمالي المنتجات</div>
                    <div className="stat-number">{stockStats.totalProducts}</div>
                    <PackageCheck size={18} />
                </div>
                <div className="stat-card warning">
                    <div className="stat-title">منتجات منخفضة المخزون</div>
                    <div className="stat-number">{stockStats.lowStockCount}</div>
                    <AlertTriangle size={18} />
                </div>
                <div className="stat-card danger">
                    <div className="stat-title">منتجات نفذت</div>
                    <div className="stat-number">{stockStats.outOfStockCount}</div>
                    <AlertTriangle size={18} />
                </div>
                <div className="stat-card">
                    <div className="stat-title">قيمة المخزون</div>
                    <div className="stat-number">{stockStats.totalValue.toLocaleString()} ريال</div>
                    <PackageCheck size={18} />
                </div>
            </div>

            {/* Filters and search */}
            <div className="table-tools">

                <div className="stock-actions">
                    <button
                        className="add-stock-btn"
                        onClick={() => {
                            setStockMovementType('إضافة');
                            setShowStockMovementModal(true);
                        }}
                    >
                        <PackagePlus size={16} />
                        <span>إضافة مخزون</span>
                    </button>
                    <button
                        className="view-history-btn"
                        onClick={() => setShowMovementHistory(!showMovementHistory)}
                    >
                        <History size={16} />
                        <span>{showMovementHistory ? 'عرض المنتجات' : 'عرض حركة المخزون'}</span>
                    </button>
                </div>
                <div className="search-container">

                    <div className="status-filter-bar">
                        <button
                            className={`status-filter-option ${categoryFilter === '' ? 'active' : ''}`}
                            onClick={() => setCategoryFilter('')}
                        >
                            كل الفئات
                        </button>
                        {productCategories.map(option => (
                            <button
                                key={option}
                                className={`status-filter-option ${categoryFilter === option ? 'active' : ''}`}
                                onClick={() => setCategoryFilter(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="status-filter-bar">
                        <button
                            className={`status-filter-option ${categoryFilter === '' ? 'active' : ''}`}
                            onClick={() => setStockFilter('')}
                        >
                            كل المستويات
                        </button>
                        {stockLevels.map(option => (
                            <button
                                key={option}
                                className={`status-filter-option ${stockFilter === option ? 'active' : ''}`}
                                onClick={() => setStockFilter(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="search-input-wrapper">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="البحث في المنتجات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <button
                        className="filter-btn"
                        onClick={() => {
                            setSearchTerm('');
                            setCategoryFilter('');
                            setStockFilter('');
                        }}
                        title="إعادة ضبط الفلاتر"
                    >
                        <Filter size={18} />
                        <span>إعادة ضبط</span>
                    </button>
                </div>
            </div>

            {/* Product table or movement history */}
            {!showMovementHistory ? (
                <StockTable
                    products={filteredProducts}
                    onRowClick={(product) => setSelectedProduct(product)}
                    onAddStock={(product) => {
                        setSelectedProduct(product);
                        setStockMovementType('إضافة');
                        setShowStockMovementModal(true);
                    }}
                    onRemoveStock={(product) => {
                        setSelectedProduct(product);
                        setStockMovementType('سحب');
                        setShowStockMovementModal(true);
                    }}
                />
            ) : (
                <div className="stock-movement-history">
                    <h2>سجل حركة المخزون</h2>
                    <table className="movement-table">
                        <thead>
                            <tr>
                                <th>التاريخ</th>
                                <th>المنتج</th>
                                <th>نوع الحركة</th>
                                <th>الكمية</th>
                                <th>المخزون السابق</th>
                                <th>المخزون الجديد</th>
                                <th>ملاحظات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockMovements.sort((a, b) => new Date(b.date) - new Date(a.date)).map((movement) => {
                                const product = products.find(p => p.id === movement.productId);
                                return (
                                    <tr key={movement.id}>
                                        <td>{new Date(movement.date).toLocaleDateString('ar-SA')}</td>
                                        <td>{product ? product.name : `منتج #${movement.productId}`}</td>
                                        <td className={`movement-type ${movement.type === 'إضافة' ? 'add' : movement.type === 'سحب' ? 'remove' : 'adjust'}`}>
                                            {movement.type}
                                        </td>
                                        <td>{movement.quantity}</td>
                                        <td>{movement.previousStock}</td>
                                        <td>{movement.newStock}</td>
                                        <td>{movement.notes}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Product Details Modal */}
            {selectedProduct && !showStockMovementModal && (
                <ProductDetailsModal
                    product={selectedProduct}
                    movements={getProductMovements(selectedProduct.id)}
                    onClose={() => setSelectedProduct(null)}
                    onAddStock={() => {
                        setStockMovementType('إضافة');
                        setShowStockMovementModal(true);
                    }}
                    onRemoveStock={() => {
                        setStockMovementType('سحب');
                        setShowStockMovementModal(true);
                    }}
                />
            )}

            {/* Stock Movement Modal */}
            {showStockMovementModal && selectedProduct && (
                <StockMovementModal
                    product={selectedProduct}
                    movementType={stockMovementType}
                    onClose={() => setShowStockMovementModal(false)}
                    onSubmit={(quantity, notes) => handleStockMovement(selectedProduct, stockMovementType, quantity, notes)}
                />
            )}
        </div>
    );
};

export default StockManagementPage;
