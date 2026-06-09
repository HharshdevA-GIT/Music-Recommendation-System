import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function RecentlyPlayed() {
  const [songs, setSongs] = useState([]);

  const loadRecentlyPlayed = async () => {
    try {
      const res = await API.get("/recently-played");
      setSongs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadRecentlyPlayed();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-5xl font-bold text-center text-white mb-10">
          🕒 Recently Played
        </h1>

        {songs.length === 0 ? (
          <p className="text-center text-gray-400 text-xl">
            No Recently Played Songs
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {songs.map((item) => (
              <div
                key={item._id}
                className="bg-white/5 border border-white/10 rounded-3xl p-5"
              >
                <img
                  src={item.songId?.coverImage}
                  alt={item.songId?.title}
                  className="w-full h-56 object-cover rounded-2xl"
                />

                <h2 className="text-xl font-bold text-white mt-4">
                  {item.songId?.title}
                </h2>

                <p className="text-gray-300 mt-2">
                  🎤 {item.songId?.artist}
                </p>

                <p className="text-gray-400">
                  🎵 {item.songId?.genre}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentlyPlayed;