import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // If no user or role mismatch → redirect or show 404
  if (!user || (role && user.role !== role)) {
    return <Navigate to="/not-found" />;
  }

  // All good → render the protected children
  return children;
}
