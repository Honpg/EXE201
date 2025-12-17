import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import iconPng from '../assets/icon.png';
import { useEffect } from 'react';

function Navbar() {
  const { state, dispatch } = useAuthContext();
  
  // Debug để kiểm tra thông tin user
  useEffect(() => {
    console.log("Navbar - Current user state:", state.user);
  }, [state.user]);

  async function handleLogout() {
    await fetch("/api/oauth/logout");
    toast.success("Logged out!");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <nav className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 p-4 flex justify-between items-center shadow-lg">
      {/* Left side - Ocean AI logo */}
      <div className="text-white text-2xl font-bold">
        <Link to="/" className="nav-name transition-all duration-300 ease-in-out px-3 py-2 rounded-lg hover:bg-white hover:text-gray-800 flex items-center space-x-2">
          <img src={iconPng} alt="Ocean AI" className="w-8 h-8" />
          <span>Ocean AI</span>
        </Link>
      </div>

      {/* Right side - Navigation links and user greeting */}
      <div className="flex items-center space-x-6">
        {state?.user ? (
          <>
           <Link to="/" className="text-white transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-white hover:text-gray-800">
              Home
            </Link>
             <Link to="/dashboard" className="text-white transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-white hover:text-gray-800">
              Dashboard
            </Link>
            <Link to="/transaction" className="text-white transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-white hover:text-gray-800">
              Transaction
            </Link>
            <span className="text-white text-lg font-medium">
              Hey, <strong>{state.user?.name || "Ocean User"}</strong>!
            </span>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="text-white transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-white hover:text-gray-800">
              Home
            </Link>
            <Link to="/login" className="text-white transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-white hover:text-gray-800">
              Login
            </Link>
            
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
