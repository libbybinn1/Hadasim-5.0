import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';  


export default function Order() {
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/owner/suppliers');
        if (!res.ok) {
          throw new Error('Failed to fetch suppliers');
        }
        const data = await res.json();
        console.log('Fetched suppliers:', data); 
        setSuppliers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSuppliers();
  }, []);
  const GoBack = () => navigate("/owner/dashboard");


  return (
    <div>
      <h2>Select a Supplier to Place an Order</h2>
      <div> <LogoutButton /></div>
      <button onClick={GoBack} className="create-order-button">Back</button>
      {suppliers.length > 0 ? (
        <ul>
          {suppliers.map(supplier => (
            <li key={supplier.supplier_id}>
              <strong>{supplier.company_name}</strong>
              <br />
              <span>Representative: {supplier.representative_name}</span>
              <br />
              <span>Phone: {supplier.phone_number}</span>
              <br />
              <button
                onClick={() => {
                  console.log('Navigating to:', `/owner/create-order/${supplier.supplier_id}`);
                  navigate(`/owner/create-order/${supplier.supplier_id}`);
                }}
              >
                Order
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No suppliers available.</p>
      )}
    </div>
  );
}
