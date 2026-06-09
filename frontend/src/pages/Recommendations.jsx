import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Recommendations() {
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await API.get("/songs");
      setRecommendations(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = recommendations.filter(
    (item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.artist?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950">
      <Navbar />

      <div className="px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-extrabold text-white">
            Discover Your Music
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Songs from your database
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="🔍 Search song or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-2xl px-5 py-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none"
          />
        </div>

        {loading ? (
          <div className="text-center text-white">
            Loading...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredRecommendations.map((song) => (
              <div
                key={song._id}
                onClick={() => navigate(`/song/${song._id}`)}
                className="bg-white/10 rounded-2xl p-5 cursor-pointer"
              >
                <img
                  src={song.coverImage}
                  alt={song.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />

                <h2 className="text-xl font-bold text-white">
                  {song.title}
                </h2>

                <p className="text-gray-300">
                  {song.artist}
                </p>

                <p className="text-purple-300 mb-4">
                  {song.genre}
                </p>

                <audio controls className="w-full">
                  <source
                    src={song.audioUrl}
                    type="audio/mpeg"
                  />
                </audio>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;