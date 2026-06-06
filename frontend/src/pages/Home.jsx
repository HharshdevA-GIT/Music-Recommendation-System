import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-black to-indigo-900 text-white flex flex-col justify-center items-center">
<Navbar />
      <h1 className="text-5xl font-bold mb-4">
        🎵 Music Recommendation System
      </h1>

      <p className="text-gray-300 text-lg mb-10">
        Discover songs tailored to your taste
      </p>

      <div className="flex gap-5">
        <Link to="/register">
          <button className="bg-purple-600 px-6 py-3 rounded-xl hover:bg-purple-700 transition">
            Register
          </button>
        </Link>

        <Link to="/login">
          <button className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            Login
          </button>
        </Link>

        <Link to="/recommendations">
          <button className="bg-green-600 px-6 py-3 rounded-xl hover:bg-green-700 transition">
            Recommendations
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;