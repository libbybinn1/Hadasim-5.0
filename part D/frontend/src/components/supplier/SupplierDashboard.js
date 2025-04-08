// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import OrderItem from "../OrderItem";  // Import the new OrderItem component
// import '../../styles/General.css';

// function SupplierDashboard() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const storedUser = localStorage.getItem("currentUser");
//       if (!storedUser) {
//         navigate("/logIn");
//         return;
//       }

//       const parsedUser = JSON.parse(storedUser);
//       setUserData(parsedUser);

//       if (parsedUser.role !== "supplier") {
//         navigate("/logIn");
//         return;
//       }

//       try {
//         const res = await fetch(`http://localhost:5000/api/supplier/${parsedUser.id}/orders`);
//         if (!res.ok) throw new Error("Failed to fetch orders");

//         const data = await res.json();

//         const reversedOrders = data.reverse();
//         setOrders(reversedOrders);
//       } catch (error) {
//         console.error("Error loading orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("currentUser");
//     navigate("/logIn");
//   };

//   const approveOrder = async (orderId) => {
//     if (!userData) return;

//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/supplier/${userData.id}/orders/${orderId}/approve`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setOrders((prevOrders) =>
//           prevOrders.map((order) =>
//             order.id === orderId ? { ...order, status: "in_process" } : order
//           )
//         );
//       } else {
//         console.error("Failed to approve order:", data.message);
//       }
//     } catch (error) {
//       console.error("Error approving order:", error);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString() + " " + date.toLocaleTimeString();
//   };

//   const calculateTotalPrice = (order) => {
//     return order.products?.reduce(
//       (total, product) =>
//         total + (product.subtotal || product.quantity * product.price),
//       0
//     ).toFixed(2);
//   };

//   if (loading) return <p>Loading orders...</p>;

//   return (
//     <div className="supplier-dashboard">
//       <header className="dashboard-header">
//         <div>
//           <h2>Supplier Dashboard</h2>
//           {userData?.representativeName && <p>Welcome, {userData.representativeName}</p>}
//           {userData?.companyName && <p>Company: {userData.companyName}</p>}
//         </div>
//         <button onClick={handleLogout} className="logout-button">
//           Logout
//         </button>
//       </header>

//       <section className="orders-section">
//         <h3>Your Orders</h3>
//         {orders.length === 0 ? (
//           <p className="no-orders">No orders found.</p>
//         ) : (
//           <ul className="orders-list">
//             {orders.map((order) => (
//               <li key={order.id} className="order-item">
//                 <div className="order-header">
//                   <strong>🛒 Order #{order.id}</strong> - Status:{" "}
//                   <span className={`status-${order.status}`}>{order.status}</span>
//                   {order.order_date && <span> - {formatDate(order.order_date)}</span>}

//                   <p><strong>Total Price:</strong> ${calculateTotalPrice(order)}</p>
//                 </div>

//                 {order.products?.length > 0 ? (
//                   <ul className="products-list">
//                     {order.products.map((product) => (
//                       <OrderItem key={product.product_id} product={product} />
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No products in this order</p>
//                 )}

//                 {order.status === "pending" && (
//                   <button onClick={() => approveOrder(order.id)} className="approve-button">
//                     Approve Order
//                   </button>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }

// export default SupplierDashboard;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderItem from "../OrderItem"; // Component for rendering individual products
import '../../styles/General.css';

function SupplierDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Fetch orders and user data on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = localStorage.getItem("currentUser");
      if (!storedUser) return navigate("/logIn");

      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);

      if (parsedUser.role !== "supplier") return navigate("/logIn");

      try {
        const res = await fetch(`http://localhost:5000/api/supplier/${parsedUser.id}/orders`);
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data.reverse()); // Show latest orders first
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/logIn");
  };

  // Approve a specific order
  const approveOrder = async (orderId) => {
    if (!userData) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/supplier/${userData.id}/orders/${orderId}/approve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "in_process" } : order
          )
        );
      } else {
        console.error("Failed to approve order:", data.message);
      }
    } catch (error) {
      console.error("Error approving order:", error);
    }
  };

  // Format date and time for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Calculate total price for an order
  const calculateTotalPrice = (order) => {
    return order.products?.reduce(
      (total, product) =>
        total + (product.subtotal || product.quantity * product.price),
      0
    ).toFixed(2);
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="supplier-dashboard">
      <header className="dashboard-header">
        <div>
          <h2>Supplier Dashboard</h2>
          {userData?.representativeName && <p>Welcome, {userData.representativeName}</p>}
          {userData?.companyName && <p>Company: {userData.companyName}</p>}
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <section className="orders-section">
        <h3>Your Orders</h3>

        {orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          <ul className="orders-list">
            {orders.map((order) => (
              <li key={order.id} className="order-item">
                <div className="order-header">
                  <strong>🛒 Order #{order.id}</strong> - Status:{" "}
                  <span className={`status-${order.status}`}>{order.status}</span>
                  {order.order_date && <span> - {formatDate(order.order_date)}</span>}

                  <p><strong>Total Price:</strong> ${calculateTotalPrice(order)}</p>
                </div>

                {order.products?.length > 0 ? (
                  <ul className="products-list">
                    {order.products.map((product) => (
                      <OrderItem key={product.product_id} product={product} />
                    ))}
                  </ul>
                ) : (
                  <p>No products in this order</p>
                )}

                {order.status === "pending" && (
                  <button
                    onClick={() => approveOrder(order.id)}
                    className="approve-button"
                  >
                    Approve Order
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default SupplierDashboard;
