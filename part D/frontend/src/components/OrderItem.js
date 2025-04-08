import React from "react";

// Returning all the order items in a nice format.
const OrderItem = ({ product }) => {
  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? "₪0.00" : `₪${num.toFixed(2)}`;
  };

  const total = product.quantity * product.price;
   
  return (
    <li className="product-item">
      <span>{product.product_name}</span> | 
      <span> Quantity: {product.quantity}</span> | 
      <span> Price: {formatPrice(product.price)}</span> | 
      <span> Subtotal: {formatPrice(total)}</span>
    </li>
  );
};

export default OrderItem;


