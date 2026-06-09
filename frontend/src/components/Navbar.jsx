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
          to="/dashboard"
          className="text-white hover:text-green-400"
        >
          📊 Dashboard
        </Link>

        <Link
          to="/profile"
          className="text-white hover:text-blue-400"
        >
          👤 Profile
        </Link>

        <Link
          to="/recommendations"
          className="text-white hover:text-purple-400"
        >
          Recommendations
        </Link>

        <Link
          to="/favorites"
          className="text-white hover:text-pink-400"
        >
          ❤️ Favorites
        </Link>

        <Link
          to="/playlists"
          className="text-white hover:text-cyan-400"
        >
          🎶 Playlists
        </Link>

        <Link
          to="/recently-played"
          className="text-white hover:text-yellow-400"
        >
          🕒 Recently Played
        </Link>

        <Link
          to="/admin"
          className="text-white hover:text-orange-400"
        >
          ⚙️ Admin
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