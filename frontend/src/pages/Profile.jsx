import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Profile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/profile");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-5xl font-bold text-center text-white mb-10">
          👤 My Profile
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">
            {data.user.username}
          </h2>

          <p className="text-gray-300 text-lg mb-6">
            📧 {data.user.email}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-pink-600 rounded-3xl p-6 text-white">
              <h3 className="text-xl font-bold">❤️ Favorites</h3>
              <p className="text-4xl mt-3">{data.favorites}</p>
            </div>

            <div className="bg-cyan-600 rounded-3xl p-6 text-white">
              <h3 className="text-xl font-bold">🎶 Playlists</h3>
              <p className="text-4xl mt-3">{data.playlists}</p>
            </div>

            <div className="bg-yellow-500 rounded-3xl p-6 text-white">
              <h3 className="text-xl font-bold">🕒 Recent</h3>
              <p className="text-4xl mt-3">{data.recentlyPlayed}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl text-white font-bold mb-4">
              🎵 Favorite Genres
            </h3>

            <div className="flex flex-wrap gap-3">
              {data.user.favoriteGenres?.map((genre, index) => (
                <span
                  key={index}
                  className="bg-purple-600 px-4 py-2 rounded-xl text-white"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl text-white font-bold mb-4">
              🎤 Favorite Artists
            </h3>

            <div className="flex flex-wrap gap-3">
              {data.user.favoriteArtists?.map((artist, index) => (
                <span
                  key={index}
                  className="bg-pink-600 px-4 py-2 rounded-xl text-white"
                >
                  {artist}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;