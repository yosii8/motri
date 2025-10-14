import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Remove JWT token from localStorage
    localStorage.removeItem("token");

    // ✅ Optional: small delay to show message (for UX)
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 300); // 0.3s delay

    // ✅ Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-gray-900">
      <p className="text-lg font-medium">Logging out...</p>
    </div>
  );
};

export default Logout;
