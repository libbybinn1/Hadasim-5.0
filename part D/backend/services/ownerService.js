const db = require("../db");

const getAllOrders = () => {
  const query = `
    SELECT 
      o.id AS order_id, o.order_date, o.status,
      s.id AS supplier_id, s.company_name, s.representative_name,
      u.phone_number AS supplier_phone,
      p.id AS product_id, p.product_name, oi.quantity, sp.price,
      (oi.quantity * sp.price) AS subtotal
    FROM orders o
    LEFT JOIN suppliers s ON o.supp_id = s.id
    LEFT JOIN users u ON s.id = u.user_id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.pro_id = p.id
    LEFT JOIN supplier_products sp ON s.id = sp.supp_id AND p.id = sp.pro_id
    ORDER BY o.id, p.id;
  `;

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const completeOrder = (orderId) => {
  const query = `UPDATE orders SET status = 'completed' WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getSuppliers = () => {
  const query = `
    SELECT s.id AS supplier_id, s.company_name, s.representative_name, u.phone_number
    FROM suppliers s
    LEFT JOIN users u ON s.id = u.user_id
    ORDER BY s.company_name;
  `;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getSupplierProducts = (supplier_id) => {
  const query = `
    SELECT p.id AS product_id, p.product_name, sp.price, sp.minimum_quantity
    FROM products p
    JOIN supplier_products sp ON p.id = sp.pro_id
    WHERE sp.supp_id = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [supplier_id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const validateOrder = (selectedProducts, supplierId) => {
  return new Promise((resolve, reject) => {
    const invalidProducts = [];
    let checked = 0;

    selectedProducts.forEach(({ product_id, quantity }) => {
      const query = `
        SELECT sp.minimum_quantity, p.product_name
        FROM supplier_products sp
        JOIN products p ON sp.pro_id = p.id
        WHERE sp.supp_id = ? AND sp.pro_id = ?
      `;

      db.execute(query, [supplierId, product_id], (err, results) => {
        checked++;
        if (err || results.length === 0 || quantity < results[0].minimum_quantity) {
          const error = err ? 'Error checking supplier product' :
            results.length === 0 ? `Supplier does not supply product ID ${product_id}` :
            `Product ${results[0].product_name} has invalid quantity. Minimum: ${results[0].minimum_quantity}`;

          invalidProducts.push({ product_id, error });
        }

        if (checked === selectedProducts.length) {
          return invalidProducts.length > 0 ? reject(invalidProducts) : resolve();
        }
      });
    });
  });
};

const createOrder = (supplier_id, products) => {
  return new Promise((resolve, reject) => {
    const insertOrderQuery = `INSERT INTO orders (supp_id, status) VALUES (?, 'pending')`;
    db.execute(insertOrderQuery, [supplier_id], (err, result) => {
      if (err) return reject("Failed to create order");

      const orderId = result.insertId;
      const itemQuery = `INSERT INTO order_items (order_id, pro_id, quantity) VALUES (?, ?, ?)`;

      products.forEach(({ product_id, quantity }) => {
        db.execute(itemQuery, [orderId, product_id, quantity], (err) => {
          if (err) console.error("Failed to insert product:", err);
        });
      });
      console.log("Order Data:",  ); // Log the data before sending it

      resolve(orderId);
    });
  });
};

module.exports = {
  getAllOrders,
  completeOrder,
  getSuppliers,
  getSupplierProducts,
  validateOrder,
  createOrder,
};
