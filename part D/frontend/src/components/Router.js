import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./auth/LoginPage";
import Register from './auth/Register';
import OwnerDashboard from "./owner/OwnerDashboard";
import SupplierDashboard from "./supplier/SupplierDashboard";
import Order from "./owner/Order";
import CreateOrder from "./owner/CreateOrder";
import ProtectedRoute from './ProtectedRoute';
import NotFound from './NotFound';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/logIn" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        <Route path="/owner/dashboard" element={
          <ProtectedRoute role="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/supplier/dashboard" element={
          <ProtectedRoute role="supplier">
            <SupplierDashboard />
          </ProtectedRoute>
        } />
        <Route path="/owner/order" element={
          <ProtectedRoute role="owner">
            <Order />
          </ProtectedRoute>
        } />
        <Route path="/owner/create-order/:supplierId" element={
          <ProtectedRoute role="owner">
            <CreateOrder />
          </ProtectedRoute>
        } />

        {/* Catch-all for 404 */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
