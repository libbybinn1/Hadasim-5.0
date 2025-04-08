import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';

function CreateOrder() {
  const { supplierId } = useParams();
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(""); 
  const navigate = useNavigate();  
  const formRef = useRef(null);  

  useEffect(() => {
    // Function to fetch products from the server
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/owner/suppliers/${supplierId}/products`);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data);  
        setLoading(false);  
      } catch (error) {
        console.error(error);  
      }
    };

    fetchProducts();
  }, [supplierId]);  

  const handleSubmit = async (e) => {
    e.preventDefault();  
    setError("");  
    
    // Get all input elements of type number from the form
    const form = formRef.current;
    const inputs = form.querySelectorAll('input[type="number"]');
    
    // Create an array of selected products with their quantities and prices
    const selectedProducts = [];
    inputs.forEach(input => {
      const productId = input.getAttribute('data-product-id');
      const quantity = parseInt(input.value) || 0;  // Default to 0 if the quantity is invalid
      
      if (quantity > 0) {
        const productDetails = products.find(p => p.product_id == productId);
        selectedProducts.push({
          product_id: productId,
          quantity: quantity,
          price: productDetails.price
        });
      }
    });
    
    // Check if at least one product is selected
    if (selectedProducts.length === 0) {
      setError("Please select at least one product.");
      return;
    }

    // Validate if the selected quantity meets the minimum required quantity for each product
    for (const selected of selectedProducts) {
      const productDetails = products.find(p => p.product_id == selected.product_id);
      if (productDetails && selected.quantity < productDetails.minimum_quantity) {
        setError(`Product ${productDetails.product_name} has an invalid quantity. Minimum required is ${productDetails.minimum_quantity}.`);
        return;
      }
    }
    
    // Prepare the order data for submission
    const orderData = {
      supplier_id: supplierId,
      products: selectedProducts,
    };

    try {
      // Send a POST request to create the order
      const res = await fetch('http://localhost:5000/api/owner/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),  
      });

      if (!res.ok) {
        throw new Error('Failed to create order');
      }

      const data = await res.json();  
      console.log('Order placed successfully:', data); 
      navigate('/owner/dashboard');  
    } catch (error) {
      console.error(error); 
      setError("Failed to create order. Please try again.");  
    }
  };

  const GoBack = () => navigate("/owner/order");  

  return (
    <div>
      <h2>Place Order for Supplier</h2>
      <div><LogoutButton /></div> 
      <button onClick={GoBack} className="create-order-button">
        Back
      </button>
      {loading ? (
        <p>Loading products...</p>  
      ) : (
        <form ref={formRef} onSubmit={handleSubmit}>
          <h3>Select Products</h3>
          <ul>
            {products.map((product) => (
              <li key={product.product_id}>
                <div>
                  <strong>{product.product_name}</strong> - ₪{product.price}
                  <br />
                  <span>Minimum quantity: {product.minimum_quantity}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  data-product-id={product.product_id}
                  placeholder="Quantity"
                  defaultValue=""
                />
              </li>
            ))}
          </ul>

          {error && <p style={{ color: 'red' }}>{error}</p>}  

          <button type="submit">Create Order</button> 
        </form>
      )}
    </div>
  );
}

export default CreateOrder;
