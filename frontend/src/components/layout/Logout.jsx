import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: clear auth data
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300"
    >
      Logout
    </button>
  );
}