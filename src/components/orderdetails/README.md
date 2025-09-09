# OrderDetailsModal Component

## Updated Implementation for New API Format

The OrderDetailsModal component has been updated to work with the new API data structure. This component displays comprehensive order details including customer information, financial data, shipping details, and status.

## Usage

```jsx
import React, { useState } from 'react';
import OrderDetailsModal from './components/orderdetails/OrderDetailsModal';

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Example function to handle API data
  const handleViewOrderDetails = (orderId) => {
    // Fetch order data from API
    fetchOrderDetails(orderId).then(response => {
      setSelectedOrder(response);
      
      // If customer data isn't included, fetch it separately
      if (response.customerId) {
        fetchCustomerDetails(response.customerId).then(customerData => {
          setSelectedCustomer(customerData);
          setShowModal(true);
        });
      } else {
        setShowModal(true);
      }
    });
  };

  const handleOrderAction = (actionType, note) => {
    // Handle order actions (confirm, cancel, delay, etc.)
    console.log(`Action: ${actionType}, Note: ${note}`);
    
    // Example implementation:
    updateOrderStatus(selectedOrder.id, actionType, note).then(() => {
      // Refresh data or show success message
      setShowModal(false);
    });
  };

  return (
    <div>
      {/* Your orders list/table implementation */}
      
      {/* Modal */}
      {showModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          customer={selectedCustomer}
          onClose={() => setShowModal(false)}
          onAction={handleOrderAction}
        />
      )}
    </div>
  );
};

export default OrdersPage;
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `order` | Object | The order data object from the API |
| `customer` | Object | The customer data object from the API |
| `onClose` | Function | Function to close the modal |
| `onAction` | Function | Function called when an action button is clicked (receives actionType and note) |

## Order Status Mapping

The component maps numeric `orderState` values to text as follows:

| orderState | Text Status (Arabic) |
|------------|----------------------|
| 0 | جديد (New) |
| 1 | مؤكد (Confirmed) |
| 2 | مؤجل (Delayed) |
| 3 | ملغي (Cancelled) |
| 4 | مشحون (Shipped) |
| 5 | مستلم (Delivered) |
| 6 | مرتجع (Returned) |
| 7 | مكتمل (Completed) |

## Data Formatting

The component uses utility functions from `src/utils/formatters.js` for:
- Date formatting (`formatDate`)
- Currency formatting (can be implemented as needed)
