const express = require("express");
const { validationResult } = require("express-validator");
const {
  getAllOrders,
  completeOrder,
  getSuppliers,
  getSupplierProducts,
  validateOrder,
  createOrder,
} = require("../services/ownerService");

const router = express.Router();

// Fetch all orders from the database, including associated products
router.get("/orders", async (req, res) => {
  try {
    const results = await getAllOrders();
    if (!Array.isArray(results) || results.length === 0) return res.json([]);

    const ordersMap = {};
    results.forEach((row) => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          id: row.order_id,
          status: row.status,
          order_date: row.order_date,
          company_name: row.company_name,
          representative_name: row.representative_name,
          supplier_phone: row.supplier_phone,
          products: [],
        };
      }
      if (row.product_id) {
        ordersMap[row.order_id].products.push({
          product_id: row.product_id,
          product_name: row.product_name,
          quantity: row.quantity,
          price: row.price,
        });
      }
    });

    res.json(Object.values(ordersMap));
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
  }
});

// Mark the specified order as completed in the database
router.put("/orders/:orderId", async (req, res) => {
  try {
    const result = await completeOrder(req.params.orderId);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, message: "Order marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Error updating order status", error: err });
  }
});

// Get a list of all suppliers from the database
router.get("/suppliers", async (req, res) => {
  try {
    const results = await getSuppliers();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching suppliers", error: err });
  }
});

// Get all products for a specific supplier by ID
router.get("/suppliers/:supplier_id/products", async (req, res) => {
  try {
    const results = await getSupplierProducts(req.params.supplier_id);
    if (!results || results.length === 0)
      return res.status(404).json({ message: "No products found for this supplier" });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
});

//Create on order.
router.post("/create-order", async (req, res) => {
  const { supplier_id, products } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    await validateOrder(products, supplier_id);
    const orderId = await createOrder(supplier_id, products);
    res.status(201).json({ order_id: orderId, message: "Order created successfully" });
  } catch (err) {
    res.status(400).json({ message: "Order validation failed", errors: err });
  }
});

module.exports = router;
