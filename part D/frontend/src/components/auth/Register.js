import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthForm.css";

export default function Register() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [productCount, setProductCount] = useState(1); 

  const backToLogIn = () => navigate("/");

  // Basic form validation logic
  const validateForm = (data) => {
    const { password, pass, phone_number, products } = data;

    if (password !== pass) {
      alert("Passwords do not match!");
      return false;
    }

    if (phone_number.length !== 10 || isNaN(phone_number)) {
      alert("Phone number must be 10 digits!");
      return false;
    }

    for (let product of products) {
      if (parseFloat(product.price) <= 0) {
        alert("Price must be greater than 0!");
        return false;
      }
      if (parseInt(product.minimum_quantity) <= 0) {
        alert("Minimum quantity must be greater than 0!");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;

    // Collect all form input values into a single object
    const formData = {
      company_name: form.company_name.value.trim(),
      representative_name: form.representative_name.value.trim(),
      phone_number: form.phone_number.value.trim(),
      password: form.password.value,
      pass: form.pass.value,
      products: []
    };

    for (let i = 0; i < productCount; i++) {
      formData.products.push({
        product_name: form[`product_name_${i}`].value.trim(),
        price: form[`price_${i}`].value.trim(),
        minimum_quantity: form[`minimum_quantity_${i}`].value.trim()
      });
    }

    if (!validateForm(formData)) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          products: formData.products
        })
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        navigate("/supplier/dashboard");
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  const addProduct = () => {
    setProductCount((prev) => prev + 1);
  };

  return (
    <div className="form-box">
      <h2>Supplier Registration</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        {["company_name", "representative_name", "phone_number", "password", "pass"].map((field, i) => (
          <div className="user-box" key={i}>
            <input
              name={field}
              type={field.includes("password") ? "password" : "text"}
              required
            />
            <label>{field.replace("_", " ").replace("pass", "Confirm Password")}</label>
          </div>
        ))}

        <h4>Products</h4>
        {[...Array(productCount)].map((_, index) => (
          <div key={index} className="product-box">
            <h5>Product {index + 1}</h5>
            <div className="user-box">
              <input
                name={`product_name_${index}`}
                type="text"
                placeholder="Product Name"
                required
              />
            </div>
            <div className="user-box">
              <input
                name={`price_${index}`}
                type="number"
                placeholder="Price"
                required
              />
            </div>
            <div className="user-box">
              <input
                name={`minimum_quantity_${index}`}
                type="number"
                placeholder="Minimum Quantity"
                required
              />
            </div>
          </div>
        ))}

        <button type="button" className="btn" onClick={addProduct}>+ Add Product</button>
        <button type="submit" className="btn">Register</button>
        <button type="button" className="btn btn-secondary" onClick={backToLogIn}>Back to Login</button>
      </form>
    </div>
  );
}
