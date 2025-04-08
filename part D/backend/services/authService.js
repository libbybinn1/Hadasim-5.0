const db = require("../db");

// Login Logic
async function loginUser(phone, password) {
  if (!phone || !password) {
    throw { status: 400, message: "All fields are required" };
  }

  const [user] = await query("SELECT * FROM users WHERE phone_number = ? AND password = ?", [phone, password]);

  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  if (user.role === "supplier") {
    return getSupplierData(user);
  }

  return {
    user: {
      id: user.user_id,
      phone: user.phone_number,
      role: user.role
    },
    role: "admin",
    redirect: "/admin/dashboard"
  };
}

async function getSupplierData(user) {
  const [supplier] = await query("SELECT * FROM suppliers WHERE id = ?", [user.user_id]);

  if (!supplier) {
    throw { status: 404, message: "Supplier record not found for this user" };
  }

  return {
    user: {
      id: user.user_id,
      phone: user.phone_number,
      role: user.role,
      companyName: supplier.company_name,
      representativeName: supplier.representative_name
    },
    role: "supplier",
    redirect: "/supplier/dashboard"
  };
}

// Register Logic
async function registerSupplier(data) {
    const { company_name, representative_name, phone_number, password, products } = data;
  
    if (!company_name || !representative_name || !phone_number || !password || !products || !products.length) {
      throw { status: 400, message: "All fields are required" };
    }
  
    const [existingUser] = await query("SELECT * FROM users WHERE phone_number = ?", [phone_number]);
    if (existingUser) {
      throw { status: 400, message: "User already exists. Please log in." };
    }
  
    const userResult = await insert(
      "INSERT INTO users (phone_number, password, role) VALUES (?, ?, 'supplier')",
      [phone_number, password]
    );
  
    const userId = userResult.insertId;
  
    await insert(
      "INSERT INTO suppliers (id, company_name, representative_name) VALUES (?, ?, ?)",
      [userId, company_name, representative_name]
    );
  
    await Promise.all(products.map(p => processProduct(userId, p)));
  
    const user = {
      id: userId,
      phone: phone_number,
      role: "supplier",
      companyName: company_name,
      representativeName: representative_name
    };
  
    return {
      message: "Supplier registered successfully!",
      user,
      role: "supplier",
      redirect: "/supplier/dashboard"
    };
  }
  
async function processProduct(userId, { product_name, price, minimum_quantity }) {
  if (!product_name || !price || !minimum_quantity) return;

  const nameLower = product_name.toLowerCase();
  const [existing] = await query("SELECT * FROM products WHERE LOWER(product_name) = ?", [nameLower]);

  const productId = existing
    ? existing.id
    : (await insert("INSERT INTO products (product_name) VALUES (?)", [product_name])).insertId;

  await insert(
    "INSERT INTO supplier_products (supp_id, pro_id, price, minimum_quantity) VALUES (?, ?, ?, ?)",
    [userId, productId, price, minimum_quantity]
  );
}

// Helper functions
function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function insert(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

module.exports = {
  loginUser,
  registerSupplier
};
