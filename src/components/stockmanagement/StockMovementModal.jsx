import React, { useState } from 'react';
import './StockMovementModal.css';
import { X, Plus, Minus } from 'lucide-react';

/**
 * StockMovementModal - Modal for adding or removing stock
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - Product object
 * @param {string} props.movementType - Type of movement ('إضافة' or 'سحب')
 * @param {Function} props.onClose - Function called when modal is closed
 * @param {Function} props.onSubmit - Function called when movement is submitted
 * @returns {JSX.Element} The rendered component
 */
const StockMovementModal = ({ product, movementType, onClose, onSubmit }) => {
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const isAddition = movementType === 'إضافة';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate quantity
    const quantityNum = Number(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      setError('يرجى إدخال كمية صالحة أكبر من صفر');
      return;
    }

    // For removal, check if there's enough stock
    if (!isAddition && quantityNum > product.stockQuantity) {
      setError(`الكمية المتوفرة في المخزون (${product.stockQuantity}) أقل من الكمية المطلوبة`);
      return;
    }

    // Submit the movement
    onSubmit(quantityNum, notes);
  };

  return (
    <div className="modal-overlay">
      <div className="stock-movement-modal">
        <div className="modal-header">
          <h2>{isAddition ? 'إضافة' : 'سحب'} مخزون</h2>
          <button className="close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="product-summary">
              <img src={product.imageUrl} alt={product.name} className="product-thumbnail" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="sku">{product.sku}</div>
                <div className="current-stock">
                  المخزون الحالي: <span>{product.stockQuantity}</span> وحدة
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">الكمية {isAddition ? 'المضافة' : 'المسحوبة'}</label>
              <div className="quantity-input-wrapper">
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setError('');
                  }}
                  min="1"
                  max={!isAddition ? product.stockQuantity : undefined}
                  className="quantity-input"
                  placeholder="أدخل الكمية"
                  autoFocus
                />
                {isAddition ? (
                  <Plus size={18} className="quantity-icon add" />
                ) : (
                  <Minus size={18} className="quantity-icon remove" />
                )}
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="notes">ملاحظات (اختياري)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="notes-input"
                placeholder="أدخل أي ملاحظات إضافية"
                rows={3}
              />
            </div>

            <div className="result-preview">
              <div className="preview-title">ملخص العملية:</div>
              <div className="preview-item">
                <span className="label">الكمية الحالية:</span>
                <span className="value">{product.stockQuantity} وحدة</span>
              </div>
              <div className="preview-item">
                <span className="label">التغيير:</span>
                <span className={`value ${isAddition ? 'positive' : 'negative'}`}>
                  {isAddition ? '+' : '-'}{quantity || '0'} وحدة
                </span>
              </div>
              <div className="preview-item final">
                <span className="label">الكمية النهائية:</span>
                <span className="value">
                  {isAddition 
                    ? product.stockQuantity + Number(quantity || 0)
                    : product.stockQuantity - Number(quantity || 0) < 0
                      ? 0
                      : product.stockQuantity - Number(quantity || 0)
                  } وحدة
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>إلغاء</button>
            <button 
              type="submit" 
              className={`submit-button ${isAddition ? 'add' : 'remove'}`}
            >
              تأكيد {isAddition ? 'الإضافة' : 'السحب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockMovementModal;
