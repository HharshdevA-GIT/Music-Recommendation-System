import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await API.get("/favorites");
        setFavorites(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (favoriteId) => {
    try {
      await API.delete(`/favorites/${favoriteId}`);

      setFavorites(
        favorites.filter((fav) => fav._id !== favoriteId)
      );

      alert("Removed from Favorites ❌");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950">
      <Navbar />

      <div className="px-6 py-10">
        <h1 className="text-5xl font-bold text-center text-white mb-10">
          ❤️ My Favorites
        </h1>

        {loading ? (
          <div className="text-center text-white">
            Loading...
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center text-gray-400 text-2xl">
            No Favorites Yet 🎵
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((fav) => (
              <div
                key={fav._id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6"
              >
                <img
                  src={fav.songId?.coverImage}
                  alt={fav.songId?.title}
                  className="w-full h-60 object-cover rounded-2xl mb-4"
                />

                <h2 className="text-2xl text-white font-bold">
                  {fav.songId?.title}
                </h2>

                <p className="text-gray-300 mt-2">
                  🎤 {fav.songId?.artist}
                </p>

                <p className="text-gray-400 mt-1">
                  💿 {fav.songId?.album}
                </p>

                <button
                  onClick={() => removeFavorite(fav._id)}
                  className="mt-5 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl"
                >
                  ❌ Remove Favorite
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;