// // src/components/OrderList.j
import React from 'react';
import { formatDate, formatPrice, orderTotal } from '../utils';
export default function OrderList({ orders, debug }) {
  return (
    <ul className="orders-list">
      {orders.map(order => (
        <li key={order.id} className="order-item">
          {debug && (
            <div className="debug-info">
              <strong>Debug Info:</strong>
              <pre>{JSON.stringify(order, null, 2)}</pre>
            </div>
          )}

          <div className="order-header">
            <strong>🛒 Order #{order.id}</strong> - Status: <span className={`status-${order.status}`}>{order.status}</span>
            {order.order_date && <> - {formatDate(order.order_date)}</>}
          </div>

          <div className="supplier-details">
            <h4>Supplier Information</h4>
            <p><strong>Company:</strong> {order.company_name || 'N/A'}</p>
            <p><strong>Representative:</strong> {order.representative_name || 'N/A'}</p>
            <p><strong>Phone:</strong> {order.supplier_phone || 'N/A'}</p>
            {order.supplier_id && <p><strong>Supplier ID:</strong> {order.supplier_id}</p>}
          </div>

          {order.products?.length ? (
            <div className="order-details">
              <h4>Order Items</h4>
              <ul className="products-list">
                {order.products.map((p, i) => (
                  <li key={i} className="product-item">
                    <strong>{p.product_name}</strong> | Quantity: {p.quantity} | Price: ₪{formatPrice(p.price)} | Subtotal: ₪{formatPrice(p.subtotal || p.quantity * p.price)}
                  </li>
                ))}
              </ul>
              <div className="order-summary">
                <p className="order-total">
                  <strong>Total Order Value:</strong> ₪{formatPrice(orderTotal(order.products))}
                </p>
              </div>
            </div>
          ) : (
            <p>No products in this order</p>
          )}
        </li>
      ))}
    </ul>
  );
}
