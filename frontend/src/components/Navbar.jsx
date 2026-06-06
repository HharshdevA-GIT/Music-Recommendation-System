import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-black/30 backdrop-blur-lg border-b border-white/10">
      <Link to="/">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          🎵 MusicAI
        </h1>
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/" className="text-white hover:text-purple-400">
          Home
        </Link>

        <Link
          to="/recommendations"
          className="text-white hover:text-purple-400"
        >
          Recommendations
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700 text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
