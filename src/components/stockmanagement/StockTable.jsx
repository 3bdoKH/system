import React from 'react';
import './StockTable.css';
import { Plus, Minus, AlertTriangle, Check } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

/**
 * StockTable - A component for displaying inventory products
 * 
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of product objects
 * @param {Function} props.onRowClick - Function called when a row is clicked
 * @param {Function} props.onAddStock - Function called when add stock button is clicked
 * @param {Function} props.onRemoveStock - Function called when remove stock button is clicked
 * @returns {JSX.Element} The rendered component
 */
const StockTable = ({
  products = [],
  onRowClick,
  onAddStock,
  onRemoveStock
}) => {
  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <thead>
          <tr>
            <th>الصورة</th>
            <th>اسم المنتج</th>
            <th>رمز المنتج</th>
            <th>الفئة</th>
            <th>المخزون الحالي</th>
            <th>الحد الأدنى</th>
            <th>سعر البيع</th>
            <th>سعر التكلفة</th>
            <th>حالة المخزون</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => {
              // Determine stock status
              const isLowStock = product.stockQuantity <= product.minStockLevel && product.stockQuantity > 0;
              const isOutOfStock = product.stockQuantity === 0;
              const stockStatusClass = isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock';

              return (
                <tr
                  key={product.id}
                  onClick={() => onRowClick(product)}
                  className={`product-row ${stockStatusClass}`}
                >
                  <td className="product-image">
                    <img src={require(`../../${product.imageUrl}`)} alt={product.name} />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td className="stock-quantity">{product.stockQuantity}</td>
                  <td>{product.minStockLevel}</td>
                  <td>{product.price} ريال</td>
                  <td>{product.costPrice} ريال</td>
                  <td>
                    <span className={`stock-status ${stockStatusClass}`}>
                      {isOutOfStock ? (
                        <>
                          <AlertTriangle size={14} />
                          <span>نفذ من المخزون</span>
                        </>
                      ) : isLowStock ? (
                        <>
                          <AlertTriangle size={14} />
                          <span>منخفض</span>
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          <span>متوفر</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="add-btn"
                      title="إضافة للمخزون"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddStock(product);
                      }}
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      className="remove-btn"
                      title="سحب من المخزون"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStock(product);
                      }}
                      disabled={isOutOfStock}
                    >
                      <Minus size={16} />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className="empty-row">
              <td colSpan="11">
                <div className="empty-state">
                  <AlertTriangle size={24} />
                  <p>لا توجد منتجات متطابقة مع معايير البحث</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
