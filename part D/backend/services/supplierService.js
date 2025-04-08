const db = require("../db");

const getSupplierOrders = (supplierId) => {
  const query = `
    SELECT
        o.id AS order_id,
        o.status,
        o.order_date,
        oi.pro_id AS product_id,
        p.product_name,
        oi.quantity,
        sp.price
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.pro_id = p.id
    LEFT JOIN supplier_products sp ON p.id = sp.pro_id AND o.supp_id = sp.supp_id
    WHERE o.supp_id = ?
    ORDER BY o.id DESC;
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [supplierId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const approveOrder = (supplierId, orderId) => {
  const query = `UPDATE orders SET status = 'in_process' WHERE id = ? AND supp_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [orderId, supplierId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  getSupplierOrders,
  approveOrder,
};
