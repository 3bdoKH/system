import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import OrdersPage from "./components/orderspage/OrdersPage";
import { newOrders } from "./data";

function App() {
  const orderColumns = [
    { header: "ID", key: "id" },
    { header: "العميل", key: "customer" },
    { header: "العنوان", key: "address" },
    {
      header: "المجموع",
      key: "total",
      render: (order) => `${order.total} ر.س`,
    },
    { header: "الحالة", key: "status" },
    { header: "الهاتف", key: "phone" },
    { header: "التاريخ", key: "date" },
  ];

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
                columns={orderColumns}
                onAction={handleOrderAction}
                filterOptions={[
                  "تحت المراجعة",
                  "مؤكد",
                  "مؤجل",
                  "ملغي",
                  "مشحون",
                  "مستلم",
                  "مرتجع",
                ]}
                emptyStateMessage="لا توجد طلبات"
              />
            }
          />

          <Route
            path="/new-orders"
            element={
              <OrdersPage
                title="الطلبات الجديدة"
                orders={newOrders.filter(
                  (order) => order.status === "تحت المراجعة"
                )}
                columns={orderColumns}
                onAction={handleOrderAction}
                filterOptions={["تحت المراجعة"]}
                initialStatus="تحت المراجعة"
                emptyStateMessage="لا توجد طلبات جديدة"
              />
            }
          />

          <Route
            path="/delayed-orders"
            element={
              <OrdersPage
                title="الطلبات المؤجلة"
                orders={newOrders.filter((order) => order.status === "مؤجل")}
                columns={orderColumns}
                onAction={handleOrderAction}
                filterOptions={["مؤجل"]}
                initialStatus="مؤجل"
                emptyStateMessage="لا توجد طلبات مؤجلة"
              />
            }
          />

          <Route
            path="/cancelled-orders"
            element={
              <OrdersPage
                title="الطلبات الملغاة"
                orders={newOrders.filter((order) => order.status === "ملغي")}
                columns={orderColumns}
                onAction={handleOrderAction}
                filterOptions={["ملغي"]}
                initialStatus="ملغي"
                emptyStateMessage="لا توجد طلبات ملغاة"
              />
            }
          />

          <Route
            path="/confirmed-orders"
            element={
              <OrdersPage
                title="الطلبات المؤكدة"
                orders={newOrders.filter((order) => order.status === "مؤكد")}
                columns={orderColumns}
                onAction={handleOrderAction}
                filterOptions={["مؤكد"]}
                initialStatus="مؤكد"
                emptyStateMessage="لا توجد طلبات مؤكدة"
              />
            }
          />

          <Route
            path="/shipped-orders"
            element={
              <OrdersPage
                title="الطلبات المشحونة"
                orders={newOrders.filter((order) => order.status === "مشحون")}
                columns={orderColumns}
                onAction={handleOrderAction}
                filterOptions={["مشحون"]}
                initialStatus="مشحون"
                emptyStateMessage="لا توجد طلبات مشحونة"
              />
            }
          />

          <Route
            path="/returned-orders"
            element={
              <OrdersPage
                title="الطلبات المرتجعة"
                orders={newOrders.filter((order) => order.status === "مرتجع")}
                columns={orderColumns}
                onAction={handleOrderAction}
                filterOptions={["مرتجع"]}
                initialStatus="مرتجع"
                emptyStateMessage="لا توجد طلبات مرتجعة"
              />
            }
          />

          <Route
            path="/completed-orders"
            element={
              <OrdersPage
                title="الطلبات المستلمة"
                orders={newOrders.filter((order) => order.status === "مستلم")}
                columns={orderColumns}
                onAction={handleOrderAction}
                filterOptions={["مستلم"]}
                initialStatus="مستلم"
                emptyStateMessage="لا توجد طلبات مستلمة"
              />
            }
          />

          <Route
            path="/users-data"
            element={
              <div className="not-found">صفحة بيانات العملاء - قيد التطوير</div>
            }
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
