import React, { useState } from 'react';
import './ProductDetailsModal.css';
import { X, Plus, Minus, Package, DollarSign, History } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

/**
 * ProductDetailsModal - Modal for displaying and editing product details
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - Product object
 * @param {Array} props.movements - Stock movement history for this product
 * @param {Function} props.onClose - Function called when modal is closed
 * @param {Function} props.onAddStock - Function called when add stock button is clicked
 * @param {Function} props.onRemoveStock - Function called when remove stock button is clicked
 * @returns {JSX.Element} The rendered component
 */
const ProductDetailsModal = ({ product, movements, onClose, onAddStock, onRemoveStock }) => {
  const [activeTab, setActiveTab] = useState('details');

  // Determine stock status
  const isLowStock = product.stockQuantity <= product.minStockLevel && product.stockQuantity > 0;
  const isOutOfStock = product.stockQuantity === 0;
  
  return (
    <div className="modal-overlay">
      <div className="product-details-modal">
        <div className="modal-header">
          <h2>{product.name}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`} 
            onClick={() => setActiveTab('details')}
          >
            <Package size={16} />
            تفاصيل المنتج
          </button>
          <button 
            className={`tab-button ${activeTab === 'movements' ? 'active' : ''}`} 
            onClick={() => setActiveTab('movements')}
          >
            <History size={16} />
            سجل الحركات ({movements.length})
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'details' ? (
            <>
              <div className="product-image-container">
                <img src={product.imageUrl} alt={product.name} />
                <div className={`stock-badge ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'normal'}`}>
                  {isOutOfStock ? 'نفذ من المخزون' : isLowStock ? 'مخزون منخفض' : 'متوفر'}
                </div>
              </div>

              <div className="product-info-grid">
                <div className="info-group">
                  <span className="label">رمز المنتج (SKU):</span>
                  <span className="value">{product.sku}</span>
                </div>
                <div className="info-group">
                  <span className="label">الفئة:</span>
                  <span className="value">{product.category}</span>
                </div>
                <div className="info-group">
                  <span className="label">المورد:</span>
                  <span className="value">{product.supplier}</span>
                </div>
                <div className="info-group">
                  <span className="label">سعر البيع:</span>
                  <span className="value price">{product.price} ريال</span>
                </div>
                <div className="info-group">
                  <span className="label">سعر التكلفة:</span>
                  <span className="value cost">{product.costPrice} ريال</span>
                </div>
                <div className="info-group">
                  <span className="label">الربح:</span>
                  <span className="value profit">{(product.price - product.costPrice).toFixed(2)} ريال</span>
                </div>
                <div className="info-group">
                  <span className="label">آخر تحديث للمخزون:</span>
                  <span className="value">{formatDate(product.lastRestockDate)}</span>
                </div>
              </div>

              <div className="product-description">
                <h3>الوصف</h3>
                <p>{product.description}</p>
              </div>

              <div className="stock-management">
                <h3>إدارة المخزون</h3>
                <div className="stock-info">
                  <div className="stock-count">
                    <span className="label">المخزون الحالي:</span>
                    <span className={`value ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'normal'}`}>
                      {product.stockQuantity} وحدة
                    </span>
                  </div>
                  <div className="min-stock">
                    <span className="label">الحد الأدنى:</span>
                    <span className="value">{product.minStockLevel} وحدة</span>
                  </div>
                  <div className="stock-value">
                    <span className="label">قيمة المخزون:</span>
                    <span className="value">
                      {(product.stockQuantity * product.costPrice).toLocaleString()} ريال
                    </span>
                  </div>
                </div>
                <div className="stock-actions">
                  <button className="add-stock" onClick={onAddStock}>
                    <Plus size={16} />
                    إضافة للمخزون
                  </button>
                  <button 
                    className="remove-stock" 
                    onClick={onRemoveStock}
                    disabled={isOutOfStock}
                  >
                    <Minus size={16} />
                    سحب من المخزون
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="movement-history">
              <h3>سجل حركة المخزون</h3>
              {movements.length > 0 ? (
                <table className="movements-table">
                  <thead>
                    <tr>
                      <th>التاريخ</th>
                      <th>نوع الحركة</th>
                      <th>الكمية</th>
                      <th>المخزون السابق</th>
                      <th>المخزون الجديد</th>
                      <th>ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.sort((a, b) => new Date(b.date) - new Date(a.date)).map((movement) => (
                      <tr key={movement.id}>
                        <td>{new Date(movement.date).toLocaleDateString('ar-SA')}</td>
                        <td className={`movement-type ${movement.type === 'إضافة' ? 'add' : movement.type === 'سحب' ? 'remove' : 'adjust'}`}>
                          {movement.type}
                        </td>
                        <td>{movement.quantity}</td>
                        <td>{movement.previousStock}</td>
                        <td>{movement.newStock}</td>
                        <td>{movement.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-movements">
                  <p>لا توجد حركات مسجلة لهذا المنتج</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
