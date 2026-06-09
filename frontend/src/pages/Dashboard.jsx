import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [stats, setStats] = useState({
    favorites: 0,
    playlists: 0,
    recentlyPlayed: 0,
    totalSongs: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await API.get("/dashboard");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-5xl text-center text-white font-bold mb-10">
          📊 Dashboard
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-pink-600 rounded-3xl p-6 text-white">
            <h2 className="text-2xl font-bold">❤️ Favorites</h2>
            <p className="text-4xl mt-4">{stats.favorites}</p>
          </div>

          <div className="bg-cyan-600 rounded-3xl p-6 text-white">
            <h2 className="text-2xl font-bold">🎶 Playlists</h2>
            <p className="text-4xl mt-4">{stats.playlists}</p>
          </div>

          <div className="bg-yellow-500 rounded-3xl p-6 text-white">
            <h2 className="text-2xl font-bold">🕒 Recent</h2>
            <p className="text-4xl mt-4">{stats.recentlyPlayed}</p>
          </div>

          <div className="bg-purple-600 rounded-3xl p-6 text-white">
            <h2 className="text-2xl font-bold">🎵 Songs</h2>
            <p className="text-4xl mt-4">{stats.totalSongs}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;