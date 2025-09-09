import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import OrdersPage from "./components/orderspage/OrdersPage";
import UsersDataPage from "./components/usersdatapage/UsersDataPage";
import { newOrders, customers } from "./data";
import {
  allOrdersColumns,
  newOrdersColumns,
  confirmedOrdersColumns,
  shippedOrdersColumns,
  delayedOrdersColumns,
  getOrderStatusFilterOptions,
} from "./components/orderstable/tableColumns";

function App() {
  // Filter options from our order status values
  const filterOptions = getOrderStatusFilterOptions();

  // Handler for order actions
  const handleOrderAction = (order, actionType, note) => {
    // In a real app, this would make an API call to update the order
    alert(
      `تم ${actionType} الطلب رقم ${order.id}\nملاحظة: ${
        note || "لا توجد ملاحظات"
      }`
    );
    console.log(`Order ${order.id} ${actionType} with note: ${note}`);
    // You would typically refetch or update state here
  };

  return (
    <div className="App">
      <Sidebar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/new-orders" replace />} />

          <Route
            path="/all-orders"
            element={
              <OrdersPage
                title="جميع الطلبات"
                orders={newOrders}
                columns={allOrdersColumns}
                onAction={handleOrderAction}
                filterOptions={filterOptions}
                emptyStateMessage="لا توجد طلبات"
              />
            }
          />

          <Route
            path="/new-orders"
            element={
              <OrdersPage
                title="الطلبات الجديدة"
                orders={newOrders.filter((order) => order.orderState === 0)}
                columns={newOrdersColumns}
                onAction={handleOrderAction}
                filterOptions={[filterOptions[0]]}
                initialStatus={filterOptions[0]}
                emptyStateMessage="لا توجد طلبات جديدة"
              />
            }
          />

          <Route
            path="/delayed-orders"
            element={
              <OrdersPage
                title="الطلبات المؤجلة"
                orders={newOrders.filter((order) => order.orderState === 2)}
                columns={delayedOrdersColumns}
                onAction={handleOrderAction}
                filterOptions={[filterOptions[2]]}
                initialStatus={filterOptions[2]}
                emptyStateMessage="لا توجد طلبات مؤجلة"
              />
            }
          />

          <Route
            path="/cancelled-orders"
            element={
              <OrdersPage
                title="الطلبات الملغاة"
                orders={newOrders.filter((order) => order.orderState === 3)}
                columns={allOrdersColumns}
                onAction={handleOrderAction}
                filterOptions={[filterOptions[3]]}
                initialStatus={filterOptions[3]}
                emptyStateMessage="لا توجد طلبات ملغاة"
              />
            }
          />

          <Route
            path="/confirmed-orders"
            element={
              <OrdersPage
                title="الطلبات المؤكدة"
                orders={newOrders.filter((order) => order.orderState === 1)}
                columns={confirmedOrdersColumns}
                onAction={handleOrderAction}
                filterOptions={[filterOptions[1]]}
                initialStatus={filterOptions[1]}
                emptyStateMessage="لا توجد طلبات مؤكدة"
              />
            }
          />

          <Route
            path="/shipped-orders"
            element={
              <OrdersPage
                title="الطلبات المشحونة"
                orders={newOrders.filter((order) => order.orderState === 4)}
                columns={shippedOrdersColumns}
                onAction={handleOrderAction}
                filterOptions={[filterOptions[4]]}
                initialStatus={filterOptions[4]}
                emptyStateMessage="لا توجد طلبات مشحونة"
              />
            }
          />

          <Route
            path="/returned-orders"
            element={
              <OrdersPage
                title="الطلبات المرتجعة"
                orders={newOrders.filter((order) => order.orderState === 6)}
                columns={allOrdersColumns}
                onAction={handleOrderAction}
                filterOptions={[filterOptions[6]]}
                initialStatus={filterOptions[6]}
                emptyStateMessage="لا توجد طلبات مرتجعة"
              />
            }
          />

          <Route
            path="/completed-orders"
            element={
              <OrdersPage
                title="الطلبات المستلمة"
                orders={newOrders.filter((order) => order.orderState === 5)}
                columns={allOrdersColumns}
                onAction={handleOrderAction}
                filterOptions={[filterOptions[5]]}
                initialStatus={filterOptions[5]}
                emptyStateMessage="لا توجد طلبات مستلمة"
              />
            }
          />

          <Route
            path="/users-data"
            element={<UsersDataPage customers={customers} />}
          />

          <Route
            path="*"
            element={<div className="not-found">الصفحة غير موجودة</div>}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
