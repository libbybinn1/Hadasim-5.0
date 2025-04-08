const express = require("express");
const router = express.Router();
const supplierService = require("../services/supplierService");

const processOrderResults = (results) => {
  const ordersMap = {};
  results.forEach((row) => {
    if (!ordersMap[row.order_id]) {
      ordersMap[row.order_id] = {
        id: row.order_id,
        status: row.status,
        order_date: row.order_date,
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
  return Object.values(ordersMap);
};

router.get("/:supplierId/orders", async (req, res) => {
  try {
    const results = await supplierService.getSupplierOrders(req.params.supplierId);
    const orders = results.length ? processOrderResults(results) : [];
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
  }
});

router.put("/:supplierId/orders/:orderId/approve", async (req, res) => {
  try {
    const result = await supplierService.approveOrder(req.params.supplierId, req.params.orderId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found or not authorized" });
    }
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating order status", error: err });
  }
});

module.exports = router;

