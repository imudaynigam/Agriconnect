import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("agri-user"));
    const role = user?.role;

    if (role === "farmer") navigate("/Farmer/farmer-dashboard");
    else if (role === "investor") navigate("/Investor/investor-dashboard");
    else if (role === "customer") navigate("/Customer/customer-dashboard");
    else navigate("/login"); // fallback
  }, [navigate]);

  return <p className="p-4 text-gray-600">Redirecting to your dashboard...</p>;
}