
// import React, { useEffect, useState } from "react"; 
// import { useNavigate } from "react-router-dom";
// import OrderList from "../OrderList";
// import LogoutButton from "../auth/LogoutButton";

// export default function OwnerDashboard() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("currentUser"));
//     if (!user || user.role !== "owner") return navigate("/logIn");
//     setUserData(user);
//     fetchOrders();
//   }, [navigate]);

//   const fetchOrders = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/owner/orders");
//       if (!res.ok) throw new Error("Failed to fetch orders");
//       const data = await res.json();
//       const reversedOrders = data.reverse();

//       setOrders(processOrderData(reversedOrders));
//     } catch (err) {
//       console.error("Error loading orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const processOrderData = (data) => {
//     if (!Array.isArray(data)) return [];
//     if (data[0]?.products) {
//       return data.map((order) => ({
//         ...order,
//         supplier_id: order.supplier_id || order.supp_id,
//         company_name: order.company_name || null,
//         representative_name: order.representative_name || null,
//         supplier_phone: order.supplier_phone || order.phone_number || null,
//       }));
//     }
//     const grouped = {};
//     data.forEach((item) => {
//       const id = item.order_id || item.id;
//       if (!grouped[id]) {
//         grouped[id] = {
//           id,
//           order_date: item.order_date,
//           status: item.status,
//           supplier_id: item.supplier_id || item.supp_id,
//           company_name: item.company_name,
//           representative_name: item.representative_name,
//           supplier_phone: item.supplier_phone || item.phone_number,
//           products: [],
//         };
//       }
//       grouped[id].products.push({
//         product_id: item.product_id,
//         product_name: item.product_name,
//         quantity: item.quantity,
//         price: item.price,
//         subtotal: item.subtotal || item.quantity * item.price,
//       });
//     });
//     return Object.values(grouped);
//   };

//   const handleStatusChange = async (id, status) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/owner/orders/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status }),
//       });
//       if (!res.ok) throw new Error('Status update failed');
//       setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
//     } catch (err) {
//       console.error('Error updating status:', err);
//     }
//   };

//   const createOrder = () => navigate("/owner/order");

//   return (
//     <div className="owner-dashboard">
//       <header className="dashboard-header">
//         <div>
//           <h2>Owner Dashboard</h2>
//         </div>
//         <LogoutButton />
//       </header>

//       <section className="orders-section">
//         <h3>All Orders:</h3>
//         <button onClick={createOrder} className="create-order-button">
//           Create Order
//         </button>

//         {loading ? (
//           <p>Loading orders...</p>
//         ) : orders.length === 0 ? (
//           <p className="no-orders">No orders found.</p>
//         ) : (
//           <div>
//             {orders.map((order) => (
//               <div key={order.id} className="order-item">
//                 <OrderList orders={[order]} />

//                 {order.status === 'in_process' && userData?.role === 'owner' && (
//                   <button onClick={() => handleStatusChange(order.id, 'completed')} className="approve-button">
//                     Mark as Completed
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderList from "../OrderList";
import LogoutButton from "../auth/LogoutButton";

export default function OwnerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== "owner") {
      navigate("/logIn");
      return;
    }

    setUserData(user);
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/owner/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      const reversedOrders = data.reverse();

      setOrders(processOrderData(reversedOrders));
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Normalizes and groups order data from the backend
  const processOrderData = (data) => {
    if (!Array.isArray(data)) return [];

    // If orders are already grouped with products
    if (data[0]?.products) {
      return data.map((order) => ({
        ...order,
        supplier_id: order.supplier_id || order.supp_id,
        company_name: order.company_name || null,
        representative_name: order.representative_name || null,
        supplier_phone: order.supplier_phone || order.phone_number || null,
      }));
    }

    // If orders are flat and need to be grouped by order ID
    const grouped = {};
    data.forEach((item) => {
      const id = item.order_id || item.id;

      if (!grouped[id]) {
        grouped[id] = {
          id,
          order_date: item.order_date,
          status: item.status,
          supplier_id: item.supplier_id || item.supp_id,
          company_name: item.company_name,
          representative_name: item.representative_name,
          supplier_phone: item.supplier_phone || item.phone_number,
          products: [],
        };
      }

      grouped[id].products.push({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal || item.quantity * item.price,
      });
    });

    return Object.values(grouped);
  };

  // Updates the order status in the backend
  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/owner/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Status update failed");

      // Update local state with new status
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const createOrder = () => navigate("/owner/order");

  return (
    <div className="owner-dashboard">
      <header className="dashboard-header">
        <h2>Owner Dashboard</h2>
        <LogoutButton />
      </header>

      <section className="orders-section">
        <h3>All Orders:</h3>
        <button onClick={createOrder} className="create-order-button">
          Create Order
        </button>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order.id} className="order-item">
                <OrderList orders={[order]} />

                {/* Owner can mark 'in_process' orders as completed */}
                {order.status === "in_process" && userData?.role === "owner" && (
                  <button
                    onClick={() => handleStatusChange(order.id, "completed")}
                    className="approve-button"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
