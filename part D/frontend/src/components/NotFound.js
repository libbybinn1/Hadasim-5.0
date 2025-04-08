import { Link } from "react-router-dom";

//Defualt component for all err urls, or unvalid url.
export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/" className="btn">Go to Home</Link>
    </div>
  );
}
