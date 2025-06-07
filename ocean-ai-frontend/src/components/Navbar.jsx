import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Navbar() {
  const { state, dispatch } = useAuthContext();

  async function handleLogout() {
    await fetch("/api/oauth/logout");
    toast.success("Logged out!");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <nav className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 p-4 flex justify-between items-center shadow-lg">
      {/* Left side - Ocean AI logo */}
      <div className="flex items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300 flex items-center"
        >
          Ocean AI
        </Link>
      </div>

      {/* Right side - Navigation links and user greeting */}
      <div className="flex items-center space-x-4">
        {state?.user ? (
          <>
            <Link to="/" className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300">
              Home
            </Link>
            <Link to="/dashboard" className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300">
              Dashboard
            </Link>
            <span className="text-white text-lg px-2">
              Hey, <strong>{state.user.name}</strong>!
            </span>
            <button
              onClick={handleLogout}
              className="bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300">
              Home
            </Link>
            <Link to="/login" className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
