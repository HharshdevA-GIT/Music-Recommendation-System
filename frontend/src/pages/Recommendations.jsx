import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";





function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        await API.put("/users/preferences", {
  favoriteGenres: ["Pop", "Rock"],
  favoriteArtists: ["The Weeknd", "Ed Sheeran"],
});
        const res = await API.get("/recommendations");
        setRecommendations(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const filteredRecommendations = recommendations.filter(
    (item) =>
      item.songId?.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.songId?.artist
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950">
      <Navbar />

      <div className="px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            Discover Your Music
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Personalized recommendations powered by AI
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="🔍 Search song or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-2xl px-5 py-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none focus:border-purple-500 backdrop-blur-lg"
          />
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredRecommendations.length === 0 ? (
          <div className="text-center text-gray-400 text-2xl">
            No Recommendations Found 🎵
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecommendations.map((item) => (
              <div
                key={item._id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-purple-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-4xl shadow-lg mb-5">
                    🎵
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {item.songId?.title || "Unknown Song"}
                  </h2>

                  <p className="text-gray-300 text-lg mb-5">
                    🎤 {item.songId?.artist || "Unknown Artist"}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold">
                      {item.score || 95}% Match
                    </span>

                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white transition">
                      Play
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;